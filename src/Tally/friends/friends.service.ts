import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { FIRESTORE } from '../Firebase/firebase.module';
import { Friend } from './types/create-friends.types';
import { User } from '../users/types/create-user.types';
import { SearchFriendDto } from './dto/search-friend.dto';
import { Filter } from 'firebase-admin/firestore';
import { friendReqInfo } from './types/get-friend-info.types';
import { acceptFriendRequest } from './types/accept-friend-request.types';
import { declineRequest } from './types/decline-friend-request.types';
import { friendRequest } from './types/friend-request-direction.types';

@Injectable()
export class FriendsService {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}

  async search(filter: SearchFriendDto): Promise<User[]> {
    const { id, email, handle } = filter;

    const conditions: Filter[] = [];
    if (id) conditions.push(Filter.where('id', '==', id));
    if (email)
      conditions.push(Filter.where('email', '==', email.toLowerCase()));
    if (handle) conditions.push(Filter.where('handle', '==', handle));

    if (!conditions.length) {
      throw new BadRequestException('Provide an id, email or handle');
    }

    const snap = await this.db
      .collection('users')
      .where(Filter.or(...conditions))
      .get();

    // filter out soft-deleted users in code (avoids needing an extra index)
    const users = snap.docs
      .map((doc) => doc.data() as User)
      .filter((user) => !user.deletedAt);

    if (!users.length) {
      throw new NotFoundException('User not found');
    }

    return users;
  }

  async sendFriendRequest(userId: string, friendId: string): Promise<Friend> {
    if (userId === friendId) {
      throw new ConflictException(
        'You can not send a Friend Request to yourself',
      );
    }

    const userRef = this.db.collection('users').doc(userId);
    const friendRef = this.db.collection('users').doc(friendId);

    const friendshipId = [userRef.id, friendRef.id].sort().join('_');

    const pairFriendIdRef = this.db.collection('friends').doc(friendshipId);

    return this.db.runTransaction(async (transaction) => {
      const [userIdSnap, friendIdSnap, friendshipIdSnap] = await Promise.all([
        await transaction.get(userRef),
        await transaction.get(friendRef),
        await transaction.get(pairFriendIdRef),
      ]);

      if (!userIdSnap.exists || userIdSnap.data()?.deletedAt !== null) {
        throw new NotFoundException("sender doesn't exist");
      }
      if (!friendIdSnap.exists || friendIdSnap.data()?.deletedAt !== null) {
        throw new NotFoundException(
          "User you are trying to send request doesn't exist",
        );
      }
      if (friendshipIdSnap.data()?.status === 'accepted') {
        throw new ConflictException('Aleady a friend');
      }
      if (friendshipIdSnap.data()?.status === 'pending') {
        throw new ConflictException('Aleady sent a request');
      }

      const request: Friend = {
        id: pairFriendIdRef.id,
        userId: userId,
        friendId: friendId,
        status: 'pending',
        createdAt: new Date().toString(),
        updatedAt: null,
        removedAt: null,
      };

      transaction.set(pairFriendIdRef, request);

      return request;
    });
  }

  async acceptFriendRequest(
    sentBy: string,
    sentTo: string,
    friendRequestId: string,
  ): Promise<acceptFriendRequest> {
    const requestRef = this.db.collection('friends').doc(friendRequestId);

    return this.db.runTransaction(async (transaction) => {
      const requestSnapshot = await transaction.get(requestRef);

      if (!requestSnapshot.exists) {
        throw new NotFoundException('Request not found');
      }

      const request = requestSnapshot.data() as Friend;

      if (request.userId !== sentBy) {
        throw new NotFoundException('Sender Id is wrong');
      }

      if (request.friendId !== sentTo) {
        throw new NotFoundException('Reciever Id is wrong');
      }

      if (request.status === 'accepted') {
        throw new ConflictException('Already a friend');
      }

      if (request.status === 'decline') {
        throw new ConflictException('Friend Request was declined');
      }

      const updatedAt = new Date().toString();

      transaction.update(requestRef, {
        status: 'accepted',
        updatedAt: updatedAt,
      });

      return {
        id: request.id,
        createdAt: request.createdAt,
        updatedAt: updatedAt,
        status: 'accepted',
      };
    });
  }

  async declineFriendRequest(requestId: string): Promise<declineRequest> {
    const requestRef = this.db.collection('friends').doc(requestId);

    return this.db.runTransaction(async (transaction) => {
      const requestDataSnap = await requestRef.get();

      if (!requestDataSnap.exists) {
        throw new NotFoundException("The request doesn't exist");
      }

      const request = requestDataSnap.data() as Friend;

      if (request.status === 'decline') {
        throw new ConflictException('This request was already declined.');
      }

      const updatedAt = new Date().toString();

      if (request.status === 'pending') {
        transaction.update(requestRef, {
          status: 'decline',
          updatedAt: updatedAt,
        });
      }
      return {
        friendId: request.friendId,
        status: 'decline',
      };
    });
  }

  async removeFriend(userId: string, friendUserId: string): Promise<void> {
    const friendshipId = [userId, friendUserId].sort().join('_');

    const friendshipRef = this.db.collection('friends').doc(friendshipId);

    return this.db.runTransaction(async (transaction) => {
      const friendshipDocSnap = await transaction.get(friendshipRef);

      if (!friendshipDocSnap.exists) {
        throw new NotFoundException('Not your friend!');
      }

      const friendship = friendshipDocSnap.data() as Friend;

      if (friendship.status !== 'accepted') {
        throw new ConflictException('You are not friends!');
      }

      transaction.delete(friendshipRef);
    });
  }

  async listFriendRequests(
    userId: string,
    direction: 'incoming' | 'outgoing' | 'all',
  ): Promise<friendRequest[]> {
    const friendsCollection = this.db.collection('friends');

    const incomingRequests = () =>
      friendsCollection
        .where('friendId', '==', userId)
        .where('status', '==', 'pending')
        .get();

    const outgoingRequests = () =>
      friendsCollection
        .where('userId', '==', userId)
        .where('status', '==', 'pending')
        .get();

    const requestsList: friendRequest[] = [];

    if (direction === 'incoming' || direction === 'all') {
      const incomingDocSnap = await incomingRequests();
      incomingDocSnap.forEach((element) => {
        requestsList.push({
          ...(element.data() as friendReqInfo),
          direction: 'incoming',
        });
      });
    }
    if (direction === 'outgoing' || direction === 'all') {
      const outgoingDocSnap = await outgoingRequests();
      outgoingDocSnap.forEach((element) => {
        requestsList.push({
          ...(element.data() as friendReqInfo),
          direction: 'outgoing',
        });
      });
    }
    return requestsList;
  }
}

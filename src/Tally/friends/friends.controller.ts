import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateUserResponseDto } from '../users/dto/create-user-response.dto';
import { apiResponseGenerator } from '../users/helpers/apiResponseGenerator';
import { User } from '../users/types/create-user.types';
import { AcceptRequestDto } from './dto/accept-request.dto';
import { RemoveFriendQureyDto } from './dto/remove-friend.dto';
import { SearchFriendDto } from './dto/search-friend.dto';
import { SendRequestDto } from './dto/send-request.dto';
import { FriendsService } from './friends.service';
import { Friend } from './types/create-friends.types';
import { declineRequest } from './types/decline-friend-request.types';
import { friendRequest } from './types/friend-request-direction.types';
import { acceptFriendRequest } from './types/accept-friend-request.types';

@Controller('/friends')
export class FriendsController {
  constructor(private readonly FirendsService: FriendsService) {}

  @Post('sendRequest')
  @apiResponseGenerator({
    operation: 'Send a friend request',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: 'You can not send a Friend Request to yourself',
      },
      {
        status: 404,
        description: "sender doesn't exist",
      },
      {
        status: 404,
        description: "User you are trying to send request doesn't exist",
      },
      {
        status: 409,
        description: 'Aleady a friend',
      },
      {
        status: 409,
        description: 'Aleady sent a request',
      },
    ],
  })
  async sendRequest(@Body() sendRequestDto: SendRequestDto): Promise<Friend> {
    const request = await this.FirendsService.sendFriendRequest(
      sendRequestDto.userId,
      sendRequestDto.friendId,
    );

    return request;
  }

  @Post(':requestId/accept')
  @apiResponseGenerator({
    operation: 'Accept a friend request',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: "sender Id is wrong",
      },
      {
        status: 404,
        description: "Reciever Id is wrong",
      },
      {
        status: 409,
        description: 'Aleady a friend',
      },
      {
        status: 409,
        description: 'Friend Request was declined',
      },
    ],
  })
  async acceptRequest(
    @Body() AcceptRequestDto: AcceptRequestDto,
    @Param('requestId') requestId: string,
  ): Promise<acceptFriendRequest> {
    const acceptedRequest = await this.FirendsService.acceptFriendRequest(
      AcceptRequestDto.sentBy,
      AcceptRequestDto.sentTo,
      requestId,
    );
    return acceptedRequest;
  }

  @Post(':requestId/decline')
  @apiResponseGenerator({
    operation: 'Decline a friend request',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 201,
        description: 'Declined successfully',
      },
      {
        status: 409,
        description: 'This request was already declined.'
      }
    ],
  })
  async decline(
    @Param('requestId') requestId: string,
  ): Promise<declineRequest> {
    const declinedRequest =
      await this.FirendsService.declineFriendRequest(requestId);

    return declinedRequest;
  }

  @Get('search')
  @apiResponseGenerator({
    operation: 'Search a user to send them a friend request',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 200,
        description: 'User Found',
        type: [CreateUserResponseDto],
      },
      {
        status: 404,
        description: 'Provide an id, email or handle',
      },
    ],
  })
  async search(@Query() SearchFriendDto: SearchFriendDto): Promise<User[]> {
    const user = await this.FirendsService.search(SearchFriendDto);

    return user;
  }

  @Delete(':friendId')
  @apiResponseGenerator({
    operation: 'To remove a friend',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: 'Not your friend!',
      }
    ],
  })
  async removeFriend(
    @Query() currentUserId: RemoveFriendQureyDto,
    @Param('friendId') friendId: string,
  ): Promise<void> {
    await this.FirendsService.removeFriend(currentUserId.userId, friendId);
  }

  @Get('friendRequests/:userId')
  @ApiQuery({
    name: 'direction',
    required: true,
    enum: ['incoming', 'outgoing', 'all'],
  })
  @ApiParam({ name: 'userId', example: 'zfwk' })
  @apiResponseGenerator({
    operation: 'List of friend requests',
    httpCode: HttpStatus.OK,
    responses: [],
  })
  async friendRequestList(
    @Param('userId') userId: string,
    @Query('direction') direction: 'incoming' | 'outgoing' | 'all',
  ): Promise<friendRequest[]> {
    const list = await this.FirendsService.listFriendRequests(
      userId,
      direction,
    );

    return list;
  }
}


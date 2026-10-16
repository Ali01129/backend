import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SendRequestDto } from './dto/send-request.dto';
import { Friend } from './types/create-friends.types';
import { AcceptRequestDto } from './dto/accept-request.dto';
import { SendRequestResponseDto } from './dto/send-request-response.dto';
import { SearchFriendDto } from './dto/search-friend.dto';
import { CreateUserResponseDto } from '../users/dto/create-user-response.dto';
import { User } from '../users/types/create-user.types';
import { RemoveFriendQureyDto } from './dto/remove-friend.dto';
import { friendReqInfo } from './types/get-friend-info.types';
import {declineRequest} from "./types/decline-friend-request.types";
import {friendRequest} from "./types/friend-request-direction.types";

@Controller('/friends')
export class FriendsController {
  constructor(private readonly FirendsService: FriendsService) {}

  @Post('sendRequest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({
    status: 200,
    description: 'Request sent successfully',
    type: SendRequestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 404,
    description: 'You can not send a Friend Request to yourself',
  })
  @ApiResponse({
    status: 404,
    description: "sender doesn't exist",
  })
  @ApiResponse({
    status: 404,
    description: "User you are trying to send request doesn't exist",
  })
  @ApiResponse({
    status: 409,
    description: "Aleady a friend",
  })
  @ApiResponse({
    status: 409,
    description: "Aleady sent a request",
  })
  async sendRequest(
    @Body() sendRequestDto: SendRequestDto,
  ): Promise<Friend> {
    const request = await this.FirendsService.sendFriendRequest(
      sendRequestDto.userId,
      sendRequestDto.friendId,
    );

    return request;
  }

  @Post(':requestId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiResponse({
    status: 200,
    description: 'Request acccepted successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async acceptRequest(
    @Body() AcceptRequestDto: AcceptRequestDto,
    @Param('requestId') requestId: string,
  ): Promise<Pick<Friend, 'id' | 'createdAt' | 'updatedAt' | 'status'>> {
    const acceptedRequest = await this.FirendsService.acceptFriendRequest(
      AcceptRequestDto.sentBy,
      AcceptRequestDto.sentTo,
      requestId,
    );
    return acceptedRequest;
  }

  @Post(':requestId/decline')
  @ApiOperation({ summary: 'Decline a friend request' })
  @ApiResponse({
    status: 201,
    description: 'Declined successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 404,
    description: "The request doesn't exist",
  })
  async decline(
    @Param('requestId') requestId: string,
  ): Promise<declineRequest> {
    const declinedRequest =
      await this.FirendsService.declineFriendRequest(requestId);

    return declinedRequest;
  }

  @Get('search')
  @ApiOperation({ summary: 'Search a user to send them a friend request' })
  @ApiResponse({
    status: 200,
    description: 'User Found',
    type: [CreateUserResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 404,
    description: "Provide an id, email or handle",
  })
  async search(@Query() SearchFriendDto: SearchFriendDto): Promise<User[]> {
    const user = await this.FirendsService.search(SearchFriendDto);

    return user;
  }

  @Delete(':friendId')
  @ApiOperation({ summary: 'To remove a friend' })
  @ApiParam({ name: 'friendId', example: 'VCAohl' })
  @ApiResponse({
    status: 200,
    description: 'Removed friend successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Not your friend!',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async removeFriend(
    @Query() currentUserId: RemoveFriendQureyDto,
    @Param('friendId') friendId: string,
  ): Promise<void> {
    await this.FirendsService.removeFriend(currentUserId.userId, friendId);
  }

  @Get('friendRequests/:userId')
  @ApiOperation({ summary: 'List of friend requests' })
  @ApiQuery({
    name: 'direction',
    required: true,
    enum: ['incoming', 'outgoing', 'all'],
  })
  // @ApiQuery({name: "outgoing", required: false})
  // @ApiQuery({name: "all", required: false})
  @ApiParam({ name: 'userId', example: 'zfwk' })
  @ApiResponse({
    status: 200,
    description: 'Friend request list fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async friendRequestList(
    @Param('userId') userId: string,
    @Query('direction') direction: 'incoming' | 'outgoing' | 'all',
  ): Promise<friendRequest[]
  > {
    const list = await this.FirendsService.listFriendRequests(
      userId,
      direction,
    );

    return list;
  }
}

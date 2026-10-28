import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import type { groupType } from '../groups/types/create-group.types';
import { Group } from '../groups/types/create-group.types';
import { apiResponseGenerator } from '../users/helpers/apiResponseGenerator';
import { addMemberDto } from './dto/addMemberDto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@Controller('/groups')
export class GroupsController {
  constructor(private readonly GroupsService: GroupsService) {}

  @Post('/create/:adminId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'adminId', example: 'sfwe' })
  @apiResponseGenerator({
    operation: 'Create a group',
    httpCode: HttpStatus.OK,
    responses: [],
  })
  async create(
    @Param('adminId') adminId: string,
    @Body() group: CreateGroupDto,
  ):Promise<Group> {
    return  await this.GroupsService.create(
      adminId,
      group.groupName,
      group.groupType as groupType,
    );
  }

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'groupId', example: 'dkwfnw' })
  @apiResponseGenerator({
    operation: 'search a group',
    httpCode: HttpStatus.OK,
    responses: [],
  })
  async getOne(@Param('groupId') groupId: string): Promise<Group> {
    const groupDetails = await this.GroupsService.getOneGroup(groupId);

    return groupDetails;
  }

  @Patch(':groupId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'groupId', example: 'dkwfnw' })
  @apiResponseGenerator({
    operation: 'Update group settings name/type',
    httpCode: HttpStatus.OK,
    responses: [],
  })
  async update(
    @Param('groupId') groupId: string,
    @Body() groupDetail: UpdateGroupDto,
  ): Promise<Group> {
    const groupDetails = await this.GroupsService.updateGroupSettings(
      groupId,
      groupDetail.groupName!,
      groupDetail.groupType! as groupType,
    );

    return groupDetails;
  }

  @Patch('/deactivate/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'groupId', example: 'dkbjhvj' })
  @apiResponseGenerator({
    operation: 'Deactivate group',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 409,
        description: 'Account already deactivated!',
      },
    ],
  })
  async deactivate(@Param('groupId') groupId: string): Promise<Group> {
    const groupDetails = await this.GroupsService.deactivateGroup(groupId);

    return groupDetails;
  }

  @Patch('/reactivate/:groupId')
  @ApiParam({ name: 'groupId', example: 'ytjkbcj' })
  @apiResponseGenerator({
    operation: 'Reactivate group',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 409,
        description: 'Account already active!',
      },
    ],
  })
  async reactivate(@Param('groupId') groupId: string): Promise<Group> {
    const groupDetails = await this.GroupsService.reactivateGroup(groupId);

    return groupDetails;
  }

  @Post('/:groupId/members')
  @ApiParam({ name: 'groupId', example: 'ytjkbcj' })
  @apiResponseGenerator({
    operation: 'Add members to group',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: 'Group not found',
      },
    ],
  })
  async addMember(
    @Param('groupId') groupId: string,
    @Body() memberIds: addMemberDto,
  ) {
    await this.GroupsService.addMember(groupId, memberIds.memberIds);
  }

  @Post('/:groupId/:memberId/leave')
  @ApiParam({ name: 'groupId', example: 'ytjkbcj' })
  @ApiParam({ name: 'memberId', example: 'fvmkev' })
  @apiResponseGenerator({
    operation: 'Send a friend request',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: 'This user is not the member of this group',
      },
    ],
  })
  async leaveGroup(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.GroupsService.leaveGroup(groupId, memberId);
  }

  @Delete('/:groupId/:adminId/:memberId/remove')
  @ApiParam({ name: 'groupId', example: 'ytjkbcj' })
  @ApiParam({ name: 'memberId', example: 'fvmkev' })
  @ApiParam({ name: 'adminId', example: 'cjncke' })
  @apiResponseGenerator({
    operation: 'Leave a group',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: 'User not the member of this group',
      },
      {
        status: 404,
        description: "Group Admin  or the Group doesn't exist",
      },
      {
        status: 403,
        description: "Only admin can perform this operation"
      }
    ],
  })
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('adminId') adminId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.GroupsService.removeMember(groupId, adminId, memberId);
  }
}


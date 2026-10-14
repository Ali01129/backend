import { Controller , Post , Body, HttpCode, HttpStatus, Get, Param, Delete, Patch, Query } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { ApiParam, ApiQuery } from "@nestjs/swagger";
import { CreateGroupDto } from "./dto/create-group.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Group } from "./groups.types";
import {UpdateGroupDto} from "./dto/update-group.dto";
import {addMemberDto} from "./dto/addMemberDto";

@Controller("/groups")
export class GroupsController{
    constructor(private readonly GroupsService: GroupsService ){}

    @Post("/create/:adminId")
    @HttpCode(HttpStatus.OK)
    @ApiParam({name: "adminId", example: "sfwe"})
        @ApiOperation({ summary: "Create a group" })
        @ApiResponse({
            status: 200,
            description: 'Group created successfully',
        })
        @ApiResponse({
        status: 400,
        description: 'Bad request',
        })
        @ApiResponse({
        status: 500,
        description: 'Internal server error',
        })
        async create(@Param("adminId") adminId: string, @Body() group: CreateGroupDto) {
            const g  = await this.GroupsService.create(adminId, group.groupName,
                group.groupType as "trip" | "home" | "couple" | "event" | "other",
            );
        }

        @Get(":groupId")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "dkwfnw"})
            @ApiOperation({ summary: "search a group" })
            @ApiResponse({
                status: 200,
                description: 'Successfully fetched the group',
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
            description: "Group doesn't exist",
            })
            async getOne(@Param("groupId") groupId: string):Promise<Group>{
                const groupDetails = await this.GroupsService.getOneGroup(groupId);

                return groupDetails;
            }

        @Patch(":groupId")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "dkwfnw"})
            @ApiOperation({ summary: "Update group settings name/type" })
            @ApiResponse({
                status: 200,
                description: 'Successfully updated',
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
            description: "Group doesn't exist",
            })
            async update(@Param("groupId") groupId: string, @Body() groupDetail: UpdateGroupDto):Promise<Group>{
                const groupDetails = await this.GroupsService.updateGroupSettings(groupId, groupDetail.groupName!, groupDetail.groupType!);

                return groupDetails;
            }

        @Patch("/deactivate/:groupId")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "dkbjhvj"})
            @ApiOperation({ summary: "Deactivate group" })
            @ApiResponse({
                status: 200,
                description: 'Successfully deactivated',
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
            description: "Group doesn't exist",
            })
            @ApiResponse({
            status: 409,
            description: "Account already deactivated!",
            })
            async deactivate(@Param("groupId") groupId: string):Promise<Group>{
                const groupDetails = await this.GroupsService.deactivateGroup(groupId);

                return groupDetails;
            }
            
        @Patch("/reactivate/:groupId")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "ytjkbcj"})
            @ApiOperation({ summary: "Reactivate group" })
            @ApiResponse({
                status: 200,
                description: 'Successfully reactivated',
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
            description: "Group doesn't exist",
            })
            @ApiResponse({
            status: 409,
            description: "Account already active!",
            })
            async reactivate(@Param("groupId") groupId: string):Promise<Group>{
                const groupDetails = await this.GroupsService.reactivateGroup(groupId);

                return groupDetails;
            }

        @Post("/:groupId/members")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "ytjkbcj"})
        // @ApiParam({name: "members", example: "fvmkev"})
            @ApiOperation({ summary: "Add members to group" })
            @ApiResponse({
                status: 200,
                description: 'Successfully added members to the group',
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
            description: "Group not found",
            })
            async addMember(@Param("groupId") groupId: string , @Body() memberIds: addMemberDto){
                await this.GroupsService.addMember(groupId, memberIds.memberIds);

            }

        @Post("/:groupId/:memberId/leave")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "ytjkbcj"})
        @ApiParam({name: "memberId", example: "fvmkev"})
            @ApiOperation({ summary: "Leave a group" })
            @ApiResponse({
                status: 200,
                description: 'Successfully left the group',
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
            description: "This user is not the member of this group",
            })
            async leaveGroup(@Param("groupId") groupId: string , @Param("memberId") memberId: string){
                await this.GroupsService.leaveGroup(groupId, memberId);
            }  
        
        @Delete("/:groupId/:adminId/:memberId/remove")
        @HttpCode(HttpStatus.OK)
        @ApiParam({name: "groupId", example: "ytjkbcj"})
        @ApiParam({name: "memberId", example: "fvmkev"})
        @ApiParam({name: "adminId", example: "cjncke"})
            @ApiOperation({ summary: "Remove member from the group" })
            @ApiResponse({
                status: 200,
                description: 'Successfully removed from the group',
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
            description: "User not the member of this group",
            })
            @ApiResponse({
            status: 404,
            description: "Group Admin  or the Group doesn't exist",
            })
            async removeMember(@Param("groupId") groupId: string ,@Param("adminId") adminId: string, @Param("memberId") memberId: string){
                await this.GroupsService.removeMember(groupId, adminId, memberId);
            }    

}
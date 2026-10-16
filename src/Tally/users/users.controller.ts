import { Controller , Post , Body, HttpCode, HttpStatus, Get, Param, Delete, Patch, Search, Query } from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto"
import { UserService } from "./users.service";
import { User } from "./types/create-user.types";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";

@ApiTags("Tally")
@Controller("/user")
export class UserController{
    constructor(private readonly userService: UserService){}

    @Post()
    @HttpCode(HttpStatus.OK)
      @ApiOperation({ summary: 'Create a new user' })
      @ApiResponse({
        status: 200,
        description: 'User created successfully',
        type: CreateUserResponseDto,
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
        description: 'Id not found',
      })
    // here we are going to create a method and give it a suitable name 
    // whereas the userSerivce create method will be called inside this method to create a user in the database
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User>{
        const user = await this.userService.create(createUserDto.name , createUserDto.email , createUserDto.displayName, createUserDto.handle, createUserDto.avatarColor, createUserDto.verified, createUserDto.preferredCurrency, createUserDto.subscriptionStatus);
        return user;
    }

    @Get("search")
      @HttpCode(HttpStatus.OK)
      @ApiOperation({ summary: 'Search user by ID ,name or email' })
      @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
      })
      @ApiResponse({
        status: 404,
        description: 'User not found',
      })
      @ApiResponse({
        status: 500,
        description: 'Internal server error',
      })
      @ApiResponse({
        status: 409,
        description: 'Aleast one thing should be provided',
      })
      @ApiResponse({
        status: 404,
        description: 'User not found!',
      })
      async seachUsers(@Query() search: SearchUserDto): Promise<User> {
          const user = await this.userService.searchUser(search.id , search.name, search.email);

          return user;
      }
    
    @Get(":showDeleted")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
      status: 200,
      description: 'Users retrieved successfully',
      type: [CreateUserResponseDto],
    })
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
    })
    async getAllUsers(@Param("showDeleted") showDeleted: boolean): Promise<User[]>{
        const users = await this.userService.getAllUsers(showDeleted);
        return users;
    }

   
    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({
      status: 200,
      description: 'User deleted successfully',
    })
    @ApiResponse({
      status: 404,
      description: 'User not found',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
    })
    async deleteUserById(@Param("id") id: string): Promise<string>{
        const userId = await this.userService.deleteUserById(id);
        return userId;
    }


    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiResponse({
      status: 200,
      description: 'User updated successfully',
      type: UpdateUserDto,
    })
    @ApiResponse({
      status: 404,
      description: 'User not found',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
    })
    async updateUserInfo(@Param("id") id: string, @Body() data: UpdateUserDto): Promise<User>{
        // console.log('id received:', id);

        const upadtedUserData = await this.userService.updateUserById(id, data);

        return upadtedUserData;
    }
}

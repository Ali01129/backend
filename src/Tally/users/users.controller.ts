import { Controller , Post , Body, HttpCode, HttpStatus, Get, Param, Delete, Patch } from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto"
import { UserService } from "./users.service";
import { User } from "./user.types";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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
    // here we are going to create a method and give it a suitable name 
    // whereas the userSerivce create method will be called inside this method to create a user in the database
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User | any>{
        const user = await this.userService.create(createUserDto);
        return user;
    }
    
    @Get(":includeDeleted")
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

    async getAllUsers(@Param("includeDeleted") includeDeleted: boolean): Promise<User[]>{
        const users = await this.userService.getAllUsers(includeDeleted);
        return users;
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
      status: 200,
      description: 'User retrieved successfully',
      type: CreateUserResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'User not found',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
    })
    async getUserById(@Param("id") id: string): Promise<User | null> {
        const user = await this.userService.getUserById(id);
        return user;
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
    async deleteUserById(@Param("id") id: string): Promise<void>{
        await this.userService.deleteUserById(id);
        return;
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
    async updateUserInfo(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User>{
        console.log('id received:', id);
        const upadtedUserData = await this.userService.updateUserById(id, updateUserDto);
        return upadtedUserData;
    }
}

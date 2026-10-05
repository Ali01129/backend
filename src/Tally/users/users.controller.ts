import { Controller , Post , Body, HttpCode, HttpStatus, Get, Param } from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto"
import { UserService } from "./users.service";
import { User } from "./user.types";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";

@ApiTags("Tally")
@Controller("create/user")
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
    
    @Get()
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

    async getAllUsers(): Promise<User[]>{
        const users = await this.userService.getAllUsers();
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
    
}

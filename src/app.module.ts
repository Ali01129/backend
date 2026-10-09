import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import {FirebaseModule} from "./Tally/Firebase/firebase.module"
import { UserController } from './Tally/users/users.controller';
import { UserService } from './Tally/users/users.service';
import {FriendsController} from "./Tally/friends/friends.controller"
import { FriendsService } from './Tally/friends/friends.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmailModule,
    FirebaseModule
  ],
  controllers: [AppController, UserController, FriendsController ],
  providers: [AppService, UserService, FriendsService],
})
export class AppModule {}

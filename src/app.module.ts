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
import { GroupsService } from './Tally/groups/groups.service';
import { GroupsController } from './Tally/groups/groups.controller';
import { ExpenseController } from './Tally/expenses/expenses.controller';
import { ExpenseService } from './Tally/expenses/expenses.service';
import {SettlementService} from "./Tally/settlements/settlement.service";
import {SettlementController} from "./Tally/settlements/settlement.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmailModule,
    FirebaseModule
  ],
  controllers: [AppController, UserController, FriendsController, GroupsController, ExpenseController,SettlementController ],
  providers: [AppService, UserService, FriendsService, GroupsService, ExpenseService, SettlementService],
})
export class AppModule {}

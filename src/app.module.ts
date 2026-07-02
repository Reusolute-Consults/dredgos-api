import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [AuthModule, SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

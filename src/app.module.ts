import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EquipmentModule } from './equipment/equipment.module';
import { TelematicsModule } from './telematics/telematics.module';
import { FuelModule } from './fuel/fuel.module';

@Module({
  imports: [AuthModule, SubscriptionsModule, EquipmentModule, TelematicsModule, FuelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

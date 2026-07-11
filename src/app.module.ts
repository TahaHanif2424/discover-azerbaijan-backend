import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TripCategoryModule } from './trip-category/trip-category.module';
import { TripModule } from './trip/trip.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TripCategoryModule, TripModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

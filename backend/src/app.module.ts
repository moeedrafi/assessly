import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppController } from 'src/app.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [User],
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
      extra: { max: 5 },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {}

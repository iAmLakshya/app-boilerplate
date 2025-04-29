import { Global, Module } from '@nestjs/common';
import { mongodbProviders } from './providers/mongodb.provider';

@Global()
@Module({
  providers: [...mongodbProviders],
  exports: [...mongodbProviders],
})
export class DatabaseModule {}

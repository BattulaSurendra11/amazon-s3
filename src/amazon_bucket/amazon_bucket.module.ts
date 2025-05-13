import { Module } from '@nestjs/common';
import { AmazonBucketController } from './amazon_bucket.controller';
import { AmazonBucketService } from './amazon_bucket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AmazonBucket, AmazonBucketSchema } from 'src/schema/AmazonBucket';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AmazonBucket.name, schema: AmazonBucketSchema },
    ]),
  ],
  controllers: [AmazonBucketController],
  providers: [AmazonBucketService],
})
export class AmazonBucketModule {}

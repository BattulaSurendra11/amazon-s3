import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmazonBucketModule } from './amazon_bucket/amazon_bucket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.mongodb || '',
    ),
    AmazonBucketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ collection: 'AmazonBucket' })
export class AmazonBucket {
  @Prop({ default: uuid })
  _id: string;
  @Prop({ required: true })
  attachments: string;
  @Prop({ required: true })
  reason: string;
  @Prop({ required: true })
  status: string;
}

export const AmazonBucketSchema = SchemaFactory.createForClass(AmazonBucket);

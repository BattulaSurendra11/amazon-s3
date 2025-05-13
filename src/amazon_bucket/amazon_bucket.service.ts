import { Injectable } from '@nestjs/common';
import { errorConsts } from 'src/consts/error.conts';
import { SuccessMessage } from 'src/consts/success.conts';
import { S3 } from 'aws-sdk';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AmazonBucket } from 'src/schema/AmazonBucket';

@Injectable()
export class AmazonBucketService {
  private s3: S3;
  constructor(
    @InjectModel(AmazonBucket.name)
    private amazonBucketModel: Model<AmazonBucket>,
  ) {
    this.s3 = new S3({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
      region: process.env.REGION_NAME,
      // signatureVersion: 'v4',
    });
  }
  async uploadFile(createObject: Object): Promise<any> {
    try {
      const originalname =
        createObject['file'].originalname.split('.')[0] +
        '_' +
        Date.now() +
        '.' +
        createObject['file'].originalname.split('.')[1];

      const data = await new this.amazonBucketModel({
        attachments: originalname,
        reason: createObject['reason'],
      });
      await data.save();
      const uploadResult = await this.s3
        .upload({
          Bucket: `${process.env.BUCKET_NAME}`,
          Key: process.env.bucketPath + originalname,
          Body: createObject['file']['buffer'],
        })
        .promise();

      return {
        status: SuccessMessage.status,
        message: SuccessMessage.fileUploadedSuccesfully
      };
    } catch (error) {
      return {
        status: 'Error',
        message: errorConsts.internalServerError,
      };
    }
  }

  async getFile(object: Object): Promise<any> {
    try {
      const filter = { is_active: true };
      if ('_id' in object && object['_id'] != '') {
        filter['_id'] = object['_id'];
      }
      const data = await this.amazonBucketModel.aggregate([
        {
          $match: filter,
        },
        {
          $sort: { created_date: -1 },
        },
      ]);

      if (data.length == 0) {
        return {
          status: SuccessMessage.status,
          message: errorConsts.dataNotExist,
        };
      }

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.bucketPath + data[0]['attachments'],
        Expires: 604800,
      };
      const file_download = await this.s3.getSignedUrl('getObject', params);
      data[0]['attachments'] = file_download;

      return {
        status: SuccessMessage.status,
        message: SuccessMessage.dataRetrivedSuccesfully,
        data: data,
      };
    } catch (error) {
      return {
        status: errorConsts.failed,
        message: errorConsts.internalServerError,
      };
    }
  }
}

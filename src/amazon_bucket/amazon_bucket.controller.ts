import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AmazonBucketService } from './amazon_bucket.service';
import { error } from 'console';
import { errorConsts } from 'src/consts/error.conts';

@Controller('amazon-bucket')
export class AmazonBucketController {
  constructor(private readonly amazonBucketService: AmazonBucketService) {}

  @Post('/uploadFile')
  @UseInterceptors()
  async uploadQmdFile(
    @Body() createPayload,
    @Req() request,
    @UploadedFile() file,
  ): Promise<object> {
    try {
      const allowedMimeTypes = [
        'application/pdf',       
        'image/jpeg',   
        'image/png',       
        'image/gif',      
        'text/plain',
      ];
  
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return{
          status:errorConsts.failed,
          message:errorConsts.invalidFile
        }
      }
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {  
          return{
            status:errorConsts.failed,
            message:errorConsts.exceededFileSize
          }
        }
      }
    const savedData = await this.amazonBucketService.uploadFile({
      ...createPayload,
      file: file,
    });
    return savedData;
  } catch (error) {
    throw new BadRequestException({
      statusCode: 500,
      message: 'Internal server Error.',
    });
  }
  }

  @Get('/getFile')
  async getFile(payload: Object): Promise<any> {
    try {
      const savedData = await this.amazonBucketService.getFile(payload);

      return savedData;
    } catch (error) {
      throw new BadRequestException({
        statusCode: 500,
        message: 'Internal server Error.',
      });
    }
  }
}

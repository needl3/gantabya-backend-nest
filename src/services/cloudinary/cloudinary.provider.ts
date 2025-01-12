import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
import { ConfigService } from '@nestjs/config';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from 'src/common/constants/env.constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get<string>(CLOUDINARY_CLOUD_NAME),
      api_key: configService.get<string>(CLOUDINARY_API_KEY),
      api_secret: configService.get<string>(CLOUDINARY_API_SECRET),
    });
  },
};

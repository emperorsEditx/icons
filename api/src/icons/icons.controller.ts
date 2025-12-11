import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IconsService } from './icons.service';
import { Icon } from './entities/icon.entity';

@Controller('icons')
export class IconsController {
  constructor(private readonly iconsService: IconsService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/svg+xml' ||
          file.mimetype === 'image/png'
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only SVG or PNG files are allowed'), false);
        }
      },
    }),
  )
  async upload(
    @UploadedFiles()
    files: { originalname: string; buffer: Buffer; mimetype: string }[],
    @Body('categoryId') categoryId: string,
    @Body('style') style: 'OUTLINE' | 'FILL',
    @Body('createdBy') createdBy: string,
  ) {
    const uploaded: Icon[] = [];

    for (const file of files) {
      const icon = await this.iconsService.saveIcon(
        file,
        Number(categoryId),
        style,
        Number(createdBy),
      );
      uploaded.push(icon);
    }

    return uploaded;
  }
}

import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { DataSource } from 'typeorm';
import { Icon, IconStatus, IconStyle, IconType } from './entities/icon.entity';

const mkdir = util.promisify(fs.mkdir);

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class IconsService {
  constructor(private dataSource: DataSource) {}

  private uploadRoot = join(__dirname, '..', '..', '..', 'uploads', 'icons');

  async saveIcon(
    file: UploadedFile,
    categoryId: number,
    style: 'OUTLINE' | 'FILL',
    createdBy: number,
  ) {
    const iconRepo = this.dataSource.getRepository(Icon);
    const categoryPath = join(this.uploadRoot, style, String(categoryId));

    if (!fs.existsSync(categoryPath)) {
      await mkdir(categoryPath, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = join(categoryPath, filename);

    fs.writeFileSync(filepath, file.buffer);

    // Create entity
    const icon = iconRepo.create({
      title: file.originalname,
      path: `uploads/icons/${style}/${categoryId}/${filename}`,
      type: IconType.SVG,
      style: style === 'OUTLINE' ? IconStyle.OUTLINE : IconStyle.FILL,
      category_id: categoryId,
      created_by: createdBy,
      status: IconStatus.PENDING,
    });

    // Save to DB
    await iconRepo.save(icon);

    return icon;
  }

  async getIcons(categoryId: number, style?: IconStyle) {
    const iconRepo = this.dataSource.getRepository(Icon);

    return iconRepo.find({
      where: {
        category_id: categoryId,
        ...(style ? { style } : {}),
      },
    });
  }
}

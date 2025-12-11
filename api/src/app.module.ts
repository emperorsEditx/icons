import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IconsModule } from './icons/icons.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Icon } from './icons/entities/icon.entity';
import { Bundle } from './bundles/entities/bundle.entity';
import { Category } from './categories/entities/category.entity';
import { IconBundle } from './icon-bundles/entities/icon-bundle.entity';
import { Tag } from './tags/entites/tag.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    IconsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'what_an_icon_db',
      autoLoadEntities: true,
      synchronize: true,
      charset: 'utf8',
      entities: [User, Icon, Bundle, Category, IconBundle, Tag],
    }),
    TypeOrmModule.forFeature([User, Icon, Bundle, Category, IconBundle, Tag]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

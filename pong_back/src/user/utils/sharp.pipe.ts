import { Injectable, PipeTransform } from '@nestjs/common'
import { Express } from 'express';
import * as path from 'path';
import * as sharp from 'sharp';


@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string> > 
{
    async transform(image: Express.Multer.File): Promise<string> {
        console.log('in transform');
        const originalName = path.parse(image.originalname).name;
        console.log('file og name == ' + originalName);
        const filename = Date.now() + '-' + originalName + '.webp';
        console.log(path);
        await sharp(image.buffer)
            .resize(800)
            .webp({ effort: 3 })
            .toFile(path.join('/app', 'src', 'user', 'uploads', filename));

        return filename;
    }
}
import { Injectable, PipeTransform } from '@nestjs/common'
import { Express } from 'express';
import * as path from 'path';
import * as sharp from 'sharp';


@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string> > 
{
    async transform(image: Express.Multer.File): Promise<string> {
        const originalName = path.parse(image.originalname).name;
        const filename = Date.now() + '-' + originalName + '.png';
        await sharp(image.buffer)
            .resize(800)
            .png()
            .toFile(path.join('/app', 'uploads', filename));

        return filename;
    }
}
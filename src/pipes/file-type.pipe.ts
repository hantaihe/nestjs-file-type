import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { FileExtension, fromBuffer } from 'file-type';

@Injectable()
export class FileTypePipe implements PipeTransform {
  private allowedTypes: FileExtension[];

  constructor(allowedTypes: FileExtension[]) {
    this.allowedTypes = allowedTypes; // Or fix file types
  }

  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const result = await fromBuffer(value.buffer);

    if (!this.allowedTypes.includes(result.ext)) {
      throw new BadRequestException('Invalid file type');
    }

    return value;
  }
}

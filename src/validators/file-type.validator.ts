import { FileValidator } from '@nestjs/common';
import { FileExtension, fromBuffer } from 'file-type';

export class CustomFileTypeValidator extends FileValidator {
  private allowedTypes: FileExtension[];

  constructor(allowedTypes: FileExtension[]) {
    super({});
    this.allowedTypes = allowedTypes; // Or fix file types
  }

  async isValid(file: Express.Multer.File): Promise<boolean> {
    const result = await fromBuffer(file.buffer);
    return this.allowedTypes.includes(result.ext);
  }

  buildErrorMessage(): string {
    return 'Invalid file type';
  }
}

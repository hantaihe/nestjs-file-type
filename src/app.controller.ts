import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileTypeValidator } from './validators/file-type.validator';
import { FileTypePipe } from './pipes/file-type.pipe';

@Controller()
export class AppController {
  constructor() {}

  @Post('validator')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileValidator(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new CustomFileTypeValidator(['jpg', 'png'])],
      }),
    ) file: Express.Multer.File,
  ) {
    return file;
  }

  @Post('pipe')
  @UseInterceptors(FileInterceptor('file'))
  uploadFilePipe(
    @UploadedFile(new FileTypePipe(['jpg', 'png'])) file: Express.Multer.File,
  ) {
    return file;
  }
}

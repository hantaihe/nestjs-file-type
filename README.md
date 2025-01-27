# NestJS Custom File Type Validator

## Feature

- Verifying file type by checking the file's magic number

  >  https://docs.nestjs.com/techniques/file-upload \
  Warning \
  To verify file type, FileTypeValidator class uses the type as detected by multer. By default, **multer derives file type from file extension on user's device**. However, it does not check actual file contents. As files can be renamed to arbitrary extensions, consider **using a custom implementation (like checking the file's magic number)** if your app requires a safer solution.


## Code

Prerequisites: `npm i file-type@16.5.4` (*Caution: file-type version >= 17.x uses pure ESM, which is incompatible with NestJS* )

- Validator

    ``` ts
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
    ```

    ``` ts
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
    ```

- Pipe

    ``` ts
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
    ```

    ``` ts
      @Post('pipe')
      @UseInterceptors(FileInterceptor('file'))
      uploadFilePipe(
        @UploadedFile(new FileTypePipe(['jpg', 'png'])) file: Express.Multer.File,
      ) {
        return file;
      }
    ```
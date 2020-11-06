import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../../helpers/file-upload.utils';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Get()
  @HttpCode(200)
  getPatient(@Query() { page, perPage, search }) {
    return this.service.getPatient(page, perPage, search);
  }
  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createPatient(@Body() body: any, @UploadedFile() avatar: any) {
    return this.service.createPatient(body, avatar);
  }

  @Get('avatars/:fileId')
  serveAvatar(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: 'avatars' });
  }

  @Put(':id')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  updatePatient(
    @Param('id') id: number,
    @Body() body: any,
    @UploadedFile() avatar: any,
  ) {
    return this.service.updatePatient(id, body, avatar);
  }

  @Delete(':id')
  @HttpCode(204)
  deletePatient(@Param('id') id: number) {
    return this.service.deletePatient(id);
  }
}

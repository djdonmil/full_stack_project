import { Controller, Get, Post, UseInterceptors, BadRequestException, Body, Req, UploadedFiles, NotFoundException, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiConsumes, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { csvFileFilter, editFileName } from 'shared/custom-validators/file-validations';
import { ImportCsvDto } from './dto/import-csv.dto'
import { csvFileDto } from './dto/csv-file.dto';
import { SearchAddressDto } from './dto/search-address.dto';


@Controller('transactions')
@ApiTags('Transactions')
export class AppController {
  constructor(private readonly appService: AppService) { }

 
  @Post('/import-wallet-transactions')
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Import list of transactions" })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "file", maxCount: 1 }], {
      storage: diskStorage({
        destination: "./assets/otherfiles",
        filename: editFileName,
      }),
      fileFilter: csvFileFilter,
    })
  )
  async importWalletTransactions(@Body() importCsvDto: ImportCsvDto, @UploadedFiles() files: csvFileDto, @Req() req,
  ): Promise<any> {

    if (req.fileValidationError) {
      throw new BadRequestException("File not valid.");
    }
    if (typeof files.file[0] == "undefined") {
      throw new NotFoundException("Not found.");
    }

    return await this.appService.importWalletTransactions(importCsvDto,files)
  }

  @Get("/list-transactions")
    @ApiOperation({ summary: "list all transaction details" })
    @ApiResponse({ status: 200, description: "Api success" })
    @ApiResponse({ status: 422, description: "Bad Request or API error message" })
    @ApiResponse({ status: 404, description: "Not found!" })
    @ApiResponse({ status: 500, description: "Internal server error!" })
    async listAllTransactions(
        @Query() searchAddressDto: SearchAddressDto,

    ) {
        return this.appService.listAllTransactions(searchAddressDto)
    }

}
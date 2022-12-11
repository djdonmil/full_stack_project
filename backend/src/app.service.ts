import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { csvFileDto } from './dto/csv-file.dto';
import * as csv from 'csvtojson'
import { ImportCsvDto } from './dto/import-csv.dto';
import * as fs from "fs"
import { SearchAddressDto } from './dto/search-address.dto';


@Injectable()
export class AppService {

  async importWalletTransactions(importCsvDto: ImportCsvDto, files: csvFileDto): Promise<{ data: any[], message: string, count: number } | void> {
    const file = files.file;

    try {

      //reading the csv fileinto an array
      const importArray = await csv().fromFile("./" + file[0].path);

      if (!importArray.length) {
        throw new NotFoundException("No result found.")
      }

      //sorting array in desceding order
      importArray.sort((a, b) => +b.Amount.replace(/,/g, '') > +a.Amount.replace(/,/g, '') ? 1 : -1)

      //store sorted data to some file so that we can fetch it at time of getting
      fs.writeFile("wallet_transactions.json", JSON.stringify(importArray), error => {
        if (error) throw error;
      })

      return { message: "Successfully retrieved data.", data: importArray, count: importArray.length }
    } catch (error) {

      if (error.status === 404) {
        throw new NotFoundException(`${error.message}`)
      }

      throw new InternalServerErrorException(`Something went wrong &&& ${error.message}`)
    }
  }

  async listAllTransactions(searchAddressDto: SearchAddressDto): Promise<{ data: any[], message: string, count: number } | void> {

    try {
      const readArray = fs.readFileSync("wallet_transactions.json", "utf-8");

      let resultantArray = JSON.parse(readArray);

      if (!resultantArray.length) {
        throw new NotFoundException("No result found.")
      }

      //check if there is any search parameter
      if (searchAddressDto ?.search_address) {
        const searchRegex = new RegExp(searchAddressDto.search_address)

        resultantArray = resultantArray.filter(function (el) {
          return searchRegex.test(el.Address);
        });

        if (!resultantArray.length) {
          throw new NotFoundException("No result found for the provided search.")
        }

      }

      return { message: "Successfully retrieved data.", data: resultantArray, count: resultantArray.length }

    }
    catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(`${error.message}`)
      }

      if (error.status === (422 || 400)) {
        throw new BadRequestException(`${error.message}`)
      }

      throw new InternalServerErrorException(`Something went wrong &&& ${error.message}`)
    }

  }
}

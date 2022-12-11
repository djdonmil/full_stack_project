import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImportCsvDto {

    @IsNotEmpty({ message: "Please attach csv." })
    @ApiProperty({
        type: "string",
        format: "binary",
        description: "csv file url (Allow Only 'csv')",
        example: "transactions.csv",
    })
    file: any;

}

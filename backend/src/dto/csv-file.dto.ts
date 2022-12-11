import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class csvFileDto {
    @IsNotEmpty({message:"Please attach csv."})
    @ApiProperty({
        description: "import csv file&&&csv_file",
        example: "transactions.csv",
    })
    file: any;
}


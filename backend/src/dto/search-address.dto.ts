import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchAddressDto {

    @ApiPropertyOptional({
        description: "Enter some walleet address to search",
        example: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"
    })
    search_address: string

}

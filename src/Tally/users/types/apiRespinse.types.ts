import { HttpStatus , Type } from "@nestjs/common";

export interface ApiResponseItem  {
    status : HttpStatus;
    description: string;
    type?: Type<unknown> | [Type<unknown>];
}

export interface ApiResponseGenerator {
    httpCode: HttpStatus;
    operation: string;
    responses : ApiResponseItem[];
}
import {HttpCode, HttpStatus, applyDecorators} from "@nestjs/common";
import {ApiOperation} from "@nestjs/swagger";
import { ApiResponseGenerator } from "../types/apiRespinse.types";

export function apiResponseGenerator(response : ApiResponseGenerator): MethodDecorator {
    const {httpCode , operation , responses} = response;

    return applyDecorators(
        HttpCode(httpCode),
        ApiOperation({summary : operation}),
        ...responses.map(response => ApiOperation(response))
    );
}

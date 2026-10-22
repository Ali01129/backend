import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  ApiResponseGenerator,
  ApiResponseItem,
} from '../types/apiResponse.types';

export function apiResponseGenerator(
  response: ApiResponseGenerator,
): MethodDecorator {
  const { httpCode, operation, responses } = response;

  const genericResponses: ApiResponseItem[] = [
    {
      status: 200,
      description: 'The request succeeded.',
    },
    {
      status: 400,
      description: 'Bad Request.',
    },
    {
      status: 404,
      description: 'Not Found.',
    },
    {
      status: 500,
      description: 'Internal server error.',
    },
  ];

  responses.push(...genericResponses);

  return applyDecorators(
    HttpCode(httpCode),
    ApiOperation({ summary: operation }),
    ...responses.map((response) => ApiOperation(response)),
  );
}

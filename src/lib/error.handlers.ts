import { GraphQLRequestContextDidEncounterErrors } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { NextFunction, Request, Response } from 'express';
import { GraphQLFormattedError } from 'graphql';
import { GraphQLContext } from '../config/context.js';
import { CustomExternalError } from '../domain/error/custom.external.error.js';
import { ErrorCode } from '../domain/error/error.code.js';
import { logger } from './logger.js';

const errorStackToArray = (error: Error): string[] => {
  return error.stack ? error.stack.split('\n').map((s) => s.trim()) : [];
};

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  if (error instanceof CustomExternalError) {
    response.status(error.statusCode).json({ errors: error.messages });
  } else {
    logger.error(
      {
        errorMessage: error.message,
        stack: errorStackToArray(error),
      },
      ErrorCode.INTERNAL_ERROR,
    );
    response.status(500).json({ message: ErrorCode.INTERNAL_ERROR });
  }
};

type AsyncHandler<Req extends Request, Res extends Response, Next extends NextFunction = NextFunction> = (
  req: Req,
  resp: Res,
  next: Next,
) => Promise<unknown>;

export const asyncHandler: <Req extends Request, Res extends Response>(
  handler: AsyncHandler<Req, Res>,
) => AsyncHandler<Req, Res> = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch((error: Error) =>
    errorHandler(error, request, response, next),
  );

export const gqlFormatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  const unwrappedError = unwrapResolverError(error);

  if (unwrappedError instanceof CustomExternalError) {
    return {
      ...formattedError,
      message: unwrappedError.messages.join(', '),
    };
  }

  return {
    ...formattedError,
    message: ErrorCode.INTERNAL_ERROR,
  };
};

export const gqlErrorHandler = ({
  request,
  contextValue,
  errors,
}: GraphQLRequestContextDidEncounterErrors<GraphQLContext>): Promise<void> => {
  errors.forEach((err) => {
    const unwrappedError = unwrapResolverError(err);
    if (unwrappedError instanceof Error && unwrappedError instanceof CustomExternalError === false) {
      logger.error(
        {
          errorMessage: unwrappedError.message,
          stack: errorStackToArray(unwrappedError),
        },
        `[GraphQL]${ErrorCode.INTERNAL_ERROR}`,
      );
    }
  });
  return Promise.resolve();
};

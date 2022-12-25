import { GraphQLRequestContextDidEncounterErrors } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { NextFunction, Request, Response } from 'express';
import { GraphQLFormattedError } from 'graphql';
import { CustomExternalError } from '../domain/error/custom.external.error';
import { CustomInternalError } from '../domain/error/custom.internal.error';
import { ErrorCode } from '../domain/error/error.code';
import { GraphQLContext } from '../graphql/context';
import { logger } from './logger';

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  response.encounteredErrorHandler = true;

  if (error instanceof CustomExternalError) {
    response.status(error.statusCode).json({ errors: error.messages });
  } else {
    logger.error(
      {
        errorMessage: error.message,
        stack: error instanceof CustomInternalError ? error.stackArray : error.stack,
      },
      ErrorCode.INTERNAL_ERROR,
    );
    response.status(500).json({ message: ErrorCode.INTERNAL_ERROR });
  }
  next();
};

type AsyncFunc = (req: Request, resp: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler: (func: AsyncFunc) => AsyncFunc =
  func =>
  (request, response, next): Promise<unknown> =>
    Promise.resolve(func(request, response, next)).catch((error: Error) =>
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

  logger.error({ errorMessage: formattedError.message, unwrappedError }, ErrorCode.INTERNAL_ERROR);
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
  errors.forEach(err => {
    const unwrappedError = unwrapResolverError(err);
    if (unwrappedError instanceof Error && unwrappedError instanceof CustomExternalError === false) {
      logger.error(
        {
          errorMessage: unwrappedError.message,
          stack: unwrappedError instanceof CustomInternalError ? unwrappedError.stackArray : unwrappedError.stack,
        },
        `[GraphQL]${ErrorCode.INTERNAL_ERROR}`,
      );
    }
  });
  return Promise.resolve();
};

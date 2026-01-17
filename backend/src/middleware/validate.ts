/**
 * FLAME Lounge Bar - Zod Validation Middleware
 *
 * Middleware para validar requests usando schemas Zod
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiError, ValidationError } from '../types';

/**
 * Middleware de validação usando Zod
 *
 * @param schema - Schema Zod para validar
 * @param source - De onde extrair os dados ('body' | 'query' | 'params')
 * @returns Middleware Express
 *
 * @example
 * router.post('/register', validate(registerSchema), authController.register);
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Valida os dados de acordo com a fonte
      const data = req[source];
      const validated = await schema.parseAsync(data);

      // Substitui os dados originais pelos validados
      req[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata os erros do Zod para um formato mais amigável
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const apiError: ApiError = {
          error: 'Validation failed',
          details: validationErrors,
          code: 'VALIDATION_ERROR',
        };

        res.status(422).json(apiError);
        return;
      }

      // Se for outro tipo de erro, passa para o próximo middleware
      next(error);
    }
  };
}

/**
 * Middleware para validar múltiplas fontes ao mesmo tempo
 *
 * @example
 * router.get('/orders',
 *   validateMultiple({
 *     query: orderQuerySchema,
 *     params: orderParamsSchema
 *   }),
 *   orderController.list
 * );
 */
export function validateMultiple(schemas: {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors: ValidationError[] = [];

      // Valida body se fornecido
      if (schemas.body) {
        try {
          req.body = await schemas.body.parseAsync(req.body);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.errors.map((err) => ({
                field: `body.${err.path.join('.')}`,
                message: err.message,
              }))
            );
          }
        }
      }

      // Valida query se fornecido
      if (schemas.query) {
        try {
          req.query = await schemas.query.parseAsync(req.query);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.errors.map((err) => ({
                field: `query.${err.path.join('.')}`,
                message: err.message,
              }))
            );
          }
        }
      }

      // Valida params se fornecido
      if (schemas.params) {
        try {
          req.params = await schemas.params.parseAsync(req.params);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.errors.map((err) => ({
                field: `params.${err.path.join('.')}`,
                message: err.message,
              }))
            );
          }
        }
      }

      // Se houver erros, retorna 422
      if (errors.length > 0) {
        const apiError: ApiError = {
          error: 'Validation failed',
          details: errors,
          code: 'VALIDATION_ERROR',
        };

        res.status(422).json(apiError);
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Helper para validar IDs de params
 */
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID deve ser um número')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive('ID deve ser positivo')),
});

export type IdParamInput = z.infer<typeof idParamSchema>;

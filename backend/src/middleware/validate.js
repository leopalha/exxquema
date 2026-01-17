"use strict";
/**
 * FLAME Lounge Bar - Zod Validation Middleware
 *
 * Middleware para validar requests usando schemas Zod
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = void 0;
exports.validate = validate;
exports.validateMultiple = validateMultiple;
const zod_1 = require("zod");
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
function validate(schema, source = 'body') {
    return async (req, res, next) => {
        try {
            // Valida os dados de acordo com a fonte
            const data = req[source];
            const validated = await schema.parseAsync(data);
            // Substitui os dados originais pelos validados
            req[source] = validated;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Formata os erros do Zod para um formato mais amigável
                const validationErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                const apiError = {
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
function validateMultiple(schemas) {
    return async (req, res, next) => {
        try {
            const errors = [];
            // Valida body se fornecido
            if (schemas.body) {
                try {
                    req.body = await schemas.body.parseAsync(req.body);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push(...error.errors.map((err) => ({
                            field: `body.${err.path.join('.')}`,
                            message: err.message,
                        })));
                    }
                }
            }
            // Valida query se fornecido
            if (schemas.query) {
                try {
                    req.query = await schemas.query.parseAsync(req.query);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push(...error.errors.map((err) => ({
                            field: `query.${err.path.join('.')}`,
                            message: err.message,
                        })));
                    }
                }
            }
            // Valida params se fornecido
            if (schemas.params) {
                try {
                    req.params = await schemas.params.parseAsync(req.params);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push(...error.errors.map((err) => ({
                            field: `params.${err.path.join('.')}`,
                            message: err.message,
                        })));
                    }
                }
            }
            // Se houver erros, retorna 422
            if (errors.length > 0) {
                const apiError = {
                    error: 'Validation failed',
                    details: errors,
                    code: 'VALIDATION_ERROR',
                };
                res.status(422).json(apiError);
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Helper para validar IDs de params
 */
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(/^\d+$/, 'ID deve ser um número')
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().positive('ID deve ser positivo')),
});

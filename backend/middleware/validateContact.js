import { z } from 'zod';

const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
});

export const validateContact = (req, res, next) => {
  try {
    const validated = contactSchema.parse(req.body);
    req.validatedContact = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
    next(error);
  }
};

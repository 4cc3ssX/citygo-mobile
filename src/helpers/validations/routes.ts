import {z} from 'zod';

export const findRouteSchema = z.object({
  from: z.object(
    {
      preferId: z.number(),
      name: z.string(),
      road: z.string(),
      township: z.string(),
    },
    {
      required_error: '"from" is required',
    },
  ),
  to: z.object(
    {
      preferId: z.number(),
      name: z.string(),
      road: z.string(),
      township: z.string(),
    },
    {
      required_error: '"to" is required',
    },
  ),
});

export type FindRouteValues = z.infer<typeof findRouteSchema>;

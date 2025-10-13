import * as z from 'zod';

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const formSchema = z.object({
  name: z.string({ error: 'This field is required' }),
  email: z.string({ error: 'This field is required' }),
  company: z.string({ error: 'This field is required' }).optional(),
  employees: z.string().min(1, 'Please select an item').optional(),
  message: z.string({ error: 'This field is required' }),
  agree: z.literal(true, { error: 'This field is required' }),
});

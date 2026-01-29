import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

export function useFormHandler<T extends Record<string, any>>(
  schema: ZodSchema,
  onSubmit: SubmitHandler<T>,
  defaultValues?: Partial<T>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: defaultValues as any,
  });
}

// Re-export common hooks
export { useForm, useWatch, useController, useFieldArray } from 'react-hook-form';

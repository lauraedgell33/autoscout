import { useForm, SubmitHandler, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema, z } from 'zod';

export function useFormHandler<T extends z.ZodType>(
  schema: T,
  onSubmit: SubmitHandler<z.infer<T>>,
  defaultValues?: DefaultValues<z.infer<T>>
) {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    mode: 'onBlur',
    defaultValues,
  });
}

// Re-export common hooks
export { useForm, useWatch, useController, useFieldArray } from 'react-hook-form';

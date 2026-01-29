import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const CreateVehicleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  mileage: z.number().nonnegative('Mileage must be non-negative'),
  year: z.number().int().min(1990, 'Year must be 1990 or later'),
});

export type CreateVehicleFormData = z.infer<typeof CreateVehicleSchema>;

export const CheckoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(10, 'Complete address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
});

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;

export const FilterSchema = z.object({
  minPrice: z.number().min(0, 'Minimum price must be non-negative'),
  maxPrice: z.number().positive('Maximum price must be positive'),
  category: z.string().optional(),
  searchTerm: z.string().optional(),
});

export type FilterFormData = z.infer<typeof FilterSchema>;

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

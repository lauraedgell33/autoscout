import { z } from 'zod';

// ============ Auth Schemas ============
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  userType: z.enum(['buyer', 'seller']),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============ Vehicle Schemas ============
export const CreateVehicleSchema = z.object({
  name: z.string().min(3, 'Vehicle name required'),
  brand: z.string().min(1, 'Brand required'),
  model: z.string().min(1, 'Model required'),
  year: z.number().min(1980).max(new Date().getFullYear()),
  price: z.number().positive('Price must be positive'),
  mileage: z.number().nonnegative('Mileage cannot be negative'),
  transmission: z.enum(['manual', 'automatic']),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  condition: z.enum(['like_new', 'excellent', 'good', 'fair', 'poor']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.instanceof(File)).min(1, 'At least one image required'),
});

// ============ Checkout Schemas ============
export const ShippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number required'),
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zipCode: z.string().min(5, 'ZIP code required'),
  country: z.string().min(2, 'Country required'),
});

export const PaymentSchema = z.object({
  cardholderName: z.string().min(2, 'Cardholder name required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()),
  cvv: z.string().regex(/^\d{3}$/, 'Invalid CVV'),
});

export const CheckoutSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['card', 'bank_transfer', 'paypal']),
  payment: PaymentSchema.optional(),
  agreeToTerms: z.boolean().refine((val) => val === true),
});

// ============ Profile Schemas ============
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Type exports
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type CreateVehicleFormData = z.infer<typeof CreateVehicleSchema>;
export type ShippingAddressFormData = z.infer<typeof ShippingAddressSchema>;
export type PaymentFormData = z.infer<typeof PaymentSchema>;
export type CheckoutFormData = z.infer<typeof CheckoutSchema>;
export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

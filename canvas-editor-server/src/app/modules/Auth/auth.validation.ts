import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z
    .object({
      username: z.string({ required_error: 'username is required.' }),
      password: z.string({ required_error: 'Password is required' }),
    })
    .strict({ message: 'Only username and password' }),
});
const signUpValidationSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: 'Name is required.' }),
      username: z.string({ required_error: 'Username is required.' }),
      email: z
        .string({ required_error: 'Email is required.' })
        .email('Invalid email format'),
      password: z.string({ required_error: 'Password is required' }),
      img: z.string().optional(),
      role: z.enum(['user', 'admin']).optional(),
      status: z.enum(['active', 'inactive']).optional(),
    })
    .strict({
      message:
        'Additional properties are not allowed. Invalid field(s) provided.',
    }),
});

const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z.string({
        required_error: 'Old password is required',
      }),
      newPassword: z.string({ required_error: 'Password is required' }),
    })
    .strict({ message: 'Only oldPassword and newPassword are allowed.' }),
});

export const AuthValidation = {
  signUpValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};

import { z } from 'zod';

const createProjectValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Project title is required.' }),
    canvasData: z.string({ required_error: 'Canvas data is required.' }),
    backgroundColor: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    contributors: z.array(z.string()).optional(),
  }).strict(),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    canvasData: z.string().optional(),
    backgroundColor: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    contributors: z.array(z.string()).optional(),
  }).strict(),
});

export const ProjectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};

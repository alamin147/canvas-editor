import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProjectControllers } from './project.controller';
import { ProjectValidation } from './project.validation';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(ProjectValidation.createProjectValidationSchema),
  ProjectControllers.createProject,
);

router.get(
  '/',
  auth('user'),
  ProjectControllers.getAllProjects,
);

router.get(
  '/:projectId',
  auth('user'),
  ProjectControllers.getProjectById,
);

router.patch(
  '/:projectId',
  auth('user'),
  validateRequest(ProjectValidation.updateProjectValidationSchema),
  ProjectControllers.updateProject,
);

router.delete(
  '/:projectId',
  auth('user'),
  ProjectControllers.deleteProject,
);

export const ProjectRoutes = router;

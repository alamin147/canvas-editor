import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/me',
  auth('user'),
  UserControllers.getMe,
);


export const UserRoutes = router;

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { Permission } from '../../../../config/permissions';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { loginRateLimiter } from '../../../../middlewares/rateLimit.middleware';

const authController = new AuthController();

const authRouter = Router();

// No authentication or authorization needed for login and register
authRouter.post('/login', loginRateLimiter, (req, res) => authController.login(req, res));
authRouter.post('/register', (req, res) => authController.register(req, res));

// Authentication is needed for refreshing token, resetting password, and changing password
authRouter.post('/refreshToken', authenticate, (req, res) => authController.refreshToken(req, res));
authRouter.post('/resetPassword', authenticate, (req, res) => authController.resetPassword(req, res));
authRouter.put('/changePassword', authenticate, (req, res) => authController.changePassword(req, res));

// Both authentication and authorization needed for suspending user
authRouter.put('/suspendUser/:userId', authenticate, authorize(Permission.SUSPEND_USER), (req, res) => authController.suspendUser(req, res));

export default authRouter;

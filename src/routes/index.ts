import { Router } from 'express';
import healthRoutes from '../components/health/v1/health.routes';
import productsRoutes from '../components/products/v1/web/products.routes';
import authRoutes from '../components/auth/v1/web/auth.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/v1/products', productsRoutes);
router.use('/v1/auth', authRoutes);

export default router;

import { Router } from 'express';
import { homeController } from './routes/home.controller';

export const router = Router();

router.use('', homeController.routes);

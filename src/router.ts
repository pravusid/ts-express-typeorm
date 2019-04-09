import { Router } from 'express';
import { homeController } from './api/home.controller';

export const router = Router();

router.use(homeController.routes);

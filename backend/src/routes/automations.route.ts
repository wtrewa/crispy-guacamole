// src/api/automations.route.ts

import { getAutomations } from '@/controller/automations.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAutomations);

export default router;

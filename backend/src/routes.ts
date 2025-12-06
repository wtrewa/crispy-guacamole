import { Router } from "express";
import automations from './routes/automations.route'

import workflows from './routes/workflow.route'

const router = Router();

router.use("/automations", automations);
router.use("/workflow", workflows);

export default router;

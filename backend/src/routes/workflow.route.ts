// src/api/workflow.route.ts

import { simulate, validate } from "@/controller/workflow.controller";
import { Router } from "express";


const router = Router();

router.post("/validate", validate);
router.post("/simulate", simulate);

export default router;

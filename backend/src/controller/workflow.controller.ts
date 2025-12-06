// src/controllers/workflow.controller.ts

import { Request, Response } from "express";
import { validateWorkflow } from "../utils/validator";
import { simulateWorkflow } from "../services/simulate.service";
import logger from "@/utils/logger";
export const validate = (req: Request, res: Response) => {
  logger.info("🚀 Workflow Validation Request Started", {
    method: req.method,
    path: req.originalUrl,
  });

  // Log raw incoming body
  logger.info("📦 Incoming Workflow Payload", {
    body: req.body,
  });

  const { nodes, edges } = req.body || {};

  // Log existence checks
  logger.info("🔍 Body Integrity Check", {
    hasNodes: !!nodes,
    hasEdges: !!edges,
  });

  if (!nodes || !edges) {
    logger.error("❌ Validation Failed — Missing nodes or edges", {
      body: req.body,
    });
    return res.status(400).json({
      success: false,
      errors: ["nodes or edges missing"],
    });
  }

  // Run validator
  const errors = validateWorkflow({ nodes, edges });

  // Log validation result
  logger.info("🧪 Workflow Validation Result", {
    errors,
  });

  if (errors.length > 0) {
    logger.warn("⚠️ Workflow Structure Invalid", { errors });
    return res.status(400).json({ success: false, errors });
  }

  logger.info("✅ Workflow Validated Successfully");

  return res.json({ success: true });
};



export const simulate = (req: Request, res: Response) => {
  const errors = validateWorkflow(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  return res.json(simulateWorkflow(req.body));
};

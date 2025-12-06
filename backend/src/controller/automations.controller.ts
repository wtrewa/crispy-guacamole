// src/controllers/automations.controller.ts

import { Request, Response } from 'express';

export const getAutomations = (req: Request, res: Response) => {
  return res.json([
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'create_task', label: 'Create Task', params: ['title', 'assignee'] },
    { id: 'send_notification', label: 'Send Notification', params: ['message', 'channel'] }
  ]);
};

import { Router } from 'express';
import { z } from 'zod';
import { Leave } from '../models/Leave.js';
import { inclusiveDays } from '../utils/date.js';

export const leaveRouter = Router();

const leaveSchema = z.object({
  leaveType: z.enum(['Sick', 'Casual', 'Vacation', 'Unpaid']),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1),
});

leaveRouter.post('/', async (req, res) => {
  const body = leaveSchema.parse(req.body);
  const days = inclusiveDays(body.fromDate, body.toDate);

  if (days <= 0) {
    return res.status(400).json({
      message: 'From Date should not exceed To Date',
    });
  }

  const leave = await Leave.create({
    userId: req.userId,
    leaveType: body.leaveType,
    fromDate: body.fromDate,
    toDate: body.toDate,
    reason: body.reason,
    days,
  });

  res.status(201).json(leave);
});

leaveRouter.get('/', async (req, res) => {
  const query = z
    .object({
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    })
    .parse(req.query);

  const filter: any = { userId: req.userId };

  if (query.from || query.to) {
    filter.fromDate = {
      ...(query.from ? { $gte: query.from } : {}),
      ...(query.to ? { $lte: query.to } : {}),
    };
  }

  const leaves = await Leave.find(filter).sort({ fromDate: -1 });
  res.json(leaves);
});

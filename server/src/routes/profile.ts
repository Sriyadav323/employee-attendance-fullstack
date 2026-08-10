import { Router } from 'express'; import { z } from 'zod'; import { User } from '../models/User.js';
export const profileRouter=Router();
profileRouter.get('/',async(req,res)=>{ const u=await User.findById(req.userId).select('-passwordHash'); if(!u)return res.status(404).json({message:'User not found'}); res.json(u); });
profileRouter.patch('/',async(req,res)=>{ const b=z.object({phone:z.string().max(20).optional(),profilePicture:z.union([z.string().url(),z.literal('')]).optional()}).parse(req.body); const u=await User.findByIdAndUpdate(req.userId,b,{new:true}).select('-passwordHash'); res.json(u); });

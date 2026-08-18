import { Router } from 'express'; import { z } from 'zod'; import { Attendance } from '../models/Attendance.js'; import { dateKey } from '../utils/date.js';
import { AttendanceCorrection } from '../models/AttendanceCorrection.js';
export const attendanceRouter=Router(); const location=z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180)});
attendanceRouter.post('/check-in',async(req,res)=>{ const body=location.parse(req.body); const day=dateKey(); try{ const record=await Attendance.create({userId:req.userId,attendanceDate:day,checkInAt:new Date(),checkInLocation:body}); res.status(201).json(record); }catch(err:any){ if(err.code===11000)return res.status(409).json({message:'You have already checked in today'}); throw err; }});
attendanceRouter.post('/check-out',async(req,res)=>{ const body=location.parse(req.body); const record=await Attendance.findOne({userId:req.userId,attendanceDate:dateKey()}); if(!record?.checkInAt)return res.status(400).json({message:'Check in before checking out'}); if(record.checkOutAt)return res.status(409).json({message:'You have already checked out today'}); record.checkOutAt=new Date(); record.checkOutLocation=body; await record.save(); res.json(record); });
attendanceRouter.post('/sync',async(req,res)=>{ const items=z.array(z.object({action:z.enum(['check-in','check-out']),latitude:z.number(),longitude:z.number(),createdAt:z.string()})).parse(req.body.items); const results=[]; for(const item of items){ try{ const eventDate=new Date(item.createdAt); const day=dateKey(eventDate); if(item.action==='check-in'){ const existing=await Attendance.findOne({userId:req.userId,attendanceDate:day}); if(!existing) await Attendance.create({userId:req.userId,attendanceDate:day,checkInAt:eventDate,checkInLocation:item}); } else { const rec=await Attendance.findOne({userId:req.userId,attendanceDate:day}); if(rec&&!rec.checkOutAt){rec.checkOutAt=eventDate;rec.checkOutLocation=item;await rec.save();} } results.push({createdAt:item.createdAt,success:true}); }catch{results.push({createdAt:item.createdAt,success:false});}} res.json({results}); });
attendanceRouter.get('/history',async(req,res)=>{ const q=z.object({from:z.string().optional(),to:z.string().optional()}).parse(req.query); const filter:any={userId:req.userId}; if(q.from||q.to)filter.attendanceDate={...(q.from?{$gte:q.from}:{}),...(q.to?{$lte:q.to}:{})}; const records=await Attendance.find(filter).sort({attendanceDate:-1}); res.json(records.map(r=>({ ...r.toObject(), totalWorkingHours:r.checkInAt&&r.checkOutAt?Number(((r.checkOutAt.getTime()-r.checkInAt.getTime())/3600000).toFixed(2)):null }))); });

attendanceRouter.post('/corrections',async(req,res)=>{
 const input=z.object({attendanceDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),requestedCheckInAt:z.string().datetime(),requestedCheckOutAt:z.string().datetime().nullable().optional(),reason:z.string().trim().min(10).max(500)}).parse(req.body);
 const checkIn=new Date(input.requestedCheckInAt); const checkOut=input.requestedCheckOutAt?new Date(input.requestedCheckOutAt):null;
 if(input.attendanceDate>dateKey())return res.status(400).json({message:'Attendance date cannot be in the future'});
 if(checkOut&&checkOut<=checkIn)return res.status(400).json({message:'Check-out time must be after check-in time'});
 const pending=await AttendanceCorrection.exists({userId:req.userId,attendanceDate:input.attendanceDate,status:'pending'});
 if(pending)return res.status(409).json({message:'A correction for this date is already pending'});
 const correction=await AttendanceCorrection.create({userId:req.userId,attendanceDate:input.attendanceDate,requestedCheckInAt:checkIn,requestedCheckOutAt:checkOut,reason:input.reason});
 res.status(201).json(correction);
});

attendanceRouter.get('/corrections',async(req,res)=>{
 const corrections=await AttendanceCorrection.find({userId:req.userId}).sort({createdAt:-1});
 res.json(corrections);
});

import { NextFunction,Request,Response } from 'express'; import { verifyToken } from '../utils/jwt.js';
export function requireAuth(req:Request,res:Response,next:NextFunction){
 const header=req.headers.authorization; if(!header?.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'});
 try{ const payload=verifyToken(header.slice(7)); req.userId=String(payload.sub); next(); }catch{ return res.status(401).json({message:'Invalid or expired token'}); }
}

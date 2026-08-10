import jwt from 'jsonwebtoken'; import { env } from '../config/env.js';
export const signToken=(userId:string)=>jwt.sign({sub:userId},env.JWT_SECRET,{expiresIn:env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']});
export const verifyToken=(token:string)=>jwt.verify(token,env.JWT_SECRET) as jwt.JwtPayload;

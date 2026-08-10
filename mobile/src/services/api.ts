import axios from 'axios'; import { storage } from './storage';
export const api=axios.create({baseURL:process.env.EXPO_PUBLIC_API_URL||'http://localhost:5000/api',timeout:10000});
api.interceptors.request.use(async c=>{const t=await storage.getToken();if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
export function messageOf(e:any){return e?.response?.data?.message||e?.message||'Something went wrong';}

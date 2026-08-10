export const dateKey=(d=new Date())=>d.toISOString().slice(0,10);
export function inclusiveDays(from:string,to:string){ return Math.floor((Date.parse(to)-Date.parse(from))/86400000)+1; }

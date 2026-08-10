import mongoose, { Schema } from 'mongoose';
const Point = new Schema({ latitude:Number, longitude:Number },{_id:false});
const AttendanceSchema = new Schema({
 userId:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, attendanceDate:{type:String,required:true,index:true},
 checkInAt:{type:Date}, checkInLocation:Point, checkOutAt:{type:Date}, checkOutLocation:Point
},{timestamps:true});
AttendanceSchema.index({userId:1,attendanceDate:1},{unique:true});
export const Attendance = mongoose.model('Attendance',AttendanceSchema);

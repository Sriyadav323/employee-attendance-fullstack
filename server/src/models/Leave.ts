import mongoose,{Schema} from 'mongoose';
const LeaveSchema=new Schema({userId:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},leaveType:{type:String,enum:['Sick','Casual','Vacation','Unpaid'],required:true},fromDate:{type:String,required:true},toDate:{type:String,required:true},reason:{type:String,required:true},status:{type:String,enum:['Pending','Approved','Rejected'],default:'Pending'},days:{type:Number,required:true}},{timestamps:true});
export const Leave=mongoose.model('Leave',LeaveSchema);

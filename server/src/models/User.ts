import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
  name:{type:String,required:true}, employeeId:{type:String,required:true,unique:true}, email:{type:String,required:true,unique:true,lowercase:true},
  passwordHash:{type:String,required:true}, phone:{type:String,default:''}, department:{type:String,default:'Engineering'}, profilePicture:{type:String,default:''},
  leaveBalance:{type:Number,default:18}
},{timestamps:true});
export const User = mongoose.model('User', UserSchema);

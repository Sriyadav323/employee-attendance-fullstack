import AsyncStorage from '@react-native-async-storage/async-storage';
const TOKEN='token',USER='user',QUEUE='attendance_queue';
export const storage={ getToken:()=>AsyncStorage.getItem(TOKEN), setToken:(v:string)=>AsyncStorage.setItem(TOKEN,v), clear:()=>AsyncStorage.multiRemove([TOKEN,USER]), getUser:async()=>{const v=await AsyncStorage.getItem(USER);return v?JSON.parse(v):null}, setUser:(u:any)=>AsyncStorage.setItem(USER,JSON.stringify(u)), getQueue:async()=>JSON.parse((await AsyncStorage.getItem(QUEUE))||'[]'), setQueue:(q:any[])=>AsyncStorage.setItem(QUEUE,JSON.stringify(q)) };

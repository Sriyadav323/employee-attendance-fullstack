

import React,{useCallback,useState} from 'react'; import { RefreshControl,ScrollView,StyleSheet,Text } from 'react-native'; import { useFocusEffect } from 'expo-router'; import { api } from '../../src/services/api'; import { Card,Label,Screen } from '../../src/components/UI';
export default function Dashboard(){const[data,setData]=useState<any>(null),[refreshing,setRefreshing]=useState(false);const load=async()=>{try{setRefreshing(true);setData((await api.get('/dashboard')).data)}finally{setRefreshing(false)}};useFocusEffect(useCallback(()=>{load()},[]));return <Screen><ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load}/>}><Text style={s.h}>Welcome, {data?.name||'Employee'}</Text><Card><Label>Employee ID</Label><Text style={s.v}>{data?.employeeId||'—'}</Text></Card><Card><Label>Today's attendance</Label><Text style={s.v}>{data?.todayStatus||'Loading...'}</Text></Card><Card><Label>Available leave balance</Label><Text style={s.v}>{data?.leaveBalance??'—'} days</Text></Card></ScrollView></Screen>}const s=StyleSheet.create({h:{color:'white',fontSize:26,fontWeight:'800',marginBottom:20},v:{color:'white',fontSize:20,fontWeight:'700'}});
const styles = StyleSheet.create({
  welcome: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: "#9aa4bb",
    fontSize: 15,
    marginBottom: 20,
  },
});

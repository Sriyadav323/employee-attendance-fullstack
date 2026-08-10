import { Stack } from 'expo-router'; import { AuthProvider } from '../src/context/AuthContext';
export default function Layout(){return <AuthProvider><Stack screenOptions={{headerStyle:{backgroundColor:'#0b1020'},headerTintColor:'white',contentStyle:{backgroundColor:'#0b1020'}}}/></AuthProvider>}

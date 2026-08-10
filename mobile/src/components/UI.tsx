import React from 'react'; import { ActivityIndicator,Pressable,StyleSheet,Text,TextInput,View } from 'react-native';
export const Screen=({children}:{children:React.ReactNode})=><View style={s.screen}>{children}</View>;
export const Field=(p:any)=><TextInput placeholderTextColor="#8b93a7" style={s.field} {...p}/>;
export const Button=({title,onPress,loading,disabled=false}:{title:string;onPress:()=>void;loading?:boolean;disabled?:boolean})=><Pressable onPress={onPress} disabled={loading||disabled} style={[s.button,(loading||disabled)&&{opacity:.55}]}>{loading?<ActivityIndicator color="white"/>:<Text style={s.buttonText}>{title}</Text>}</Pressable>;
export const Card=({children}:{children:React.ReactNode})=><View style={s.card}>{children}</View>;
export const Label=({children}:{children:React.ReactNode})=><Text style={s.label}>{children}</Text>;
const s=StyleSheet.create({screen:{flex:1,backgroundColor:'#0b1020',padding:20},field:{backgroundColor:'#161d31',color:'white',padding:14,borderRadius:12,marginBottom:12,borderWidth:1,borderColor:'#29324a'},button:{backgroundColor:'#4f7cff',padding:15,borderRadius:12,alignItems:'center',marginVertical:6},buttonText:{color:'white',fontWeight:'700'},card:{backgroundColor:'#141b2d',padding:16,borderRadius:16,marginBottom:12,borderWidth:1,borderColor:'#242f49'},label:{color:'#aeb7ca',fontSize:13,marginBottom:6}});

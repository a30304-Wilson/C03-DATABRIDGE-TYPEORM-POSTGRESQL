import { useEffect,useState } from 'react';
import { Button,FlatList,Text,View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
type Evento={id:number;nombre:string;ciudad:string;categoria:string;fecha:string};
const API_URL='http://127.0.0.1:3000';
export default function App(){
 const [eventos,setEventos]=useState<Evento[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [categoria,setCategoria]=useState('');

 async function filtrar(){
   const params=new URLSearchParams();
   if(ciudad) params.append('ciudad',ciudad);
   if(categoria) params.append('categoria',categoria);
   const query=params.toString();
   const url=API_URL+'/eventos'+(query?'?'+query:'');
   const r=await fetch(url);setEventos(await r.json());
 }
 // Se vuelve a consultar cada vez que cambia un filtro.
 useEffect(()=>{filtrar();},[ciudad,categoria]);

 return <SafeAreaProvider>
    <SafeAreaView><Text>🎟️ Event Radar</Text>
    <Text>Ciudad</Text>
    <Button title="Todas" onPress={()=>setCiudad('')}/>
    <Button title="Zaragoza" onPress={()=>setCiudad('Zaragoza')}/>
    <Text>Categoría</Text>
    <Button title="Todas" onPress={()=>setCategoria('')}/>
    <Button title="Tecnologia" onPress={()=>setCategoria('Tecnologia')}/>
    <Button title="Musica" onPress={()=>setCategoria('Musica')}/>
    <FlatList data={eventos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.nombre}</Text><Text>{item.ciudad} · {item.categoria}</Text></View>}/></SafeAreaView>
  </SafeAreaProvider>;
}

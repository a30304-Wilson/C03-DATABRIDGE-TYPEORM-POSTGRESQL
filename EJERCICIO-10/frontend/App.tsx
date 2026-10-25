import { useEffect,useState } from 'react';
import { Button,FlatList,Text,TextInput,View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

type Destino={id:number;ciudad:string;pais:string;descripcion:string;visitado:boolean};
const API_URL='http://127.0.0.1:3000';

export default function App(){
 const [destinos,setDestinos]=useState<Destino[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [pais,setPais]=useState('');
 const [error,setError]=useState('');

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/destinos');
     setDestinos(await r.json());
     setError('');
   }catch{setError('No se pudieron cargar los destinos.');}
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/destinos',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         ciudad,
         pais,
         descripcion:'Nuevo destino',
       }),
     });
     setCiudad('');
     setPais('');
     await cargar();
   }catch{setError('No se pudo crear.');}
 }

 async function editar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({descripcion:'Destino actualizado'}),
     });
     await cargar();
   }catch{setError('No se pudo actualizar.');}
 }

  async function alternarVisitado(d:Destino){
    try{
      await request(API_URL+'/destinos/'+d.id,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({visitado:!d.visitado}),
      });
      await cargar();
    }catch{setError('No se pudo cambiar el estado.');}
  }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('No se pudo eliminar.');}
 }

 return <SafeAreaProvider>
 <SafeAreaView>
   <Text>🌍 Wander</Text>
   {error!==''&&<Text>{error}</Text>}
   <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
   <TextInput placeholder="País" value={pais} onChangeText={setPais}/>
   <Button title="Crear destino" onPress={crear}/>
   <FlatList
     data={destinos}
     keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View>
      <Text>{item.ciudad} · {item.pais} {item.visitado ? '✅ Visitado' : '🧳 Pendiente'}</Text>
      <Text>{item.descripcion}</Text>
      <Button title={item.visitado ? 'Marcar pendiente' : 'Marcar visitado'} onPress={()=>alternarVisitado(item)}/>
      <Button title="Editar" onPress={()=>editar(item.id)}/>
      <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
    </View>}
   />
 </SafeAreaView>
 </SafeAreaProvider>;
}

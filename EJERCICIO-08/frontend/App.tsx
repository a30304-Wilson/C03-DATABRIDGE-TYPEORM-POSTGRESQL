import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

type Cancion={id:number;titulo:string;artista:string};
type Playlist={id:number;nombre:string;canciones:Cancion[]};
const API_URL='http://127.0.0.1:3000';

export default function App(){
 const [playlist,setPlaylist]=useState<Playlist|null>(null);
 const [titulo,setTitulo]=useState('');
 const [artista,setArtista]=useState('');

 async function cargar(){
   const r=await fetch(API_URL+'/playlists/1');
   setPlaylist(await r.json());
 }
 useEffect(()=>{cargar();},[]);

 async function anadir(){
   if(!playlist||titulo===''||artista==='') return;
   const r=await fetch(API_URL+'/playlists/canciones',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({titulo,artista,playlistId:playlist.id}),
   });
   if(r.ok){
     setTitulo('');
     setArtista('');
     await cargar(); // recarga la playlist con la nueva canción
   }
 }

 if(!playlist)return <Text>Cargando...</Text>;

 return <SafeAreaProvider>
  <SafeAreaView>
   <Text>🎵 {playlist.nombre}</Text>
   <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo}/>
   <TextInput placeholder="Artista" value={artista} onChangeText={setArtista}/>
   <Button title="Añadir canción" onPress={anadir}/>
   <FlatList data={playlist.canciones} keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View><Text>{item.titulo}</Text><Text>{item.artista}</Text></View>}/>
 </SafeAreaView>
 </SafeAreaProvider>;
}

// App.tsx — formulario POST
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const API_URL = 'http://127.0.0.1:3000';

type Restaurante = { 
  id: number; 
  nombre: string; 
  tipo: string; 
  ciudad: string; 
  puntuacion: number;
  precioMedio: number;
};

export default function App() {
  const [nombre,setNombre]=useState('');
  const [tipo,setTipo]=useState('');
  const [ciudad,setCiudad]=useState('');
  const [mensaje,setMensaje]=useState('');
  const [precioMedio,setPrecioMedio]=useState('');

  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);

  async function cargar() {
    const respuesta = await fetch(API_URL + '/restaurantes');
    setRestaurantes(await respuesta.json());
  }

  useEffect(() => { cargar(); }, []);

  async function guardar() {
    const respuesta=await fetch(API_URL+'/restaurantes',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        nombre,
        tipo,
        ciudad,
        puntuacion:9,
        precioMedio,
      }),
    });

    setMensaje(respuesta.ok?'Restaurante guardado ✓':'Error al guardar');
  }

  return <SafeAreaProvider>
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>🍜 Food Spots</Text>
    <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre}/>
    <TextInput style={styles.input} placeholder="Tipo" value={tipo} onChangeText={setTipo}/>
    <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
    <TextInput style={styles.input} placeholder="Precio Medio" value={precioMedio} onChangeText={setPrecioMedio}/>
    <Button title="Guardar restaurante" onPress={guardar}/>
    <Text>{mensaje}</Text>

    <FlatList
      data={restaurantes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text>{item.tipo} · {item.ciudad} · ⭐ {Number(item.puntuacion).toFixed(1)}</Text>
          <Text style={styles.precioMedio}>Precio medio: {item.precioMedio}</Text>
        </View>
      )}
    />
  </SafeAreaView>
  </SafeAreaProvider>;
}
const styles=StyleSheet.create({
 container:{flex:1,padding:24,backgroundColor:'#FFF7ED'},
 title:{fontSize:30,fontWeight:'800',marginBottom:20},
 input:{backgroundColor:'#FFF',padding:14,borderRadius:12,marginBottom:12},
 card: { backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginTop: 12 },
 nombre: { fontWeight: '700', fontSize: 16 },
 precioMedio: {fontWeight: 'bold'},
});

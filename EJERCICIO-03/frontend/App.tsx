// App.tsx
// RESPONSABILIDAD: solicitar una mascota concreta y mostrar su ficha.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: string;
};

const API_URL = 'http://127.0.0.1:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);

  useEffect(() => {
    // En este ejemplo pedimos la mascota con id 1.
    fetch(API_URL + '/mascotas/1')
      .then((r) => r.json())
      .then((dato: Mascota) => setMascota(dato));
  }, []);

  if (!mascota) return <Text>Cargando...</Text>;

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>{mascota.nombre}</Text>

      <View style={styles.card}>
        <Text style={styles.razaAnimal}>🐶 {mascota.raza}</Text>
        <Text>{mascota.edad} años · {mascota.ciudad}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.nivelEnergia}>⚡ Nivel de energía: {mascota.nivelEnergia}</Text>
      </View>

    </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles=StyleSheet.create({
container:{
  flex:1,
  justifyContent:'center',
  padding:24,
  backgroundColor:'#EEF6FF',
  gap: 16,
},
card:{
  backgroundColor:'#FFF',
  padding:28,
  borderRadius:24,
  alignItems:'center'
},
emoji:{
  fontSize:56
},
title:{
  fontSize:28,
  fontWeight:'800'
},
razaAnimal:{
  fontWeight:'800'
},
nivelEnergia:{
  fontWeight:'800'
},
row:{
  flexDirection: 'row',
}
});

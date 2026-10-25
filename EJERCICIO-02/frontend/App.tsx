// App.tsx
// RESPONSABILIDAD: pedir la colección y mostrar una cartelera.
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

const API_URL = 'http://127.0.0.1:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

  useEffect(() => {
    fetch(API_URL + '/peliculas')
      .then((respuesta) => respuesta.json())
      .then((datos: Pelicula[]) => setPeliculas(datos));
  }, []);

  function toggleFavorita(id: number) {
    setPeliculas((actuales) =>
      actuales.map((p) =>
        p.id === id ? { ...p, favorita: !p.favorita } : p,
      ),
    );
  }

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎬 CineBox</Text>
      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.movie}>{item.titulo}</Text>
              <Pressable onPress={() => toggleFavorita(item.id)} hitSlop={10}>
                <Text style={styles.favorita}>{item.favorita ? '♥' : '♡'}</Text>
              </Pressable>
            </View>
            <Text>{item.genero} · {item.anio}</Text>
            <Text>⭐ {Number(item.puntuacion).toFixed(1)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#F8FAFC',padding:20},
  title:{fontSize:30,fontWeight:'800',marginBottom:16},
  card:{backgroundColor:'#FFF',padding:18,borderRadius:16,marginBottom:12},
  movie:{fontSize:18,fontWeight:'700'},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favorita: { fontSize: 24, color: '#030303' },
});
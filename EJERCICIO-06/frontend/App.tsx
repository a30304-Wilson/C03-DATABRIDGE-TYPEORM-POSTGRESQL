import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const API_URL = 'http://127.0.0.1:3000';

type Libro = { id: number; titulo: string; autor: string; leido: boolean };

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);

  async function cargar() {
    const r = await fetch(API_URL + '/libros');
    setLibros(await r.json());
  }

  useEffect(() => {
    cargar();
  }, []);

  async function cambiarEstado(libro: Libro) {
    await fetch(API_URL + '/libros/' + libro.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leido: !libro.leido }),
    });
    await cargar(); // refresca la UI con lo que hay en PostgreSQL
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Biblioteca</Text>
        <FlatList
          data={libros}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.libro}>📚 {item.titulo}</Text>
              <Text style={styles.autor}>
                {item.autor} ·{' '}
                <Text style={styles.estado}>
                  {item.leido ? 'Leído ✓' : 'Pendiente'}
                </Text>
              </Text>
              <Pressable style={styles.button} onPress={() => cambiarEstado(item)}>
                <Text style={styles.buttonText}>
                  {item.leido ? 'Marcar como pendiente' : 'Marcar como leído'}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  libro: { fontSize: 18, fontWeight: '700' },
  autor: { color: '#475569' },
  estado: { fontWeight: '700' },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#FFF', fontWeight: '700' },
});
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const API_URL = 'http://127.0.0.1:3000';
const ID = 1;

type Campos = { destino: string; pais: string; fecha: string; estado: string };
type Viaje = Campos & { id: number };

export default function App() {
  const [original, setOriginal] = useState<Campos | null>(null);
  const [viaje, setViaje] = useState<Campos | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch(API_URL + '/viajes/' + ID)
      .then((r) => r.json())
      .then((v: Viaje) => {
        const { destino, pais, fecha, estado } = v;
        setOriginal({ destino, pais, fecha, estado });
        setViaje({ destino, pais, fecha, estado });
      })
      .catch(() => setMensaje('No se pudo cargar el viaje'));
  }, []);

  function cambiar(campo: keyof Campos, valor: string) {
    setViaje((actual) => (actual ? { ...actual, [campo]: valor } : actual));
  }

  async function actualizar() {
    if (!viaje || !original) return;

    // PATCH: solo enviamos los campos que han cambiado.
    const cambios: Partial<Campos> = {};
    (Object.keys(viaje) as (keyof Campos)[]).forEach((k) => {
      if (viaje[k] !== original[k]) cambios[k] = viaje[k];
    });

    const r = await fetch(API_URL + '/viajes/' + ID, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    });

    if (r.ok) setOriginal(viaje);
    setMensaje(r.ok ? 'Viaje actualizado ✓' : 'No se pudo actualizar');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Editar viaje</Text>

        {viaje && (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.icon}>✈️</Text>
                <TextInput
                  style={styles.destino}
                  value={viaje.destino}
                  onChangeText={(t) => cambiar('destino', t)}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={styles.sub}
                  value={viaje.pais}
                  onChangeText={(t) => cambiar('pais', t)}
                />
                <Text style={styles.sep}>·</Text>
                <TextInput
                  style={styles.sub}
                  value={viaje.estado}
                  onChangeText={(t) => cambiar('estado', t)}
                />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.fechaLabel}>Fecha:</Text>
                <TextInput
                  style={styles.fecha}
                  value={viaje.fecha}
                  onChangeText={(t) => cambiar('fecha', t)}
                  placeholder="AAAA-MM-DD"
                />
              </View>
            </View>

            <Pressable style={styles.button} onPress={actualizar}>
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </Pressable>
            <Text style={styles.mensaje}>{mensaje}</Text>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC', gap: 14 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 20 },
  destino: { fontSize: 18, fontWeight: '700', flex: 1, padding: 0 },
  sub: { color: '#475569', padding: 0 },
  sep: { color: '#475569' },
  fechaLabel: { fontSize: 16, fontWeight: '700' },
  fecha: { fontSize: 16, fontWeight: '700', flex: 1, padding: 0 },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: '700' },
  mensaje: { textAlign: 'center' },
});
// app/_layout.tsx
import { Stack } from 'expo-router';
import { NotesProvider } from '../context/NotesContext';

export default function Layout() {
  return (
    <NotesProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Mis Notas Fotográficas' }} />
        <Stack.Screen name="create" options={{ title: 'Nueva Nota' }} />
        <Stack.Screen name="note/[id]" options={{ title: 'Detalle de Nota' }} />
      </Stack>
    </NotesProvider>
  );
}
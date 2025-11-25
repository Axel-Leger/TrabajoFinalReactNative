import { Link, Stack } from "expo-router"
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItem,
} from "react-native"
import { useNotes } from "../context/NotesContext"
import type { PhotoNote } from "../utils/types"

export default function IndexScreen() {
  const { notes, isLoading } = useNotes()

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#3e2e48ff" />
          <Text style={styles.loadingText}>Cargando notas...</Text>
        </View>
      </View>
    )
  }

  const renderNoteItem: ListRenderItem<PhotoNote> = ({ item }) => (
    <Link href={`/note/${item.id}`} asChild>
      <TouchableOpacity style={styles.noteItem} activeOpacity={0.7}>
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        <View style={styles.noteContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle}>Toca para ver detalles</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )

  return (
    <View style={styles.container}>
      
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#45a37cff" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "700" },
          title: "Mis Notas",
          headerRight: () => (
            <Link href="/create" asChild>
              <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                <Text style={styles.headerButtonText}>Crear nota</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      {notes.length === 0 ? (
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sin notas todavía</Text>
          <Text style={styles.emptySubtitle}>Captura tu primer momento especial</Text>
          <Link href="/create" asChild>
            <TouchableOpacity style={styles.emptyButton} activeOpacity={0.8}>
              <Text style={styles.emptyButtonText}>Crear nota</Text>
            </TouchableOpacity>
          </Link>
        </View>

      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  loadingCard: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4A4A4A",
    fontWeight: "500",
  },

  listContent: {
    padding: 16,
  },

  separator: {
    height: 10,
  },

  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },

  noteContent: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 3,
  },

  subtitle: {
    fontSize: 13,
    color: "#7A7A7A",
  },

  chevron: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  chevronText: {
    fontSize: 18,
    color: "#A1A1A1",
  },

  headerButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },

  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#7A7A7A",
    textAlign: "center",
    marginBottom: 30,
  },

  emptyButton: {
    backgroundColor: "#45a37cff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})




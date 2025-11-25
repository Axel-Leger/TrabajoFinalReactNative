"use client"

import { router, Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useNotes } from "../../context/NotesContext"
import type { PhotoNote } from "../../utils/types"

export default function NoteDetailScreen() {
  const { id: noteIdParam } = useLocalSearchParams()
  const noteId = Array.isArray(noteIdParam)
    ? Number.parseInt(noteIdParam[0], 10)
    : Number.parseInt(noteIdParam || "0", 10)

  const { getNoteById, updateNote, deleteNote } = useNotes()
  const initialNote: PhotoNote | undefined = getNoteById(noteId)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialNote?.title || "")
  const [description, setDescription] = useState(initialNote?.description || "")

  useEffect(() => {
    if (noteId === 0 || (!initialNote && !router.canGoBack())) {
      if (noteId !== 0) {
        Alert.alert("Error", "Nota no encontrada o ID inválido.")
      }
      router.replace("/")
    }
  }, [initialNote, noteId])

  useEffect(() => {
    if (!isEditing && initialNote) {
      setTitle(initialNote.title)
      setDescription(initialNote.description)
    }
  }, [isEditing, initialNote])

  const handleDelete = () => {
    Alert.alert("Confirmar Eliminación", "¿Estás seguro de que quieres eliminar esta nota fotográfica?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteNote(noteId)
          Alert.alert("Éxito", "Nota eliminada correctamente.", [
            {
              text: "OK",
              onPress: () => router.replace("/"),
            },
          ])
        },
      },
    ])
  }

  const handleSaveEdit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "El Título y la Descripción no pueden estar vacíos.")
      return
    }
    updateNote(noteId, { title, description })
    setIsEditing(false)
  }

  if (!initialNote) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Cargando nota...</Text>
        </View>
      </View>
    )
  }

  const formattedDate = new Date(initialNote.date).toLocaleString()

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#45a37cff" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          headerRight: () => (
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{isEditing ? "Cancelar" : "Editar"}</Text>
            </TouchableOpacity>
          ),
          title: isEditing ? "Editando Nota" : "Detalle",
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagen principal */}
        <View style={styles.imageContainer}>
        <Image source={{ uri: initialNote.imageUri }} style={styles.fullImage} />
        <View style={styles.imageOverlay}>
            <Text style={styles.dateChip}>{formattedDate}</Text>
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.contentCard}>
          {isEditing ? (
            <>
              {/* Formulario de Edición */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>TÍTULO</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Ingresa el título"
                  placeholderTextColor="#a1a1aa"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>DESCRIPCIÓN</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Ingresa la descripción"
                  placeholderTextColor="#a1a1aa"
                  multiline
                />
              </View>

              {/* Botones de acción */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit} activeOpacity={0.8}>
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
                  <Text style={styles.deleteButtonText}>Eliminar Nota</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Modo de Visualización */}
              <Text style={styles.titleText}>{initialNote.title}</Text>
              <View style={styles.divider} />
              <Text style={styles.descriptionLabel}>Descripción</Text>
              <Text style={styles.descriptionText}>{initialNote.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  scrollView: {
    flex: 1,
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
    padding: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  loadingText: {
    fontSize: 16,
    color: "#616161",
  },

  headerButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },

  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  imageContainer: {
    position: "relative",
  },

  fullImage: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
    backgroundColor: "#E0E0E0",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  dateChip: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },

  contentCard: {
    backgroundColor: "#FFFFFF",
    height:"100%",
    borderRadius: 6,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  titleText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 14,
  },

  descriptionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#616161",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },

  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#424242",
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#616161",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#212121",
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  actionButtons: {
    marginTop: 6,
    gap: 12,
  },

  saveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  deleteButton: {
    backgroundColor: "#FDECEC",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5B5B5",
  },

  deleteButtonText: {
    color: "#C62828",
    fontSize: 16,
    fontWeight: "600",
  },
})

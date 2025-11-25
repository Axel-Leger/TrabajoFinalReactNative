"use client"

// app/create.tsx
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useNotes } from "../context/NotesContext"
import type { NewPhotoNoteData } from "../utils/types"

export default function CreateNoteScreen() {
  const { createNote } = useNotes()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)

  const pickImage = async (useCamera: boolean) => {
    let result: ImagePicker.ImagePickerResult

    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        Alert.alert("Permiso Denegado", "Necesitas conceder permiso para usar la cámara.")
        return
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
      })
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert("Permiso Denegado", "Necesitas conceder permiso para acceder a la galería.")
        return
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      })
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleSave = () => {
    if (!title.trim() || !description.trim() || !imageUri) {
      Alert.alert("Error", "Debes completar todos los campos y capturar/seleccionar una Imagen.")
      return
    }

    const newNoteData: NewPhotoNoteData = { title, description, imageUri }
    createNote(newNoteData)
    router.replace("/")
  }

  const isFormValid = imageUri && title.trim() && description.trim()

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#45a37cff" />

      {/* Header con fondo de color */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Crear Nota</Text>
          <Text style={styles.headerSubtitle}>Guarda tus momentos especiales</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal del formulario */}
        <View style={styles.formCard}>
          {/* Input Título */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Título</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Escribe el titulo"
                placeholderTextColor="#A1A1AA"
              />
            </View>
          </View>

          {/* Input Descripción */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Descripción</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Escribe la descripcion"
                placeholderTextColor="#A1A1AA"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Sección de Imagen */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Fotografía</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)} activeOpacity={0.7}>
                <Text style={styles.actionButtonText}>Sacar foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)} activeOpacity={0.7}>
                <Text style={styles.actionButtonText}>Ir a galeria</Text>
              </TouchableOpacity>
            </View>

            {imageUri ? (
              <View style={styles.previewWrapper}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeButton} onPress={() => setImageUri(null)} activeOpacity={0.7}>
                  <Text style={styles.removeButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Sin imagen</Text>
                <Text style={styles.emptySubtitle}>No se selecciono ninguna foto para tu nota</Text>
              </View>
            )}
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveButtonText, !isFormValid && styles.saveButtonTextDisabled]}>Guardar Nota</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    backgroundColor: "#45a37cff",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },

  headerContent: {
    alignItems: "flex-start",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 4,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  inputWrapper: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#616161",
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D4D4D4",
  },

  input: {
    padding: 12,
    fontSize: 16,
    color: "#212121",
  },

  textArea: {
    height: 110,
    paddingTop: 12,
  },

  imageSection: {
    marginTop: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4D4D4",
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  iconText: {
    fontSize: 20,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
  },

  previewWrapper: {
    alignItems: "center",
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },

  removeButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FBEAEA",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F5B5B5",
  },

  removeButtonText: {
    color: "#C62828",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderStyle: "dashed",
  },

  emptyIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyIcon: {
    fontSize: 26,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#9E9E9E",
  },

  saveButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 24,
  },

  saveButtonDisabled: {
    backgroundColor: "#CFCFCF",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  saveButtonTextDisabled: {
    color: "#8E8E8E",
  },
})


// context/NotesContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhotoNote, NotesContextType, NewPhotoNoteData } from '../utils/types';

const STORAGE_KEY = '@PhotoNotes';

// Definición del valor inicial del contexto (para evitar null check)
const defaultContextValue: NotesContextType = {
    notes: [],
    isLoading: true,
    createNote: () => { throw new Error('NotesProvider not initialized'); },
    updateNote: () => { throw new Error('NotesProvider not initialized'); },
    deleteNote: () => { throw new Error('NotesProvider not initialized'); },
    getNoteById: () => undefined,
};

// 1. Crear el Contexto
const NotesContext = createContext<NotesContextType>(defaultContextValue);

interface NotesProviderProps {
    children: ReactNode;
}

// 2. Crear el Provider
export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
    const [notes, setNotes] = useState<PhotoNote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Lógica de Persistencia ---

    // Cargar notas al iniciar
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedNotes !== null) {
                // Tipamos el parseo
                setNotes(JSON.parse(storedNotes) as PhotoNote[]);
            }
        } catch (e) {
            console.error("Error al cargar las notas:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // Guardar notas cada vez que el estado 'notes' cambia
    useEffect(() => {
        if (!isLoading) {
            saveNotes(notes);
        }
    }, [notes, isLoading]);

    const saveNotes = async (currentNotes: PhotoNote[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentNotes));
        } catch (e) {
            console.error("Error al guardar las notas:", e);
        }
    };

    // --- Funciones CRUD ---

    const getNextId = (currentNotes: PhotoNote[]): number => {
        const maxId = currentNotes.reduce((max, note) => Math.max(max, note.id), 0);
        return maxId + 1;
    }

    // 1. Crear (Create)
    const createNote = (newNoteData: NewPhotoNoteData): number => {
        const newId = getNextId(notes);
        const newNote: PhotoNote = {
            ...newNoteData,
            id: newId,
            date: new Date().toISOString(),
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        return newId;
    };

    // 3. Actualizar (Update)
    const updateNote = (id: number, updatedData: Partial<NewPhotoNoteData>): void => {
        setNotes((prevNotes) => 
            prevNotes.map(note => 
                note.id === id 
                ? { ...note, ...updatedData, date: new Date().toISOString() }
                : note
            )
        );
    };

    // 4. Eliminar (Delete)
    const deleteNote = (id: number): void => {
        setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
    };

    // Helper para obtener una nota específica
    const getNoteById = (id: number): PhotoNote | undefined => notes.find(note => note.id === id);


    const value: NotesContextType = {
        notes,
        isLoading,
        createNote,
        updateNote,
        deleteNote,
        getNoteById,
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};

// 3. Crear el Hook personalizado para usar el contexto
export const useNotes = () => useContext(NotesContext);
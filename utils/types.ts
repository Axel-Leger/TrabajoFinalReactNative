// utils/types.ts

// 1. Interfaz para el modelo de la Nota
export interface PhotoNote {
    id: number;
    title: string;
    description: string;
    imageUri: string; // URI/URL local de la imagen
    date: string; // Usaremos ISOString para la fecha
}

// 2. Tipo para los datos de entrada al crear (sin ID ni fecha)
export type NewPhotoNoteData = Omit<PhotoNote, 'id' | 'date'>;

// 3. Interfaz para el Contexto (incluye estado y funciones CRUD)
export interface NotesContextType {
    notes: PhotoNote[];
    isLoading: boolean;
    createNote: (data: NewPhotoNoteData) => number; // Devuelve el nuevo ID
    updateNote: (id: number, data: Partial<NewPhotoNoteData>) => void;
    deleteNote: (id: number) => void;
    getNoteById: (id: number) => PhotoNote | undefined;
}
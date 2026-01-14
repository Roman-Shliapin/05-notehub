import axios from "axios";
import type { Note } from '../types/note';
import type { NoteTag } from '../types/NoteTag';


const API_BASE_URL = 'https://notehub-public.goit.study/api/notes';
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    }
});

export interface FetchNotesProps {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface CreateNoteProps {
    title: string;
    content: string;
    tag: NoteTag;
}

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (params?: FetchNotesProps): Promise<FetchNotesResponse> => {
    const res = await axiosInstance.get<FetchNotesResponse>('', {
        params: {
            page: params?.page ?? 1,
            perPage: params?.perPage ?? 12,
            search: params?.search,
        }
    });
    return res.data;
}



export const createNote = async (data: CreateNoteProps): Promise<Note> => {
    const res = await axiosInstance.post<Note>('', data);
    return res.data;
}



export const deleteNote = async (id: string): Promise<{ id: string }> => {
    const res = await axiosInstance.delete<{ id: string }>(`/${id}`);
    return res.data;
}
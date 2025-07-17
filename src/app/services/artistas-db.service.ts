import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface Artista {
    id?: number;
    nombre: string;
    album: string;
    portada: string;
    audio: string;
    isPlaying?: boolean;
    progreso?: number;
    tiempoActual?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ArtistasDbService {
    private db?: Dexie;
    private artistasTable?: Table<Artista, number>;

    constructor() {
        // Evita inicializar Dexie en modo SSR o fuera del navegador
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
            this.db = new Dexie('ArtistasDB');
            this.db.version(1).stores({
                artistas: '++id,nombre,album'
            });
            this.artistasTable = this.db.table('artistas');
        } else {
            console.warn('⚠️ IndexedDB no está disponible en este entorno (SSR?).');
        }
    }

    async agregar(artista: Artista) {
        if (!this.artistasTable) return;
        return await this.artistasTable.add(artista);
    }

    async obtenerTodos(): Promise<Artista[]> {
        if (!this.artistasTable) return [];
        return await this.artistasTable.toArray();
    }

    async borrarTodos() {
        if (!this.artistasTable) return;
        return await this.artistasTable.clear();
    }

    async borrarPorId(id: number) {
        if (!this.artistasTable) return;
        return await this.artistasTable.delete(id);
    }

    async editar(artista: Artista) {
        if (!this.artistasTable || artista.id === undefined) return;
        return await this.artistasTable.update(artista.id, artista);
    }
}

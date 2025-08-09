import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface Usuario {
    usuario: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsuariosDbService {
    private db?: Dexie;
    private usuariosTable?: Table<Usuario, string>; // clave: usuario

    constructor() {
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
            this.db = new Dexie('UsuariosDB');
            this.db.version(1).stores({
                usuarios: 'usuario' // clave primaria: usuario
            });
            this.usuariosTable = this.db.table('usuarios');
        } else {
            console.warn('⚠️ IndexedDB no está disponible.');
        }
    }

    async registrar(usuario: Usuario): Promise<void> {
        if (!this.usuariosTable) return;
        await this.usuariosTable.add(usuario);
    }

    async existe(usuario: string): Promise<boolean> {
        if (!this.usuariosTable) return false;
        const existe = await this.usuariosTable.get(usuario);
        return !!existe;
    }

    async obtener(usuario: string): Promise<Usuario | undefined> {
        if (!this.usuariosTable) return;
        return await this.usuariosTable.get(usuario);
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistasDbService, Artista } from '../../services/artistas-db.service';
import { AgregarArtistaNuevoComponent } from '../../components/agregar-artista-nuevo/agregar-artista-nuevo.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artistas',
  standalone: true,
  imports: [CommonModule, FormsModule, AgregarArtistaNuevoComponent],
  templateUrl: './artistas.component.html',
  styleUrls: ['./artistas.component.css']
})
export class ArtistasComponent implements OnInit, OnDestroy {
  artistasLocales: Artista[] = [];
  artistasNuevos: Artista[] = [];

  currentAudio: HTMLAudioElement | null = null;
  currentArtista: Artista | null = null;

  artistaEditandoId: number | null = null;

  constructor(private artistasDB: ArtistasDbService) { }

  async ngOnInit() {
    const artistasGuardados = await this.artistasDB.obtenerTodos();

    if (artistasGuardados.length === 0) {
      const artistasIniciales: Artista[] = [
        {
          nombre: 'Jennifer Hudson',
          album: 'I Remember Me',
          portada: 'assets/img/JHud.jpeg',
          audio: 'assets/audio/Where You At.mp3'
        },
        {
          nombre: 'Adele',
          album: '30',
          portada: 'assets/img/Adele.jpeg',
          audio: 'assets/audio/Easy On Me.mp3'
        },
        {
          nombre: 'Celine Dion',
          album: "Let's Talk About Love",
          portada: 'assets/img/CelineDion.jpeg',
          audio: 'assets/audio/My Heart Will Go On.mp3'
        },
        {
          nombre: 'Beyoncé',
          album: 'Renaissance',
          portada: 'assets/img/Beyonce.jpeg',
          audio: 'assets/audio/BREAK MY SOUL.mp3'
        },
        {
          nombre: 'Whitney Houston',
          album: 'Whitney',
          portada: 'assets/img/WhitneyHouston.jpeg',
          audio: 'assets/audio/I Wanna Dance with Somebody (Who Loves Me).mp3'
        },
        {
          nombre: 'Jenni Rivera',
          album: 'Joyas prestadas',
          portada: 'assets/img/JenniRivera.jpeg',
          audio: 'assets/audio/A Cambio De Qué.mp3'
        }
      ].map(a => ({
        ...a,
        isPlaying: false,
        progreso: 0,
        tiempoActual: '00:00'
      }));

      for (const artista of artistasIniciales) {
        await this.artistasDB.agregar(artista);
      }
    }

    await this.actualizarListas();
  }

  async actualizarListas() {
    const todos = await this.artistasDB.obtenerTodos();
    this.artistasLocales = todos.filter(a => a.audio.startsWith('assets/'));
    this.artistasNuevos = todos.filter(a => a.audio.startsWith('data:audio'));
  }

  // 🔄 Se llama desde el componente hijo al agregar un artista
  async cargarArtistasNuevos() {
    await this.actualizarListas();
  }

  async borrarTodos() {
    await this.artistasDB.borrarTodos();
    this.artistasNuevos = [];
    if (this.currentAudio) this.currentAudio.pause();
  }

  async eliminarArtista(id?: number) {
    if (id === undefined) return;
    await this.artistasDB.borrarPorId(id);
    await this.actualizarListas();
  }

  empezarEdicion(artista: Artista) {
    this.artistaEditandoId = artista.id ?? null;
  }

  cancelarEdicion() {
    this.artistaEditandoId = null;
  }

  async guardarEdicion(artista: Artista) {
    await this.artistasDB.editar(artista);
    this.artistaEditandoId = null;
    await this.actualizarListas();
  }

  toggleAudio(artista: Artista, audioPlayer: HTMLAudioElement) {
    if (this.currentAudio && this.currentAudio !== audioPlayer) {
      this.currentAudio.pause();
      if (this.currentArtista) {
        this.currentArtista.isPlaying = false;
      }
    }

    if (artista.isPlaying) {
      audioPlayer.pause();
      artista.isPlaying = false;
    } else {
      audioPlayer.play();
      artista.isPlaying = true;
      this.currentAudio = audioPlayer;
      this.currentArtista = artista;
    }
  }

  actualizarProgreso(event: any, artista: Artista) {
    const audio = event.target as HTMLAudioElement;
    const porcentaje = (audio.currentTime / audio.duration) * 100;
    artista.progreso = porcentaje;

    const minutos = Math.floor(audio.currentTime / 60);
    const segundos = Math.floor(audio.currentTime % 60);
    artista.tiempoActual = `${minutos.toString().padStart(2, '0')}:${segundos
      .toString()
      .padStart(2, '0')}`;
  }

  finalizarAudio(artista: Artista) {
    artista.isPlaying = false;
    artista.progreso = 0;
    artista.tiempoActual = '00:00';
    this.currentAudio = null;
    this.currentArtista = null;
  }

  ngOnDestroy() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (this.currentArtista) {
      this.currentArtista.isPlaying = false;
    }
  }
}
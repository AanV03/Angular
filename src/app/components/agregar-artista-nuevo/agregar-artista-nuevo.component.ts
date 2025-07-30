import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artista, ArtistasDbService } from '../../services/artistas-db.service';

@Component({
  selector: 'app-agregar-artista-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-artista-nuevo.component.html',
  styleUrls: ['./agregar-artista-nuevo.component.css']
})
export class AgregarArtistaNuevoComponent {
  formulario: FormGroup;
  enviando = false;
  submitted = false;

  @Output() artistaAgregado = new EventEmitter<void>();

  constructor(
    private artistasDB: ArtistasDbService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      album: ['', [Validators.required, Validators.minLength(2)]],
      portada: [null, Validators.required],
      audio: [null, Validators.required]
    });
  }

  onFileSelected(event: Event, tipo: 'portada' | 'audio') {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    const control = this.formulario.get(tipo);

    if (!control) return;

    if (!archivo) {
      control.setValue(null);
      control.setErrors({ required: true });
      control.markAsTouched();
      control.updateValueAndValidity();
      return;
    }

    const esImagen = tipo === 'portada' && archivo.type.startsWith('image/');
    const esAudio = tipo === 'audio' && archivo.type.startsWith('audio/');

    if (!esImagen && !esAudio) {
      alert(tipo === 'portada' ? 'Solo se permiten imágenes' : 'Solo se permiten archivos de audio');
      return;
    }

    // se aplica solo el filtro a portada ya que la mayoria de audios pasaran 1MB
    // lo cual rompe la logica en el caso de mi app
    if (tipo === 'portada') {
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (archivo.size > maxSize) {
        alert('La imagen excede el tamaño máximo permitido (1MB).');
        return;
      }
    }

    const lector = new FileReader();
    lector.onload = () => {
      const base64 = lector.result as string;
      control.setValue(base64);
      control.markAsTouched();
      control.updateValueAndValidity();
    };
    lector.readAsDataURL(archivo);
  }

  marcarComoTocado(campo: 'portada' | 'audio') {
    const control = this.formulario.get(campo);
    if (control && !control.touched) {
      control.markAsTouched();
    }
  }

  mostrarError(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  async agregarArtista() {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    const portadaControl = this.formulario.get('portada');
    const audioControl = this.formulario.get('audio');

    if (portadaControl) {
      portadaControl.markAsTouched();
      if (!portadaControl.value) {
        portadaControl.setErrors({ required: true });
      }
    }

    if (audioControl) {
      audioControl.markAsTouched();
      if (!audioControl.value) {
        audioControl.setErrors({ required: true });
      }
    }

    if (this.formulario.invalid) return;

    this.enviando = true;

    const artista: Artista = {
      ...this.formulario.value,
      isPlaying: false,
      progreso: 0,
      tiempoActual: '00:00'
    };

    await this.artistasDB.agregar(artista);
    this.artistaAgregado.emit();
    this.formulario.reset();
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.submitted = false;
    this.enviando = false;
  }
}

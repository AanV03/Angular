import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosDbService } from '../../services/usuarios-db.service';
import * as bcrypt from 'bcryptjs'; // Importa bcryptjs para encriptar contraseñas

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  usuario: string = '';
  password: string = '';
  confirmar: string = '';
  error: string = '';
  exito: string = '';

  constructor(public router: Router, private usuariosDB: UsuariosDbService) { }

  async registrar() {
    this.error = '';
    this.exito = '';

    if (!this.usuario.trim() || !this.password || !this.confirmar) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.password !== this.confirmar) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const yaExiste = await this.usuariosDB.existe(this.usuario);
    if (yaExiste) {
      this.error = 'Ese nombre de usuario ya está registrado.';
      return;
    }

    // Hasheamos la contraseña 
    const salt = bcrypt.genSaltSync(10);
    const passwordHasheado = bcrypt.hashSync(this.password, salt);

    // Guardar en IndexedDB
    await this.usuariosDB.registrar({
      usuario: this.usuario,
      password: passwordHasheado
    });

    // Login automático
    localStorage.setItem('usuario', this.usuario);
    window.dispatchEvent(new Event('usuario-cambiado'));
    this.exito = 'Usuario registrado con éxito. Redirigiendo...';

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }
}

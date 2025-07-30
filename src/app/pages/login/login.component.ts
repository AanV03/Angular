import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosDbService } from '../../services/usuarios-db.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  error: string = '';

  constructor(public router: Router, private usuariosDB: UsuariosDbService) { }

  async login() {
    this.error = '';

    if (!this.usuario.trim() || !this.password.trim()) {
      this.error = 'Por favor ingresa usuario y contraseña.';
      return;
    }

    const usuarioDb = await this.usuariosDB.obtener(this.usuario);

    if (!usuarioDb) {
      this.error = 'Usuario o contraseña incorrectos.';
      return;
    }

    const coincide = bcrypt.compareSync(this.password, usuarioDb.password);

    if (!coincide) {
      this.error = 'Usuario o contraseña incorrectos.';
      return;
    }

    localStorage.setItem('usuario', this.usuario);
    window.dispatchEvent(new Event('usuario-cambiado'));
    this.router.navigate(['/']);
  }
}

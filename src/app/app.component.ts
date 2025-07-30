import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AirGuard';
  usuario: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('usuario');

    //  Escucha el evento personalizado para actualizar usuario dinámicamente
    window.addEventListener('usuario-cambiado', () => {
      this.usuario = localStorage.getItem('usuario');
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.router.navigate(['/login']);
  }
}

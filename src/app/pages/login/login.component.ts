import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true
})
export class LoginComponent {
  usuario: string = '';

  constructor(private router: Router) { }

  login() {
    if (!this.usuario.trim()) return;
    localStorage.setItem('usuario', this.usuario.trim());
    this.router.navigate(['/']);
  }
}

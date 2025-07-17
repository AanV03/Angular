import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-botones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './botones.component.html',
  styleUrls: ['./botones.component.css']
})
export class BotonesComponent {
  cambiarFondo(color: 'original'| 'verde' | 'morado' | 'naranja') {
    const body = document.body;

    // Quitar cualquier clase anterior
    body.classList.remove('original-bg', 'verde-bg', 'morado-bg', 'naranja-bg');

    // Agregar la nueva clase
    body.classList.add(`${color}-bg`);
  }
}

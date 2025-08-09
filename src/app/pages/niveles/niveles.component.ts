import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorCardComponent } from '../../components/sensor-card/sensor-card.component';

@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [
    CommonModule,
    SensorCardComponent
  ],
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css']
})
export class NivelesComponent {
  sensorData = [
    { icon: 'fas fa-smog', label: 'PM2.5', value: '32 µg/m³' },
    { icon: 'fas fa-temperature-high', label: 'Temperatura', value: '24°C' },
    { icon: 'fas fa-tint', label: 'Humedad', value: '58%' },
    { icon: 'fas fa-cloud', label: 'Gas', value: 'Normal' }
  ];
}

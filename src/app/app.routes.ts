import { Routes } from '@angular/router';
import { ArtistasComponent } from './pages/artistas/artistas.component';
import { NivelesComponent } from './pages/niveles/niveles.component';
import { BotonesComponent } from './pages/botones/botones.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';


export const routes: Routes = [
    {
        path: '',
        component: InicioComponent
    },
    {
        path: 'niveles',
        component: NivelesComponent
    },
    {
        path: 'botones',
        component: BotonesComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'artistas',
        component: ArtistasComponent,
        canActivate: [authGuard]
    }
];




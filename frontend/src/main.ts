import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { ChatComponent } from './app/chat/chat.component';
import { provideHttpClient, withFetch } from '@angular/common/http';  // Importa withFetch e api
import './polyfills';
import 'flowbite';  // Importa o Flowbite

// Defina as rotas
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Redireciona para /login
  { path: 'login', component: LoginComponent },          // Página de login
  { path: 'chat', component: ChatComponent }             // Página de chat
];

// Bootstrap da aplicação
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())  // Substitui HttpClientModule pela nova API recomendada com fetch
  ]
}).catch((err) => console.error(err));

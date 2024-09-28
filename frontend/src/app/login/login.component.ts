import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/websocket.service';  // Certifique-se de que o caminho está correto
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nickname: string = '';  // Propriedade para armazenar o apelido
  errorMessage: string | null = null;  // Para armazenar a mensagem de erro

  constructor(private router: Router, private webSocketService: WebSocketService) {}

  login() {
    // Verifica se o nickname tem mais de 18 caracteres
    if (this.nickname.length > 18) {
      this.errorMessage = 'O apelido não pode ter mais de 18 caracteres.';
      return;
    }

    // Verifica se o nickname não está vazio
    if (this.nickname.trim()) {
      this.errorMessage = null;  // Limpa qualquer erro anterior

      // Verifica se o nickname já está em uso via REST
      this.webSocketService.checkNicknameExists(this.nickname).subscribe(nicknameExists => {
        if (nicknameExists) {
          this.errorMessage = 'Esse nickname já está em uso. Por favor, escolha outro.';
        } else {
          // Se o nickname não está em uso, proceda com o login
          this.webSocketService.setUsername(this.nickname); // Define o nome de usuário
          this.router.navigate(['/chat'], { state: { nickname: this.nickname } });
        }
      }, error => {
        this.errorMessage = 'Erro ao verificar o nickname. Tente novamente.';
      });

    } else {
      // Exibe mensagem caso o apelido esteja vazio
      this.errorMessage = 'Por favor, insira um apelido válido';
    }
  }

  // Método para fechar a mensagem de erro
  closeError(): void {
    this.errorMessage = null;
  }
}

import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  // Propriedades para armazenar informações do chat
  nickname: string = '';  // Nome do usuário no chat
  message: string = '';  // Mensagem a ser enviada
  messages: { sender: string, content: string, timestamp: string }[] = [];  // Histórico de mensagens
  connectedUsers: string[] = [];  // Lista de usuários conectados
  avatarUrls: string[] = [];  // Lista de URLs de avatares para os usuários conectados
  errorMessage: string = '';  // Mensagem de erro para exibir na interface

  // ViewChild para manter referência ao elemento da lista de mensagens
  @ViewChild('chatThread') private chatThread!: ElementRef;

  // Injeção de dependências: WebSocketService para comunicação com o servidor e Router para navegação
  constructor(private webSocketService: WebSocketService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.nickname = navigation.extras.state['nickname'];  // Recupera o nickname passado via navegação
      this.webSocketService.setUsername(this.nickname);  // Define o nickname no WebSocket
    }
  }

  // Método de inicialização do componente
  ngOnInit(): void {
    if (!this.nickname) {  // Se o usuário não tem nickname, redireciona para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Armazena o nickname na sessão do navegador
    sessionStorage.setItem('nickname', this.nickname);

    // Adiciona o evento para remover o usuário quando a janela for fechada
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    // Inscreve-se nos eventos de mensagens e usuários conectados
    this.subscribeToMessages();
    this.subscribeToConnectedUsers();

    // Adiciona o usuário à lista de conectados
    this.webSocketService.addUser();
  }

  // Limpeza dos eventos ao destruir o componente
  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }
  }

  // Verifica se o componente foi atualizado e rola para a última mensagem
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // Inscrição no serviço de WebSocket para receber mensagens
  private subscribeToMessages(): void {
    this.webSocketService.getMessages().subscribe((message) => {
      if (message) {
        this.messages.push({
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp
        });
      }
    });
  }

  // Inscrição para receber a lista de usuários conectados
  private subscribeToConnectedUsers(): void {
    this.webSocketService.getConnectedUsers().subscribe((users) => {
      this.connectedUsers = users;
      this.assignAvatars();  // Atribui avatares sempre que a lista de usuários mudar
    });
  }

  // Remove o usuário da lista ao fechar a janela
  handleBeforeUnload(event: Event): void {
    this.webSocketService.removeUser();
  }

  // Envia a mensagem ao servidor de WebSocket
  sendMessage(event: Event): void {
    event.preventDefault();  // Evita o comportamento padrão de envio do formulário

    // Verifica o tamanho da mensagem
    if (this.message.length > 100) {
      this.errorMessage = 'A mensagem não pode exceder 100 caracteres!';
      return;
    }

    // Verifica se a mensagem não está em branco
    if (this.message.trim()) {
      this.webSocketService.sendMessage(this.message);  // Envia a mensagem via WebSocket
      this.message = '';  // Limpa o campo de entrada de mensagem
      this.errorMessage = '';  // Limpa qualquer mensagem de erro
    }
  }

  // Função para fechar a mensagem de erro
  closeError(): void {
    this.errorMessage = '';
  }

  // Atribui avatares aos usuários conectados com base em uma lista de URLs numerados
  assignAvatars(): void {
    this.avatarUrls = this.connectedUsers.map((_, index) => {
      return `https://randomuser.me/api/portraits/lego/${(index % 10)}.jpg`;  // Alterna entre 10 avatares
    });
  }

  // Função para obter o avatar de cada usuário
  getAvatarUrl(index: number): string {
    return this.avatarUrls[index];
  }

  // Função para rolar automaticamente para o final da lista de mensagens
  private scrollToBottom(): void {
    try {
      this.chatThread.nativeElement.scrollTop = this.chatThread.nativeElement.scrollHeight;  // Rola até o fim
    } catch (err) {
      console.error('Erro ao rolar para a última mensagem:', err);
    }
  }
}

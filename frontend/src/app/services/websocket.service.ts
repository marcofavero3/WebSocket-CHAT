import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject = new BehaviorSubject<any>(null);
  private usersSubject = new BehaviorSubject<string[]>([]);
  private errorSubject = new BehaviorSubject<string | null>(null);  // Novo subject para erros de nickname duplicado
  private username: string = '';
  private isConnected: boolean = false;  // Flag para controlar se está conectado

  constructor(private http: HttpClient) { 
    // Inicializando o cliente STOMP
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('WebSocket Debug: ', str);
      },
      reconnectDelay: 5000, // Delay de reconexão
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    // Ação quando a conexão for estabelecida
    this.client.onConnect = () => {
      console.log('Conectado ao WebSocket!');
      this.isConnected = true; // Marca como conectado

      // Subscrição para receber mensagens do chat
      this.client.subscribe('/topic/public', message => {
        const chatMessage = JSON.parse(message.body);
        this.messageSubject.next(chatMessage);
      });

      // Subscrição para a lista de usuários conectados via WebSocket
      this.client.subscribe('/topic/users', message => {
        const connectedUsers = JSON.parse(message.body);
        console.log('Usuários conectados (via WebSocket):', connectedUsers);
        this.usersSubject.next(connectedUsers);
      });

      // Subscrição para erros de nickname duplicado
      this.client.subscribe('/user/queue/errors', errorMessage => {
        const error = JSON.parse(errorMessage.body);
        console.log('Erro recebido:', error.content);
        this.errorSubject.next(error.content);  // Atualizar o erro no subject
      });

      // Adiciona o usuário ao chat após a conexão
      this.addUser();
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket desconectado!');
      this.isConnected = false; // Marca como desconectado
    };

    this.client.activate(); // Ativa a conexão WebSocket
  }

  // Definir o nome de usuário
  setUsername(name: string) {
    this.username = name;
    sessionStorage.setItem('nickname', name); // Salva no sessionStorage
  }

  // Método para adicionar usuário ao chat via WebSocket
  addUser(): void {
    if (this.isConnected && this.username) {
      const chatMessage = {
        sender: this.username,
        type: 'JOIN'
      };
      this.client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.warn('WebSocket ainda não está conectado ou nome de usuário não definido');
    }
  }

  // Verificar se o nickname já existe via REST
  checkNicknameExists(nickname: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.get<string[]>('http://localhost:8080/users/connected').subscribe(users => {
        const nicknameExists = users.includes(nickname);
        observer.next(nicknameExists);
        observer.complete();
      }, error => {
        console.error('Erro ao verificar usuários conectados:', error);
        observer.error(error);
      });
    });
  }

  // Enviar mensagem de chat via WebSocket
  sendMessage(content: string): void {
    if (content.trim() && this.isConnected) {
      const chatMessage = {
        sender: this.username,
        content,
        type: 'CHAT'
      };
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.warn('Não foi possível enviar a mensagem: WebSocket desconectado');
    }
  }

  // Método para o usuário sair do chat via WebSocket
  removeUser(): void {
    if (this.isConnected && this.username) {
      const chatMessage = {
        sender: this.username,
        type: 'LEAVE'
      };
      this.client.publish({
        destination: '/app/chat.removeUser',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.warn('Não foi possível remover o usuário: WebSocket desconectado');
    }
  }

  // Obter mensagens recebidas
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Obter lista de usuários conectados via WebSocket
  getConnectedUsers(): Observable<string[]> {
    return this.usersSubject.asObservable();
  }

  // Obter erros de nickname duplicado
  getErrors(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  // Método adicional para obter usuários conectados via REST
  fetchConnectedUsersREST(): void {
    this.http.get<string[]>('http://localhost:8080/users/connected').subscribe(users => {
      console.log('Usuários conectados (via REST):', users);
      this.usersSubject.next(users);  // Atualizar a lista de usuários conectados
    }, error => {
      console.error('Erro ao obter usuários via REST:', error);
    });
  }
}

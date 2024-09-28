package com.centauri.chat.config;

import com.centauri.chat.chat.ChatMessage;
import com.centauri.chat.chat.ChatMessageRepository;
import com.centauri.chat.chat.MessageType;
import com.centauri.chat.service.ConnectedUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Component  // Define esta classe como um componente gerenciado pelo Spring
@Slf4j  // Lombok cria automaticamente logs para a classe
@RequiredArgsConstructor  // Lombok cria um construtor com os campos finais declarados
public class WebSocketEventListener {

    // Envia mensagens para destinos configurados no WebSocket
    private final SimpMessageSendingOperations messagingTemplate;
    // Serviço que gerencia a lista de usuários conectados
    private final ConnectedUserService connectedUserService;
    // Repositório para salvar mensagens no banco de dados
    private final ChatMessageRepository chatMessageRepository;

    // Método que escuta eventos de desconexão do WebSocket
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Obtém os cabeçalhos da sessão de WebSocket, encapsulando a mensagem de desconexão
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // Recupera o nome de usuário da sessão que está se desconectando
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        // Se o usuário existir (sessão com nome de usuário)
        if (username != null) {
            log.info("Usuário desconectado: {}", username);

            // Remove o usuário da lista de usuários conectados
            connectedUserService.getConnectedUsers().remove(username);

            log.info("Usuários conectados após a saída: {}", connectedUserService.getConnectedUsers());

            // Envia a lista atualizada de usuários conectados para o tópico "/topic/users"
            messagingTemplate.convertAndSend("/topic/users", connectedUserService.getConnectedUsers());

            // Cria uma mensagem informando que o usuário saiu do chat
            ChatMessage leaveMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)  // Define o tipo como LEAVE (usuário saiu)
                    .sender(username)  // Define o nome de quem saiu
                    .content("saiu do chat!")  // Mensagem de conteúdo que informa que saiu
                    .timestamp(LocalDateTime.now())  // Adiciona o timestamp da saída
                    .build();

            // Salva a mensagem de saída no banco de dados
            chatMessageRepository.save(leaveMessage);

            // Envia a mensagem de saída para todos os usuários no tópico "/topic/public"
            messagingTemplate.convertAndSend("/topic/public", leaveMessage);
        }
    }
}

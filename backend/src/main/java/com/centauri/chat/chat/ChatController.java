package com.centauri.chat.chat;

import com.centauri.chat.chat.ChatMessageRepository;
import com.centauri.chat.service.ConnectedUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    // Objeto responsável por enviar mensagens para o tópico público
    private final SimpMessagingTemplate messagingTemplate;

    // Serviço para gerenciar os usuários conectados no chat
    private final ConnectedUserService connectedUserService;

    // Repositório para salvar mensagens no banco de dados
    private final ChatMessageRepository chatMessageRepository;

    /**
     * Método para enviar uma mensagem no chat.
     * Mapeado para "/chat.sendMessage", será chamado quando uma mensagem for enviada por um usuário.
     *
     * @param chatMessage A mensagem enviada pelo usuário, passada como payload.
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Log da mensagem enviada
        log.info("Enviando mensagem de {}: {}", chatMessage.getSender(), chatMessage.getContent());

        // Define o timestamp da mensagem para o horário atual
        chatMessage.setTimestamp(LocalDateTime.now());

        // Salva a mensagem no banco de dados
        chatMessageRepository.save(chatMessage);

        // Envia a mensagem para todos os usuários conectados no tópico público
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }

    /**
     * Método para adicionar um novo usuário ao chat.
     * Mapeado para "/chat.addUser", será chamado quando um novo usuário tentar se conectar.
     *
     * @param chatMessage A mensagem enviada pelo usuário, passada como payload, contendo o nickname.
     * @param headerAccessor Acessor para manipular os headers da mensagem, como session attributes.
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String nickname = chatMessage.getSender();

        // Verifica se o nickname já está em uso
        if (connectedUserService.getConnectedUsers().contains(nickname)) {
            log.warn("Nickname duplicado: {}", nickname);

            // Cria uma mensagem de erro informando que o nickname está em uso
            ChatMessage errorMessage = ChatMessage.builder()
                    .type(MessageType.ERROR)
                    .sender("system")
                    .content("Esse nickname já está em uso. Por favor, escolha outro.")
                    .timestamp(LocalDateTime.now())
                    .build();

            // Envia a mensagem de erro diretamente ao usuário que tentou usar o nickname duplicado
            messagingTemplate.convertAndSendToUser(nickname, "/queue/errors", errorMessage);
            return;  // Retorna, evitando a adição de um usuário com nickname duplicado
        }

        // Se o nickname for válido, adiciona ao header e à lista de usuários conectados
        log.info("Usuário {} entrou no chat", nickname);
        headerAccessor.getSessionAttributes().put("username", nickname);
        connectedUserService.getConnectedUsers().add(nickname);

        log.info("Usuários conectados: {}", connectedUserService.getConnectedUsers());

        // Envia a lista atualizada de usuários conectados para todos os usuários no tópico
        messagingTemplate.convertAndSend("/topic/users", connectedUserService.getConnectedUsers());

        // Cria uma mensagem informando que o usuário entrou no chat
        ChatMessage joinMessage = ChatMessage.builder()
                .type(MessageType.JOIN)
                .sender(nickname)
                .content("entrou no chat!")
                .timestamp(LocalDateTime.now())
                .build();

        // Salva a mensagem de entrada no banco de dados
        chatMessageRepository.save(joinMessage);

        // Envia a mensagem de entrada para todos os usuários conectados no tópico público
        messagingTemplate.convertAndSend("/topic/public", joinMessage);
    }
}

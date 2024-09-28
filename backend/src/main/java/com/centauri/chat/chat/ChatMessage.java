package com.centauri.chat.chat;

import jakarta.persistence.*;  // Import correto para Jakarta Persistence
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity  // Indica que esta classe é uma entidade JPA, que será mapeada para uma tabela no banco de dados
@Table(name = "chat_message")  // Especifica o nome da tabela no banco de dados que armazenará as mensagens de chat
public class ChatMessage {

    @Id  // Define o campo "id" como chave primária da entidade
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Gera o valor do ID automaticamente usando a estratégia de identidade (auto-incremento)
    private Long id;

    @Enumerated(EnumType.STRING)  // Define que o campo "type" será armazenado como uma string no banco de dados, representando o enum MessageType
    private MessageType type;

    private String content;  // Conteúdo da mensagem

    private String sender;  // Remetente da mensagem

    private LocalDateTime timestamp;  // Data e hora em que a mensagem foi enviada
}

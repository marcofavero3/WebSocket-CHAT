package com.centauri.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration  // Define esta classe como uma classe de configuração Spring
@EnableWebSocketMessageBroker  // Habilita o WebSocket com suporte a mensagens STOMP (protocolo de mensagens)
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // Método para registrar o endpoint WebSocket e permitir conexões
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")  // Define o endpoint de conexão WebSocket na URL "/ws"
                .setAllowedOrigins("http://localhost:4200")  // Permite que o frontend Angular (executando no localhost:4200) acesse o WebSocket
                .withSockJS();  // Habilita fallback para SockJS, um protocolo de backup caso o WebSocket não esteja disponível
    }

    // Método para configurar o message broker (servidor de mensagens) que encaminha mensagens
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");  // Define o prefixo "/app" para mensagens enviadas do cliente ao servidor
        registry.enableSimpleBroker("/topic");  // Habilita um message broker simples no servidor que encaminha mensagens para destinos com o prefixo "/topic"
    }
}

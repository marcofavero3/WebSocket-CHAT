package com.centauri.chat.chat.cors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // Indica que esta classe define configurações do Spring
public class CorsConfig {

    // Define um bean que configura as políticas de CORS
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            // Método para adicionar mapeamento de CORS
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Adiciona mapeamento para todas as rotas (/**) da aplicação
                registry.addMapping("/**")
                        // Define as origens permitidas para as requisições CORS, neste caso o frontend Angular
                        .allowedOrigins("http://localhost:4200")
                        // Define os métodos HTTP permitidos para CORS (GET, POST, PUT, DELETE, OPTIONS)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Permite todos os cabeçalhos nas requisições
                        .allowedHeaders("*")
                        // Permite envio de credenciais como cookies, tokens de autenticação, etc.
                        .allowCredentials(true);
            }
        };
    }
}

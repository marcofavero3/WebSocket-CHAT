package com.centauri.chat.service;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ConnectedUserService {

    @Getter
    private final Set<String> connectedUsers = ConcurrentHashMap.newKeySet(); // Conjunto seguro para múltiplas threads

}

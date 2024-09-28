package com.centauri.chat.controller;

import com.centauri.chat.service.ConnectedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final ConnectedUserService connectedUserService;

    @GetMapping("/users/connected")
    public Set<String> getConnectedUsers() {
        return connectedUserService.getConnectedUsers();
    }
}

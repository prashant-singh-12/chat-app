package com.prashant.teams.controller;

import com.prashant.teams.dto.AuthResponse;
import com.prashant.teams.dto.LoginRequest;
import com.prashant.teams.dto.RegisterRequest;
import com.prashant.teams.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        log.info("Login request: {}", loginRequest);
        return authService.login(loginRequest);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("Inside /api/auth/test endpoint");  // Should print
        return ResponseEntity.ok("Test endpoint hit!");
    }


}

package com.shopnow.userservice.controller;

import com.shopnow.userservice.dto.AuthRequest;
import com.shopnow.userservice.dto.AuthResponse;
import com.shopnow.userservice.dto.UserRequest;
import com.shopnow.userservice.entity.User;
import com.shopnow.userservice.repository.UserRepository;
import com.shopnow.userservice.security.JwtTokenUtil;
import com.shopnow.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenUtil.generateToken(user.getEmail(), List.of(user.getRole().name()));

        return ResponseEntity.ok(new AuthResponse(token));
    }


    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody UserRequest userRequest) {
        User newUser = userService.registerUser(userRequest);
        return ResponseEntity.ok(newUser);
    }
}

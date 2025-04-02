package com.shopnow.userservice.controller;

import com.shopnow.userservice.dto.UserRequest;
import com.shopnow.userservice.entity.User;
import com.shopnow.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody UserRequest userRequest) {
        User newUser = userService.registerUser(userRequest);
        return ResponseEntity.ok(newUser);
    }
}

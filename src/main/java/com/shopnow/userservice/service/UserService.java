package com.shopnow.userservice.service;

import com.shopnow.userservice.dto.UserRequest;
import com.shopnow.userservice.entity.*;
import com.shopnow.userservice.exception.EmailAlreadyExistsException;
import com.shopnow.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(UserRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }
}

package com.shopnow.userservice;

import com.shopnow.userservice.dto.UserRequest;
import com.shopnow.userservice.entity.Role;
import com.shopnow.userservice.entity.User;
import com.shopnow.userservice.exception.EmailAlreadyExistsException;
import com.shopnow.userservice.repository.UserRepository;
import com.shopnow.userservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

    private final UserService userService = new UserService(userRepository, passwordEncoder);

    @Test
    void testRegisterUser_success() {
        // Given
        UserRequest request = new UserRequest();
        request.setEmail("mock@test.com");
        request.setPassword("abc123");
        request.setFullName("Mock User");

        when(userRepository.findByEmail("mock@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("abc123")).thenReturn("encoded-pw");

        User savedUser = User.builder()
                .id("mock-id")
                .email("mock@test.com")
                .password("encoded-pw")
                .fullName("Mock User")
                .role(Role.USER)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.registerUser(request);

        // Then
        assertEquals("mock@test.com", result.getEmail());
        assertEquals("Mock User", result.getFullName());
        assertEquals("encoded-pw", result.getPassword());
        assertEquals(Role.USER, result.getRole());
    }


    @Test
    void testRegisterUser_whenEmailAlreadyExists_shouldThrowException() {
        //Given
        UserRequest request = new UserRequest();
        request.setEmail("existing@test.com");
        request.setPassword("password");
        request.setFullName("UserExists");

        // Simulate that user already exists in the DB
        when(userRepository.findByEmail("existing@test.com"))
                .thenReturn(Optional.of(User.builder().email("existing@test.com").build()));

        // When + Then
        assertThrows(EmailAlreadyExistsException.class, () -> userService.registerUser(request));

    }
}
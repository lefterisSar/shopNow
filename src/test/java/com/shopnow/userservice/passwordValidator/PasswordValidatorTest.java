package com.shopnow.userservice.passwordValidator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PasswordValidatorTest {

    private final PasswordValidator passwordValidator = new PasswordValidator();

    @Test
    void testValidPassword() {
        // Given
        String validPassword = "StrongP@ss1";

        // When
        List<String> errors = passwordValidator.validate(validPassword);

        // Then
        assertTrue(errors.isEmpty(), "Valid password should not have any validation errors");
    }

    @Test
    void testNullPassword() {
        // When
        List<String> errors = passwordValidator.validate(null);

        // Then
        assertEquals(1, errors.size(), "Null password should have one validation error");
        assertTrue(errors.get(0).contains("at least 8 characters"), "Error should mention minimum length");
    }

    @Test
    void testShortPassword() {
        // Given
        String shortPassword = "Abc1@";

        // When
        List<String> errors = passwordValidator.validate(shortPassword);

        // Then
        assertEquals(1, errors.size(), "Short password should have one validation error");
        assertTrue(errors.get(0).contains("at least 8 characters"), "Error should mention minimum length");
    }

    @ParameterizedTest
    @ValueSource(strings = {"password123@", "password123$"})
    void testPasswordWithoutUppercase(String password) {
        // When
        List<String> errors = passwordValidator.validate(password);

        // Then
        assertEquals(1, errors.size(), "Password without uppercase should have one validation error");
        assertTrue(errors.get(0).contains("uppercase"), "Error should mention uppercase requirement");
    }

    @ParameterizedTest
    @ValueSource(strings = {"PASSWORD123@", "PASSWORD123$"})
    void testPasswordWithoutLowercase(String password) {
        // When
        List<String> errors = passwordValidator.validate(password);

        // Then
        assertEquals(1, errors.size(), "Password without lowercase should have one validation error");
        assertTrue(errors.get(0).contains("lowercase"), "Error should mention lowercase requirement");
    }

    @ParameterizedTest
    @ValueSource(strings = {"Password@", "Password$"})
    void testPasswordWithoutDigit(String password) {
        // When
        List<String> errors = passwordValidator.validate(password);

        // Then
        assertEquals(1, errors.size(), "Password without digit should have one validation error");
        assertTrue(errors.get(0).contains("digit"), "Error should mention digit requirement");
    }

    @ParameterizedTest
    @ValueSource(strings = {"Password123", "Password456"})
    void testPasswordWithoutSpecialChar(String password) {
        // When
        List<String> errors = passwordValidator.validate(password);

        // Then
        assertEquals(1, errors.size(), "Password without special character should have one validation error");
        assertTrue(errors.get(0).contains("special character"), "Error should mention special character requirement");
    }

    @Test
    void testPasswordWithMultipleIssues() {
        // Given
        String weakPassword = "pass";

        // When
        List<String> errors = passwordValidator.validate(weakPassword);

        // Then
        assertEquals(4, errors.size(), "Weak password should have multiple validation errors");
        assertTrue(errors.stream().anyMatch(error -> error.contains("uppercase")), "Should mention uppercase requirement");
        assertTrue(errors.stream().anyMatch(error -> error.contains("digit")), "Should mention digit requirement");
        assertTrue(errors.stream().anyMatch(error -> error.contains("special character")), "Should mention special character requirement");
        assertTrue(errors.stream().anyMatch(error -> error.contains("at least 8 characters")), "Should mention minimum length");
    }
}
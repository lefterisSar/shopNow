package com.shopnow.userservice.dto;

import com.shopnow.userservice.passwordValidator.StrongPassword;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class UserRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @StrongPassword
    private String password;

    @NotBlank
    private String fullName;
}

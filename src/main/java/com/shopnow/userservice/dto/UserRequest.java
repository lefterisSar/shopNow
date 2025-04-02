package com.shopnow.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class UserRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 50)
    private String password;

    @NotBlank
    private String fullName;
}

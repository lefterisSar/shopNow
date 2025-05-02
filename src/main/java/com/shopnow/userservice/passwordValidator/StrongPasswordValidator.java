package com.shopnow.userservice.passwordValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Validator for the {@link StrongPassword} annotation.
 */
@RequiredArgsConstructor
public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private final PasswordValidator passwordValidator;

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false;
        }

        List<String> errors = passwordValidator.validate(password);
        
        if (errors.isEmpty()) {
            return true;
        }
        
        // Disable the default error message
        context.disableDefaultConstraintViolation();
        
        // Add all validation errors as custom constraint violations
        errors.forEach(error -> 
            context.buildConstraintViolationWithTemplate(error)
                   .addConstraintViolation()
        );
        
        return false;
    }
}
package com.shopnow.userservice.passwordValidator;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class PasswordValidator {

    private static final int MIN_LENGTH = 8;
    private static final int MIN_UPPERCASE = 1;
    private static final int MIN_LOWERCASE = 1;
    private static final int MIN_DIGITS = 1;
    private static final int MIN_SPECIAL_CHARS = 1;
    
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[^A-Za-z0-9]");
    
    /**
     * Validates if a password meets the strength requirements.
     * 
     * @param password the password to validate
     * @return a list of validation errors, empty if the password is valid
     */
    public List<String> validate(String password) {
        List<String> errors = new ArrayList<>();
        
        if (password == null || password.length() < MIN_LENGTH) {
            errors.add("Password must be at least " + MIN_LENGTH + " characters long");
        }
        
        if (password != null) {
            if (countMatches(UPPERCASE_PATTERN, password) < MIN_UPPERCASE) {
                errors.add("Password must contain at least " + MIN_UPPERCASE + " uppercase letter(s)");
            }
            
            if (countMatches(LOWERCASE_PATTERN, password) < MIN_LOWERCASE) {
                errors.add("Password must contain at least " + MIN_LOWERCASE + " lowercase letter(s)");
            }
            
            if (countMatches(DIGIT_PATTERN, password) < MIN_DIGITS) {
                errors.add("Password must contain at least " + MIN_DIGITS + " digit(s)");
            }
            
            if (countMatches(SPECIAL_CHAR_PATTERN, password) < MIN_SPECIAL_CHARS) {
                errors.add("Password must contain at least " + MIN_SPECIAL_CHARS + " special character(s)");
            }
        }
        
        return errors;
    }
    
    /**
     * Counts the number of matches of a pattern in a string.
     * 
     * @param pattern the pattern to match
     * @param input the input string
     * @return the number of matches
     */
    private int countMatches(Pattern pattern, String input) {
        java.util.regex.Matcher matcher = pattern.matcher(input);
        int count = 0;
        while (matcher.find()) {
            count++;
        }
        return count;
    }
}
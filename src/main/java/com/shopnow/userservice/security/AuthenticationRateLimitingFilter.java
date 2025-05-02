package com.shopnow.userservice.security;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to apply rate limiting to authentication endpoints.
 * This prevents brute force attacks by limiting the number of login/register attempts
 * from a single IP address within a time period.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthenticationRateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingConfig rateLimitingConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Only apply rate limiting to authentication endpoints
        String requestURI = request.getRequestURI();
        if (isAuthenticationEndpoint(requestURI)) {
            String ipAddress = getClientIpAddress(request);
            Bucket bucket = rateLimitingConfig.resolveBucket(ipAddress);
            
            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
            
            if (probe.isConsumed()) {
                // Request is allowed, add rate limit headers
                response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
                filterChain.doFilter(request, response);
            } else {
                // Request is denied due to rate limiting
                long waitTimeSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
                response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitTimeSeconds));
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many login attempts. Please try again later.");
                log.warn("Rate limit exceeded for IP: {}", ipAddress);
            }
        } else {
            // Not an authentication endpoint, proceed without rate limiting
            filterChain.doFilter(request, response);
        }
    }

    /**
     * Check if the request URI is for an authentication endpoint.
     *
     * @param uri the request URI
     * @return true if the URI is for login or register endpoint
     */
    private boolean isAuthenticationEndpoint(String uri) {
        return uri.endsWith("/api/users/login") || uri.endsWith("/api/users/register");
    }

    /**
     * Extract the client IP address from the request.
     * Handles cases where the request might be coming through a proxy.
     *
     * @param request the HTTP request
     * @return the client's IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // In case of multiple proxies, the first IP is the client's
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
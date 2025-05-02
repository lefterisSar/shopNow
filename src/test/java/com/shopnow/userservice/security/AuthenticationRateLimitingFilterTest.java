package com.shopnow.userservice.security;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationRateLimitingFilterTest {

    private RateLimitingConfig rateLimitingConfig;
    private AuthenticationRateLimitingFilter filter;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private FilterChain filterChain;
    private Bucket bucket;
    private PrintWriter responseWriter;
    private StringWriter stringWriter;

    @BeforeEach
    void setUp() {
        rateLimitingConfig = mock(RateLimitingConfig.class);
        filter = new AuthenticationRateLimitingFilter(rateLimitingConfig);
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        filterChain = mock(FilterChain.class);
        bucket = mock(Bucket.class);

        stringWriter = new StringWriter();
        responseWriter = new PrintWriter(stringWriter);

        try {
            when(response.getWriter()).thenReturn(responseWriter);
        } catch (Exception e) {
            fail("Failed to set up response writer: " + e.getMessage());
        }
    }

    @Test
    void testDoFilterInternal_nonAuthEndpoint_shouldNotApplyRateLimit() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/products");

        // When
        filter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain).doFilter(request, response);
        verify(rateLimitingConfig, never()).resolveBucket(anyString());
    }

    @Test
    void testDoFilterInternal_loginEndpoint_shouldApplyRateLimit_allowed() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/users/login");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(rateLimitingConfig.resolveBucket("192.168.1.1")).thenReturn(bucket);

        // Simulate that the request is allowed (within rate limit)
        ConsumptionProbe consumptionProbe = mock(ConsumptionProbe.class);
        when(consumptionProbe.isConsumed()).thenReturn(true);
        when(consumptionProbe.getRemainingTokens()).thenReturn(4L);
        when(bucket.tryConsumeAndReturnRemaining(1)).thenReturn(consumptionProbe);

        // When
        filter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain).doFilter(request, response);
        verify(response).addHeader("X-Rate-Limit-Remaining", "4");
    }

    @Test
    void testDoFilterInternal_registerEndpoint_shouldApplyRateLimit_denied() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/users/register");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(rateLimitingConfig.resolveBucket("192.168.1.1")).thenReturn(bucket);

        // Simulate that the request is denied (exceeded rate limit)
        ConsumptionProbe rejectedProbe = mock(ConsumptionProbe.class);
        when(rejectedProbe.isConsumed()).thenReturn(false);
        when(rejectedProbe.getNanosToWaitForRefill()).thenReturn(5_000_000_000L);
        when(bucket.tryConsumeAndReturnRemaining(1)).thenReturn(rejectedProbe);

        // When
        filter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain, never()).doFilter(request, response);
        verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        verify(response).addHeader("X-Rate-Limit-Retry-After-Seconds", "5");

        // Verify response message
        responseWriter.flush();
        assertTrue(stringWriter.toString().contains("Too many login attempts"));
    }

    @Test
    void testGetClientIpAddress_withXForwardedFor() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/users/login");
        when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.195, 70.41.3.18, 150.172.238.178");
        when(rateLimitingConfig.resolveBucket("203.0.113.195")).thenReturn(bucket);

        // Simulate that the request is allowed
        ConsumptionProbe forwardedProbe = mock(ConsumptionProbe.class);
        when(forwardedProbe.isConsumed()).thenReturn(true);
        when(forwardedProbe.getRemainingTokens()).thenReturn(4L);
        when(bucket.tryConsumeAndReturnRemaining(1)).thenReturn(forwardedProbe);

        // When
        filter.doFilterInternal(request, response, filterChain);

        // Then
        verify(rateLimitingConfig).resolveBucket("203.0.113.195");
    }
}

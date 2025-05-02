package com.shopnow.userservice.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Configuration for rate limiting authentication endpoints.
 * Uses Bucket4j to implement token bucket algorithm for rate limiting.
 */
@Configuration
public class RateLimitingConfig {

    // Cache to store rate limiters for each IP address
    private final Map<String, Bucket> ipCache = new ConcurrentHashMap<>();

    /**
     * Get or create a rate limiter bucket for the given IP address.
     * Limits to 5 login/register attempts per minute.
     *
     * @param ipAddress the client's IP address
     * @return a bucket for rate limiting
     */
    public Bucket resolveBucket(String ipAddress) {
        return ipCache.computeIfAbsent(ipAddress, this::createNewBucket);
    }

    /**
     * Create a new bucket with a rate limit of 5 requests per minute.
     *
     * @param ipAddress the client's IP address (not used in the current implementation)
     * @return a new bucket with the defined rate limit
     */
    private Bucket createNewBucket(String ipAddress) {
        // Define bandwidth limit: 5 tokens per minute
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Clear the cache for an IP address.
     * Can be used to reset rate limiting for a specific IP.
     *
     * @param ipAddress the IP address to clear from the cache
     */
    public void clearCache(String ipAddress) {
        ipCache.remove(ipAddress);
    }
}
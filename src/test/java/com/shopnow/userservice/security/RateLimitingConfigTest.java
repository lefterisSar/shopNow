package com.shopnow.userservice.security;

import io.github.bucket4j.Bucket;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitingConfigTest {

    private final RateLimitingConfig rateLimitingConfig = new RateLimitingConfig();

    @Test
    void testResolveBucket_shouldReturnSameBucketForSameIp() {
        // Given
        String ipAddress = "192.168.1.1";

        // When
        Bucket bucket1 = rateLimitingConfig.resolveBucket(ipAddress);
        Bucket bucket2 = rateLimitingConfig.resolveBucket(ipAddress);

        // Then
        assertNotNull(bucket1);
        assertNotNull(bucket2);
        assertSame(bucket1, bucket2, "Should return the same bucket instance for the same IP");
    }

    @Test
    void testResolveBucket_shouldReturnDifferentBucketsForDifferentIps() {
        // Given
        String ipAddress1 = "192.168.1.1";
        String ipAddress2 = "192.168.1.2";

        // When
        Bucket bucket1 = rateLimitingConfig.resolveBucket(ipAddress1);
        Bucket bucket2 = rateLimitingConfig.resolveBucket(ipAddress2);

        // Then
        assertNotNull(bucket1);
        assertNotNull(bucket2);
        assertNotSame(bucket1, bucket2, "Should return different bucket instances for different IPs");
    }

    @Test
    void testBucketRateLimit_shouldAllowRequestsWithinLimit() {
        // Given
        String ipAddress = "192.168.1.1";
        Bucket bucket = rateLimitingConfig.resolveBucket(ipAddress);

        // When & Then
        // The bucket should allow 5 requests
        for (int i = 0; i < 5; i++) {
            assertTrue(bucket.tryConsume(1), "Request " + (i + 1) + " should be allowed");
        }
        
        // The 6th request should be denied
        assertFalse(bucket.tryConsume(1), "Request 6 should be denied");
    }

    @Test
    void testClearCache_shouldRemoveBucketForIp() {
        // Given
        String ipAddress = "192.168.1.1";
        Bucket originalBucket = rateLimitingConfig.resolveBucket(ipAddress);

        // When
        rateLimitingConfig.clearCache(ipAddress);
        Bucket newBucket = rateLimitingConfig.resolveBucket(ipAddress);

        // Then
        assertNotNull(originalBucket);
        assertNotNull(newBucket);
        assertNotSame(originalBucket, newBucket, "Should return a new bucket after clearing the cache");
    }
}
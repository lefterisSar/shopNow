package com.shopnow.userservice.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "spring.datasource")
public class DatasourceProperties {
    private String url;
    private String username;
    private String password;

    @PostConstruct
    public void checkEnv() {
        System.out.println("SPRING_DATASOURCE_PASSWORD (System): " + System.getProperty("SPRING_DATASOURCE_PASSWORD"));
        System.out.println("SPRING_DATASOURCE_USERNAME (System): " + System.getProperty("SPRING_DATASOURCE_USERNAME"));
        System.out.println("SPRING_DATASOURCE_URL (System): " + System.getProperty("SPRING_DATASOURCE_URL"));
    }

}
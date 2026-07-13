package com.personalmanagement.backend.Config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;

class SecurityConfigTest {
    private static final String PROJECT_ID = "personal-management-50914";
    private static final String ISSUER = "https://securetoken.google.com/" + PROJECT_ID;

    private final OAuth2TokenValidator<Jwt> validator =
            SecurityConfig.firebaseTokenValidator(PROJECT_ID, ISSUER);

    @Test
    void firebaseTokenValidator_shouldAcceptMatchingIssuerAndAudience() {
        assertThat(validator.validate(token(ISSUER, List.of(PROJECT_ID), Instant.now().plusSeconds(300))).hasErrors())
                .isFalse();
    }

    @Test
    void firebaseTokenValidator_shouldRejectWrongAudience() {
        assertThat(validator.validate(token(ISSUER, List.of("another-project"), Instant.now().plusSeconds(300)))
                .hasErrors()).isTrue();
    }

    @Test
    void firebaseTokenValidator_shouldRejectWrongIssuer() {
        assertThat(validator.validate(token("https://securetoken.google.com/another-project",
                List.of(PROJECT_ID), Instant.now().plusSeconds(300))).hasErrors()).isTrue();
    }

    @Test
    void firebaseTokenValidator_shouldRejectExpiredToken() {
        assertThat(validator.validate(token(ISSUER, List.of(PROJECT_ID), Instant.now().minusSeconds(300))).hasErrors())
                .isTrue();
    }

    private Jwt token(String issuer, List<String> audience, Instant expiresAt) {
        return Jwt.withTokenValue("firebase-token")
                .header("alg", "RS256")
                .subject("user-123")
                .issuer(issuer)
                .audience(audience)
                .issuedAt(expiresAt.minusSeconds(600))
                .expiresAt(expiresAt)
                .build();
    }
}

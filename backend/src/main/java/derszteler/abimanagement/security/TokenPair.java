package derszteler.abimanagement.security;

import jakarta.annotation.Nullable;

public record TokenPair(String accessToken, @Nullable String refreshToken) {}
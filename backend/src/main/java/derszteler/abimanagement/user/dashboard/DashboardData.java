package derszteler.abimanagement.user.dashboard;

import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;

public record DashboardData(
  @Schema(
    description = "The earliest date at which one of the user's quotes' or comments' review expires",
    example = "2024-01-31T00:00:00.00000Z",
    nullable = true
  )
  @Nullable
  LocalDateTime expiringAt,
  @Schema(description = "The executing user")
  User user
) {}
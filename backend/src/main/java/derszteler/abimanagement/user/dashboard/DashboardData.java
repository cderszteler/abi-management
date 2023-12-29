package derszteler.abimanagement.user.dashboard;

import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import java.time.LocalDate;

public record DashboardData(
  @Schema(
    description = "The earliest date at which one of the user's quotes' or comments' review expires",
    example = "2024-01-13",
    nullable = true
  )
  @Nullable
  LocalDate expiringAt,
  @Schema(description = "The executing user")
  User user
) {}
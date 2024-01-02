package derszteler.abimanagement.user.dashboard;

import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@Tag(
  name = "Dashboard Data",
  description = "Endpoints to retrieve dashboard data"
)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/user/dashboard")
@RestController
public final class DashboardRestEndpoint {
  private final DashboardService service;

  @Operation(
    summary = "Retrieve dashboard data",
    description = """
      This endpoint is used to retrieve general dashboard data about the executing
      user.
      """,
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = DashboardData.class)),
        description = "The requested dashboard data",
        responseCode = "200"
      )
    }
  )
  @GetMapping(produces = "application/json")
  public ResponseEntity<DashboardData> retrieveDashboardData(
    @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(service.createDashboardData(user));
  }

  @Operation(
    summary = "List display users",
    description = """
      This endpoint is used to retrieve an overview of all existing users. It
      is primarily used in the admin dashboard.
      """,
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = DashboardData.class)),
        description = "The user is missing the required role " +
          "(`Admin`, `Moderator`) to access this endpoint.",
        responseCode = "403"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = DashboardData.class)),
        description = "The requested display users",
        responseCode = "200"
      )
    }
  )
  @GetMapping(value = "/admin/users", produces = "application/json")
  public ResponseEntity<Collection<DisplayUser>> listDisplayUsers() {
    return ResponseEntity.ok(service.listDisplayUsers());
  }
}
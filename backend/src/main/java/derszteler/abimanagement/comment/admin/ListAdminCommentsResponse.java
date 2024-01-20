package derszteler.abimanagement.comment.admin;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Collection;

record ListAdminCommentsResponse(
  @Schema(description = "The requested comments")
  Collection<AdminComment> quotes,
  @Schema(description = "The total amount of quotes for this filter", example = "1")
  int total
) {}
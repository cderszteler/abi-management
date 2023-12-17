package derszteler.abimanagement.comment;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Collection;

public record ListCommentsResponse(
  @Schema(description = "The requested comments")
  Collection<Comment> comments,
  @Schema(description = "The total amount of comments for this filter", example = "1")
  int total
) {}
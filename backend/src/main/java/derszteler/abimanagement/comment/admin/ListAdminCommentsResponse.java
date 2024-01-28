package derszteler.abimanagement.comment.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import java.util.Collection;

record ListAdminCommentsResponse(
  @Schema(description = "The requested comments")
  Collection<AdminComment> comments,
  @Schema(
    description = "All accepted (or expired) comments joined by ' | '. " +
      "This field is only present if the request is filtered for a single user.",
    nullable = true,
    example = "I love you | Something else"
  )
  @Nullable
  String joinedComment,
  @Schema(description = "The total amount of comments for this filter", example = "1")
  int total
) {}
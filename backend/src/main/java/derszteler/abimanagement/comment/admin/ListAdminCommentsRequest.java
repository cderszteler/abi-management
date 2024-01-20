package derszteler.abimanagement.comment.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import static derszteler.abimanagement.comment.admin.ListAdminCommentsRequest.OrderBy.CreatedAt;

record ListAdminCommentsRequest(
  @Nullable Integer userId,
  OrderBy orderBy,
  int page,
  int limit
) {
  boolean hasUserFilter() {
    return userId != null;
  }

  public OrderBy orderBy() {
    if (hasUserFilter()) {
      return CreatedAt;
    }
    return orderBy;
  }

  @Schema(
    description = "Specify "
  )
  enum OrderBy {
    @Schema(description = "Order by the creation timestamp of the comment")
    CreatedAt,
    @Schema(description = "Order by the `lastName` of the comment's user")
    Username
  }
}
package derszteler.abimanagement.quote.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import static derszteler.abimanagement.quote.admin.ListAdminQuotesRequest.OrderBy.CreatedAt;

record ListAdminQuotesRequest(
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
    @Schema(description = "Order by the creation timestamp of the quote")
    CreatedAt,
    @Schema(description = "Order by the `lastName` of the quote's user")
    Username
  }
}
package derszteler.abimanagement.quote.admin;

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

  enum OrderBy {
    CreatedAt,
    Username
  }
}
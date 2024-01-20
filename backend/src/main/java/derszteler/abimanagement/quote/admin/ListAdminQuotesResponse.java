package derszteler.abimanagement.quote.admin;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Collection;

record ListAdminQuotesResponse(
  @Schema(description = "The requested quotes")
  Collection<AdminQuote> quotes,
  @Schema(description = "The total amount of quotes for this filter", example = "1")
  int total
) {}
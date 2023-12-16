package derszteler.abimanagement.quote;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Collection;

public record ListQuotesResponse(
  @Schema(description = "The requested quotes")
  Collection<UserQuote> quotes,
  @Schema(description = "The total amount of quotes for this filter", example = "1")
  int total
) {}
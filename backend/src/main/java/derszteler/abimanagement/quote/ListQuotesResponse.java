package derszteler.abimanagement.quote;

import java.util.Collection;

public record ListQuotesResponse(
  Collection<UserQuote> quotes,
  int total
) {}
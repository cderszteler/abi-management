package derszteler.abimanagement.quote;

public record ListQuotesRequest(
  Filter filter,
  int page,
  int limit
) {
  boolean valid() {
    return page >= 0 && limit > 0 && limit <= 50;
  }

  enum Filter {
    Pending,
    Processed,
    NotAllowed
  }
}
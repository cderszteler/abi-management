package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.quote.review.QuoteReview.Status;

import static derszteler.abimanagement.quote.review.QuoteReview.Status.Pending;

public record ReviewQuotesRequest(
  int quoteId,
  Status status
) {
  boolean valid() {
    return quoteId > 0 && status != Pending;
  }
}
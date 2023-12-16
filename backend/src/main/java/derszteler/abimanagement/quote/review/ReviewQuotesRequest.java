package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.quote.review.QuoteReview.Status;
import io.swagger.v3.oas.annotations.media.Schema;

import static derszteler.abimanagement.quote.review.QuoteReview.Status.Pending;

public record ReviewQuotesRequest(
  @Schema(description = "The id of the quote to be reviewed", example = "1")
  int quoteId,
  @Schema(
    description = """
      The status (review) the quote should get. Note,
      only 'Accepted' and 'Rejected' are valid values for this field.
      """,
    example = "Accepted"
  )
  Status status
) {
  boolean valid() {
    return quoteId > 0 && status != Pending;
  }
}
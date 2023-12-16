package derszteler.abimanagement.quote;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import derszteler.abimanagement.quote.review.QuoteReview;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import static derszteler.abimanagement.quote.UserQuote.Status.*;

public record UserQuote(
  @JsonIgnore
  @Schema(hidden = true)
  Quote quote,
  @Nullable
  @JsonIgnore
  @Schema(hidden = true)
  QuoteReview review
) {
  @Schema(description = "The id of the quote", example = "1")
  @JsonProperty
  int id() {
    return quote.id();
  }

  @Schema(description = "The content of the quote", example = "I am a cyborg.")
  @JsonProperty
  String content() {
    return quote().content();
  }

  @Schema(
    description = """
      The (user-specific) status of a quote. Possible values:
        - 'NotAllowed' if the status of the quote is 'NotAllowed'
        - 'Pending' if no review from the user exists for this quote
        - 'Accepted' if the user accepted this quote
        - 'Rejected' if the user rejected this quote
    """,
    example = "Pending")
  @JsonProperty
  Status status() {
    if (quote.status() == Quote.Status.NotAllowed) {
      return NotAllowed;
    }
    if (review == null) {
      return Pending;
    }
    return switch (review.status()) {
      case Accepted -> Accepted;
      case Pending -> Pending;
      case Rejected -> Rejected;
    };
  }

  enum Status {
    Accepted,
    Pending,
    Rejected,
    NotAllowed
  }
}
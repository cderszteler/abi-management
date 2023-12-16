package derszteler.abimanagement.quote;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import derszteler.abimanagement.quote.review.QuoteReview;
import jakarta.annotation.Nullable;

import static derszteler.abimanagement.quote.UserQuote.Status.*;

public record UserQuote(
  @JsonIgnore
  Quote quote,
  @Nullable
  @JsonIgnore
  QuoteReview review
) {
  @JsonProperty
  int id() {
    return quote.id();
  }

  @JsonProperty
  String content() {
    return quote().content();
  }

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
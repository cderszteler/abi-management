package derszteler.abimanagement.quote.admin;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.quote.UserQuote;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Collection;

record AdminQuote(
  @Schema(description = "The id of the quote", example = "1")
  int id,
  @Schema(description = "The content of the quote", example = "I am a cyborg.")
  String content,
  @Schema(
    description = "The context of the quote",
    example = "said while running",
    nullable = true
  )
  String context,
  @JsonIgnore
  Quote.Status status,
  @Schema(description = "All reviews of this quote")
  Collection<Review> reviews
) {
  @Schema(
    description = "The cumulated status of the quote. " +
      "Taking the quote's status and its reviews' status into consideration.",
    example = "PartiallyAccepted",
    nullable = true
  )
  @JsonProperty
  CumulatedStatus reviewStatus() {
    if (status == Quote.Status.NotAllowed) {
      return CumulatedStatus.NotAllowed;
    }
    if (reviews.isEmpty()) {
      return CumulatedStatus.Pending;
    }
    boolean accepted = false;
    boolean rejected = false;
    boolean pending = false;
    for (var review : reviews) {
      switch (review.status) {
        case Accepted, Expired -> accepted = true;
        case Rejected -> rejected = true;
        case Pending -> pending = true;
      }
    }
    if (rejected) {
      return pending || accepted
        ? CumulatedStatus.PartiallyRejected
        : CumulatedStatus.Rejected;
    } else if (accepted) {
     return pending
       ? CumulatedStatus.PartiallyAccepted
       : CumulatedStatus.Accepted;
    }
    return CumulatedStatus.Pending;
  }

  @Override
  public boolean equals(Object object) {
    if (object == this) {
      return true;
    }
    if (!(object instanceof AdminQuote)) {
      return false;
    }
    var quote = (AdminQuote) object;
    return id == quote.id;
  }

  record Review(
    @Schema(
      description = "The display name of the review's user",
      example = "Christoph Derszteler"
    )
    String displayName,
    @Schema(
      description = "The user-specific status of the review",
      example = "Pending"
    )
    UserQuote.Status status
  ) {}

  enum CumulatedStatus {
    @Schema(
      description = "The quote is not allowed (quote's status)."
    )
    NotAllowed,
    @Schema(
      description = "There exists no review for this quote or all have the `Pending` state."
    )
    Pending,
    @Schema(
      description = "All reviews for this quote have the `Accepted` state."
    )
    Accepted,
    @Schema(
      description = "There exists no reviews with the `Rejected` state and " +
        "there is at least one quote with the `Accepted` state."
    )
    PartiallyAccepted,
    @Schema(
      description = "All reviews for this quote have the `Rejected` state."
    )
    Rejected,
    @Schema(
      description = "There is at least one review with the `Rejected` state and " +
        "one review with a different state."
    )
    PartiallyRejected
  }
}
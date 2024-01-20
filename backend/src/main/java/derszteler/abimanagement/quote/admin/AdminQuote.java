package derszteler.abimanagement.quote.admin;

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
  @Schema(
    description = "The status **of the quote**. " +
      "This is not the status of a review of this quote.",
    example = "NotAllowed",
    nullable = true
  )
  Quote.Status status,
  @Schema(description = "All reviews of this quote")
  Collection<Review> reviews
) {
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
}
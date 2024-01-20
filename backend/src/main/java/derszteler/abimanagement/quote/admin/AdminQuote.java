package derszteler.abimanagement.quote.admin;

import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.quote.UserQuote;

import java.util.Collection;

// TODO: Add documentation
record AdminQuote(
  int id,
  String content,
  String context,
  Quote.Status status,
  Collection<Review> reviews
) {
  // TODO: Add documentation
  record Review(String displayName, UserQuote.Status status) {}

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
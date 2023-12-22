package derszteler.abimanagement.comment;

import derszteler.abimanagement.comment.Comment.Status;
import io.swagger.v3.oas.annotations.media.Schema;

import static derszteler.abimanagement.comment.Comment.Status.Pending;

public record ReviewCommentRequest(
  @Schema(
    description = """
      The status (review) the comment should get. Note,
      only 'Accepted' and 'Rejected' are valid values for this field.
      """,
    example = "Accepted"
  )
  Status status
) {
  boolean valid() {
    return status != Pending;
  }
}
package derszteler.abimanagement.comment;

import derszteler.abimanagement.comment.Comment.Status;
import io.swagger.v3.oas.annotations.media.Schema;

import static derszteler.abimanagement.comment.Comment.Status.Pending;

public record ReviewCommentRequest(
  @Schema(description = "The id of the comment to be reviewed", example = "1")
  int commentId,
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
    return commentId > 0 && status != Pending;
  }
}
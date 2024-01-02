package derszteler.abimanagement.comment;

import derszteler.abimanagement.ErrorSchema;
import derszteler.abimanagement.comment.CommentService.Filter;
import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Tag(
  name = "Comments",
  description = "Endpoints in relation to (users') comments."
)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1")
@RestController
public final class CommentRestEndpoint {
  private final CommentService service;

  @Operation(
    summary = "List comments",
    description = """
      This endpoint is used to list user's comments filtered. There exists
      two discrete filters (see below).

      This endpoint is paginated, therefore a `total` value is given as well.
      """,
    parameters = {
      @Parameter(
        description = "The filter applied to the search.",
        example = "Pending",
        required = true,
        name = "filter"
      ),
      @Parameter(
        description = "The page for the paginated request. Must be >= 0.",
        required = true,
        example = "0",
        name = "page"
      ),
      @Parameter(
        description = "The limit for the paginated request. Must be true: 1 <= x <= 100.",
        required = true,
        example = "20",
        name = "filter"
      )
    },
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified parameter are invalid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ListCommentsResponse.class)),
        description = "The requested comments",
        responseCode = "200"
      )
    }
  )
  @GetMapping(value = "/comments", produces = "application/json")
  public ResponseEntity<ListCommentsResponse> list(
    @AuthenticationPrincipal User user,
    @RequestParam Filter filter,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int limit
  ) {
    if (page < 0 || limit < 1 || limit > 100) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "invalid pagination parameters"
      );
    }

    return ResponseEntity.ok(service.list(user, filter, page, limit));
  }

  @Operation(
    summary = "Review a comment",
    description = """
      This endpoint is used to review a user's comment. Reviews can be done on
      every kind of comment (in comparison to quotes).
      """,
    parameters = @Parameter(
      description = "The id of the comment to be reviewed.",
      example = "1",
      required = true,
      name = "id"
    ),
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = ReviewCommentRequest.class)),
      description = "The status (review) the user wants give a comment",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The request body is invalid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The comment was not found or the user does not have access to it.",
        responseCode = "404"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The comment's review has expired.",
        responseCode = "10"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema()),
        description = "The comment's status has been updated",
        responseCode = "200"
      )
    }
  )
  @PostMapping(value = "/comment/{id}/review", produces = "application/json")
  public ResponseEntity<Void> review(
    @AuthenticationPrincipal User user,
    @RequestBody ReviewCommentRequest request,
    @PathVariable int id
  ) {
    if (id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
    } else if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request body");
    }

    service.review(user, id, request);
    return ResponseEntity.ok().build();
  }

  @Operation(
    summary = "Create a comment",
    description = """
      This endpoint is used to create a comment. It requires the `Moderator`
      or `Admin` role.
      """,
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = CreateCommentRequest.class)),
      description = "The comment to be created",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The request body is invalid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified user could not be found.",
        responseCode = "404"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = Comment.class)),
        description = "The created comment",
        responseCode = "200"
      )
    }
  )
  @PostMapping(value = "/comment", produces = "application/json")
  public ResponseEntity<Comment> create(@RequestBody CreateCommentRequest request) {
    if (!request.valid()) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "invalid request body"
      );
    }

    return ResponseEntity.ok(service.create(request));
  }
}
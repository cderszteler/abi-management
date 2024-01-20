package derszteler.abimanagement.comment.admin;

import derszteler.abimanagement.ErrorSchema;
import derszteler.abimanagement.quote.ListQuotesResponse;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Tag(name = "Comments")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/admin")
@RestController
public final class AdminCommentRestEndpoint {
  private final AdminCommentService service;

  // TODO: Add tests

  @Operation(
    summary = "List admin comments",
    description = """
      This endpoint is used to list all comments. It can be filtered by a user
      and ordered in specific ways (see below).

      This endpoint is paginated, therefore a `total` value is given as well.

      **This endpoint is only accessible via the `Moderator` or `Admin` role.**
      """,
    parameters = {
      @Parameter(
        description = "The id of user which comments should be returned.",
        required = false,
        example = "1",
        name = "userId"
      ),
      @Parameter(
        description = "The enum specifying the order of the comments returned.",
        required = false,
        example = "CreatedAt",
        name = "orderBy"
      ),
      @Parameter(
        description = "The page for the paginated request. Must be >= 0.",
        required = false,
        example = "0",
        name = "page"
      ),
      @Parameter(
        description = "The limit for the paginated request. Must be true: 1 <= x <= 50.",
        required = false,
        example = "20",
        name = "limit"
      )
    },
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified page parameters are invalid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ListQuotesResponse.class)),
        description = "The requested comments",
        responseCode = "200"
      )
    }
  )
  @GetMapping(value = "/comments", produces = "application/json")
  ResponseEntity<ListAdminCommentsResponse> listAdminComments(
    @RequestParam(required = false) Integer userId,
    @RequestParam(defaultValue = "CreatedAt") ListAdminCommentsRequest.OrderBy orderBy,
    @RequestParam(defaultValue = "0") Integer page,
    @RequestParam(defaultValue = "20") Integer limit
  ) {
    if (page < 0 || limit < 1 || limit > 50) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "invalid pagination parameters"
      );
    }

    return ResponseEntity.ok(service.listQuotes(
      new ListAdminCommentsRequest(userId, orderBy, page, limit)
    ));
  }
}
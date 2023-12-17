package derszteler.abimanagement.quote;

import derszteler.abimanagement.ErrorSchema;
import derszteler.abimanagement.quote.QuoteService.Filter;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Tag(
  name = "Quotes",
  description = "Endpoints in relation to (users') quotes."
)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1")
@RestController
public final class QuoteRestEndpoint {
  private final QuoteService service;

  @Operation(
    summary = "List quotes",
    description = """
      This endpoint is used to list user's quotes filtered. There exists
      three discrete filters (see below).

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
        content = @Content(schema = @Schema(implementation = ListQuotesResponse.class)),
        description = "The requested quotes",
        responseCode = "200"
      )
    }
  )
  @GetMapping(value = "/quotes", produces = "application/json")
  public ResponseEntity<ListQuotesResponse> list(
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
}
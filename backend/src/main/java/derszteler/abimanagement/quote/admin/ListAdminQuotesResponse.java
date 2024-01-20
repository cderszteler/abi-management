package derszteler.abimanagement.quote.admin;

import java.util.Collection;

record ListAdminQuotesResponse(Collection<AdminQuote> quotes, int total) {}
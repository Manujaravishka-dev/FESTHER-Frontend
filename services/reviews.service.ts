import type { ApiResult, GuestReview } from "@/lib/types";
import { getComments } from "@/services/admin/comments.service";
import { apiRequest, apiItems, delay, isBackendConfigured } from "./config";

import type { ReviewComment } from "./admin/comments.service";

function toGuestReview(c: ReviewComment): GuestReview {
  const status: GuestReview["status"] =
    c.status === "approved" ? "APPROVED" : c.status === "pending" ? "PENDING" : "REJECTED";
  return {
    id: c.id,
    name: c.name,
    rating: c.rating,
    comment: c.comment,
    status,
    active: c.active,
    createdAt: c.date,
  };
}

export async function getApprovedReviews(): Promise<GuestReview[]> {
  if (!isBackendConfigured()) {
    await delay(350);
    const all = await getComments();
    return all
      .filter(
        (c) =>
          c.status === "approved" &&
          c.active !== false &&
          c.name.trim().length > 0 &&
          c.comment.trim().length > 0 &&
          c.rating >= 1 &&
          c.rating <= 5
      )
      .map(toGuestReview);
  }
  const result = await apiRequest<ApiResult<{ items: GuestReview[] }>>("/api/reviews?status=APPROVED&active=true");
  return apiItems(result).filter((r) => r != null && r.status === "APPROVED" && r.active !== false &&
    typeof r.name === "string" && typeof r.comment === "string" &&
    Number.isFinite(r.rating) && r.rating >= 1 && r.rating <= 5);
}

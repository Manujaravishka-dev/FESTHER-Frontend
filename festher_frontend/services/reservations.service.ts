import type { ApiResult, RestaurantReservationRequest } from "@/lib/types";
import { apiRequest, delay, isBackendConfigured } from "./config";

export interface ReservationResult {
  reservationId?: string;
}

export async function createReservation(
  request: RestaurantReservationRequest,
): Promise<ApiResult<ReservationResult>> {
  if (!isBackendConfigured()) {
    await delay(700);
    return {
      success: true,
      message: "Your table request has been received. Our team will confirm by email.",
    };
  }
  return apiRequest<ApiResult<ReservationResult>>("/api/restaurant/reservations", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
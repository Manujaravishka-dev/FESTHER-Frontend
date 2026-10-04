import type { ApiResult, BookingRequest, BookingStatus } from "@/lib/types";
import { apiRequest, delay, isBackendConfigured } from "./config";

export interface BookingResult {
  bookingId?: string;
  status?: BookingStatus;
}

export async function createBooking(request: BookingRequest): Promise<ApiResult<BookingResult>> {
  if (!isBackendConfigured()) {
    await delay(700);
    return {
      success: true,
      message: "Your stay request has been received. Our team will confirm availability by email.",
    };
  }
  return apiRequest<ApiResult<BookingResult>>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
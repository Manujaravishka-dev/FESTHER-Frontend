"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useAdminData } from "./components/useAdminData";
import { getComments } from "@/services/admin/comments.service";
import { getGalleryImages } from "@/services/admin/gallery.service";
import { getOffers } from "@/services/admin/offers.service";
import { getRestaurantOrders } from "@/services/admin/orders.service";
import { AdminStars } from "./components/AdminStars";

function MetricSkeleton() {
  return (
    <div className="adm-card adm-metric">
      <span className="adm-skeleton adm-line adm-line--xs" />
      <span className="adm-skeleton adm-line adm-line--sm" />
      <span className="adm-skeleton adm-line adm-line--xs" />
    </div>
  );
}

const typeLabels: Record<string, string> = {
  ACCOMMODATION: "Accommodation",
  DINING: "Dining",
  PACKAGES: "Packages",
  SEASONAL: "Seasonal",
};

export default function AdminDashboard() {
  const gallery = useAdminData(useCallback(() => getGalleryImages(), []));
  const comments = useAdminData(useCallback(() => getComments(), []));
  const offers = useAdminData(useCallback(() => getOffers(), []));
  const restaurantOrders = useAdminData(useCallback(() => getRestaurantOrders(), []));

  const loading =
    gallery.status === "loading" ||
    offers.status === "loading" ||
    restaurantOrders.status === "loading";
  const failed =
    gallery.status === "error" ||
    comments.status === "error" ||
    offers.status === "error" ||
    restaurantOrders.status === "error";

  const activeOffers = offers.data?.filter((o) => o.status === "active").length ?? 0;
  const inactiveOffers = (offers.data?.length ?? 0) - activeOffers;
  const pendingOrders =
    restaurantOrders.data?.filter((o) => o.orderStatus === "PENDING").length ?? 0;

  const recentComments =
    comments.data
      ?.filter((c) => c.status !== "hidden")
      .slice(0, 5) ?? [];

  const typeBreakdown = (["ACCOMMODATION", "DINING", "PACKAGES", "SEASONAL"] as const)
    .map((type) => ({
      type,
      count: offers.data?.filter((o) => o.type === type).length ?? 0,
    }))
    .filter((row) => row.count > 0);
  const maxBreak = Math.max(1, ...typeBreakdown.map((row) => row.count));

  return (
    <div className="adm-dash">
      <div className="adm-page-head">
        <div>
          <p className="adm-page-kicker">Administration</p>
          <h1>Dashboard</h1>
          <p>
            A quick view of the FESTHER estate — gallery, guest comments and current offers.
          </p>
        </div>
      </div>

      {failed ? (
        <div className="adm-card" style={{ padding: 26 }}>
          <div className="adm-error-banner">
            <span>Something went wrong while loading the dashboard.</span>
            <span>
              <button
                type="button"
                className="adm-btn adm-btn--sm adm-btn--ghost"
                onClick={() => {
                  gallery.reload();
                  comments.reload();
                  offers.reload();
                  restaurantOrders.reload();
                }}
              >
                Retry
              </button>
            </span>
          </div>
        </div>
      ) : (
        <>
          <section className="adm-metrics" aria-label="Summary">
            {loading ? (
              <>
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
              </>
            ) : (
              <>
                <div className="adm-card adm-metric">
                  <span className="adm-metric-label">Total Gallery Images</span>
                  <strong className="adm-metric-value">{gallery.data?.length ?? 0}</strong>
                  <span className="adm-metric-note">
                    Across{" "}
                    <b>{new Set(gallery.data?.map((i) => i.category)).size ?? 0}</b>{" "}
                    categories
                  </span>
                </div>
                <div className="adm-card adm-metric">
                  <span className="adm-metric-label">Total Comments</span>
                  <strong className="adm-metric-value">{comments.data?.length ?? 0}</strong>
                  <span className="adm-metric-note">
                    <b>
                      {comments.data?.filter((c) => c.status === "approved").length ?? 0}
                    </b>{" "}
                    approved
                  </span>
                </div>
                <div className="adm-card adm-metric">
                  <span className="adm-metric-label">Active Offers</span>
                  <strong className="adm-metric-value">{activeOffers}</strong>
                  <span className="adm-metric-note">
                    Live to guests on the offers page
                  </span>
                </div>
                <div className="adm-card adm-metric">
                  <span className="adm-metric-label">Inactive Offers</span>
                  <strong className="adm-metric-value">{inactiveOffers}</strong>
                  <span className="adm-metric-note">
                    Hidden until activated
                  </span>
                </div>
                <div className="adm-card adm-metric">
                  <span className="adm-metric-label">Restaurant Orders</span>
                  <strong className="adm-metric-value">{restaurantOrders.data?.length ?? 0}</strong>
                  <span className="adm-metric-note">
                    <b>{pendingOrders}</b> awaiting action
                  </span>
                </div>
              </>
            )}
          </section>

          <section className="adm-dash-grid">
            <div className="adm-card adm-panel">
              <h2 className="adm-panel-title">Recent comments</h2>
              <p className="adm-panel-sub">Latest guest feedback awaiting attention.</p>
              <div className="adm-recent" style={{ marginTop: 18 }}>
                {recentComments.length === 0 ? (
                  <p className="adm-empty-hint">No comments yet.</p>
                ) : (
                  recentComments.map((c) => (
                    <div className="adm-recent-item" key={c.id}>
                      <div className="adm-recent-main">
                        <div className="adm-recent-name">{c.name}</div>
                        <p className="adm-recent-text">{c.comment}</p>
                        <div style={{ marginTop: 8 }}>
                          <AdminStars value={c.rating} />
                        </div>
                      </div>
                      <span className="adm-recent-date">
                        {c.date.replaceAll("-", ".")}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="adm-row-actions" style={{ marginTop: 18 }}>
                <Link className="adm-btn--link" href="/admin/comments">
                  Manage comments →
                </Link>
              </div>
            </div>

            <div className="adm-card adm-panel">
              <h2 className="adm-panel-title">Offers by type</h2>
              <p className="adm-panel-sub">Distribution of the current offer library.</p>
              <div style={{ marginTop: 10 }}>
                {typeBreakdown.length === 0 ? (
                  <p className="adm-empty-hint">No offers configured yet.</p>
                ) : (
                  typeBreakdown.map((row) => (
                    <div className="adm-break-item" key={row.type}>
                      <div style={{ flex: 1 }}>
                        <div className="adm-break-row">
                          <span className="adm-break-label">{typeLabels[row.type]}</span>
                          <span className="adm-break-count">
                            {row.count} offer{row.count === 1 ? "" : "s"}
                          </span>
                        </div>
                        <span className="adm-break-bar">
                          <i style={{ width: `${(row.count / maxBreak) * 100}%` }} />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="adm-row-actions" style={{ marginTop: 18 }}>
                <Link className="adm-btn--link" href="/admin/offers">
                  Manage offers →
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
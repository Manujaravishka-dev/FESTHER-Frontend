import type { Metadata } from "next";
import ServiceDetailPage from "../components/ServiceDetailPage";
import { services } from "@/lib/data/services";

const service = services["festival"];
export const metadata: Metadata = { title: `${service.title} | FESTHR`, description: service.introduction[0] };

export default function Page() {
  return <ServiceDetailPage service={service} />;
}

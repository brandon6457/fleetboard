import { FleetAdmin } from "@/features/fleet-dashboard/components/FleetAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fleet Admin | Down to Earth Fleet Management",
};

export default function AdminPage() {
  return <FleetAdmin />;
}

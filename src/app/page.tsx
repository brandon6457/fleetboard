import { FleetDashboard } from "@/features/fleet-dashboard/components/FleetDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fleet Dashboard | Down to Earth Fleet Management",
};

export default function Home() {
  return <FleetDashboard />;
}

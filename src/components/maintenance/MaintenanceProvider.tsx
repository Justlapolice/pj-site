"use client";

import dynamic from "next/dynamic";

const MaintenanceBanner = dynamic(
  () => import("../../components/maintenance/MaintenanceBanner"),
  { ssr: false }
);

export default function MaintenanceProvider() {
  return <MaintenanceBanner />;
}

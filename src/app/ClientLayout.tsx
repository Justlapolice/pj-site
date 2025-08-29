"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "../components/ui/toaster";
import SessionWrapper from "./lib/SessionWrapper";

const MaintenanceProvider = dynamic(
  () => import("../components/maintenance/MaintenanceProvider"),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    import("../components/ui/toaster");
  }, []);

  return (
    <>
      <SessionWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
        </div>
        <Toaster />
        <MaintenanceProvider />
      </SessionWrapper>
    </>
  );
}

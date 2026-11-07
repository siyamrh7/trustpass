"use client";

import { Suspense } from "react";
import { ProviderView } from "./view";

export default function Page() {
  return (
    <Suspense>
      <ProviderView />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { BookingView } from "./view";

export default function Page() {
  return (
    <Suspense>
      <BookingView />
    </Suspense>
  );
}

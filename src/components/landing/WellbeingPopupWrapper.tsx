"use client";

import { useState } from "react";
import WellbeingPopup from "./WellbeingPopup";

export default function WellbeingPopupWrapper() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return <WellbeingPopup onClose={() => setIsOpen(false)} />;
}

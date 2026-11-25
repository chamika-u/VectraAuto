"use client";

import React from "react";

export function SmartContactLink({
  className = "",
  children,
  email = "support@vectraauto.lk",
  phone = "0757260688",
}: {
  className?: string;
  children: React.ReactNode;
  email?: string;
  phone?: string;
}) {
  function handleClick(e: React.MouseEvent) {
    // Check if device is mobile or tablet
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ));

    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      window.location.href = `mailto:${email}?subject=Inquiry%20from%20VectraAuto%20Storefront`;
    }
    e.preventDefault();
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={className}
      title="Contact VectraAuto (Call on mobile, Email on PC)"
    >
      {children}
    </a>
  );
}

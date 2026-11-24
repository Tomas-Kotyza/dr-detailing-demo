"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  size?: number;
  alt?: string;
  className?: string;
};

export function QrCodeImage({
  value,
  size = 180,
  alt = "QR kód",
  className,
}: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!value.trim()) {
      setSrc("");
      return;
    }
    void QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#12161c", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!src) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          background: "#f3f4f6",
          borderRadius: 4,
        }}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}

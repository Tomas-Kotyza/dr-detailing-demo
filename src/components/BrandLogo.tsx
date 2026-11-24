import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  iconOnly?: boolean;
  onLight?: boolean;
  priority?: boolean;
};

const FULL = { src: "/brand/logo.png", w: 406, h: 483 };
const STAMP = { src: "/brand/logo-razitko.png", w: 406, h: 348 };

/**
 * Schválené logo A2-3b (serifové razítko) — přesný výřez, bez podkladu.
 */
export function BrandLogo({
  className = "",
  iconOnly = false,
  onLight = true,
  priority = false,
}: BrandLogoProps) {
  const asset = iconOnly ? STAMP : FULL;
  return (
    <Image
      src={asset.src}
      alt="Dr Detailing"
      width={asset.w}
      height={asset.h}
      className={className || "h-16 w-auto"}
      sizes="(max-width: 768px) 96px, 128px"
      style={
        onLight
          ? undefined
          : { filter: "brightness(0) invert(1)", opacity: 0.96 }
      }
      priority={priority}
      quality={75}
    />
  );
}

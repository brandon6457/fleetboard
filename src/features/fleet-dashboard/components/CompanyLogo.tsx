import Image from "next/image";

export function CompanyLogo() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center overflow-visible"
      aria-label="Down to Earth Landscape & Irrigation"
    >
      <Image
        alt="Down to Earth logo"
        className="h-auto max-h-[clamp(4.2rem,9.4dvh,6.7rem)] w-auto max-w-[clamp(12.5rem,21dvw,25rem)] object-contain"
        height={142}
        priority
        src="/down-to-earth-logo-main.png"
        unoptimized
        width={402}
      />
      <p className="-mt-1 whitespace-nowrap text-center font-serif text-[clamp(0.62rem,0.82dvw,0.95rem)] font-black uppercase tracking-[0.14em] text-[#158f44]">
        Landscape &amp; Irrigation
      </p>
    </div>
  );
}

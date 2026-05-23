import Image from "next/image";

export function CompanyLogo() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center overflow-visible"
      aria-label="Down to Earth Landscape & Irrigation"
    >
      <Image
        alt="Down to Earth logo"
        className="h-auto w-[clamp(17.5rem,28vw,31rem)] object-contain"
        height={142}
        priority
        src="/down-to-earth-logo-main.png"
        unoptimized
        width={402}
      />
      <p className="-mt-1 whitespace-nowrap text-center font-serif text-[clamp(1rem,1.45vw,1.65rem)] font-black uppercase tracking-[0.14em] text-[#158f44]">
        Landscape &amp; Irrigation
      </p>
    </div>
  );
}

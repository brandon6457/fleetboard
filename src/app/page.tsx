import { CompanyLogo } from "@/features/fleet-dashboard/components/CompanyLogo";
import { FleetSection } from "@/features/fleet-dashboard/components/FleetSection";
import { fleetSectionItems } from "@/features/fleet-dashboard/data/sections";

export default function Home() {
  return (
    <main className="flex h-screen min-h-[680px] flex-col overflow-hidden border-[4px] border-zinc-300 bg-white p-2 text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]">
      <header className="grid h-[19vh] min-h-[156px] max-h-[212px] shrink-0 grid-cols-[minmax(22rem,30vw)_1fr_minmax(22rem,30vw)] items-center">
        <CompanyLogo />
        <h1 className="whitespace-nowrap text-center text-[clamp(2.55rem,3.55vw,5.2rem)] font-black uppercase leading-none text-black">
          FLEET MANAGEMENT
        </h1>
        <div aria-hidden="true" />
      </header>

      <div className="mt-1 grid min-h-0 flex-1 grid-cols-[1.05fr_1.52fr_1.12fr_2.42fr] gap-[3px] bg-black p-[3px]">
        <FleetSection title="SRQ/RKL" items={fleetSectionItems.srqRkl} />

        <div className="grid min-h-0 grid-rows-[72fr_28fr] gap-[3px] bg-black">
          <FleetSection title="TAMPA" items={fleetSectionItems.tampa} />
          <FleetSection
            title="SRQ/BACKUP"
            items={fleetSectionItems.srqBackup}
          />
        </div>

        <div className="grid min-h-0 grid-rows-[1fr_2fr] gap-[3px] bg-black">
          <FleetSection title="SW CON" items={fleetSectionItems.swCon} />
          <FleetSection title="WEST CON" items={fleetSectionItems.westCon} />
        </div>

        <FleetSection
          className="relative"
          title="SW MAIN"
          items={fleetSectionItems.swMain}
        >
          <FleetSection
            className="absolute bottom-0 right-0 h-[28%] min-h-44 w-[53%] border-l-[3px] border-t-[3px] border-black"
            title="SHOP"
            items={fleetSectionItems.shop}
          />
        </FleetSection>
      </div>
    </main>
  );
}

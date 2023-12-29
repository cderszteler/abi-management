import {Metadata} from "next"
import {GridPattern} from "@/components/GridPattern";
import {DashboardHero} from "@/app/dashboard/DashboardHero";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Willkommen im Dashboard!',
}

export default async function Dashboard() {
  return (
    <>
      <GridPattern
        className="absolute inset-x-0 -top-2 -z-10 h-screen w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_60%,transparent_80%)]"
        yOffset={-96}
        interactive
      />
        <DashboardHero/>
    </>
  )
}
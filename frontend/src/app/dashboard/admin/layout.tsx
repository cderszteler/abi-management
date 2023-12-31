import {Metadata} from "next";
import SecureAdminDashboardContainer
  from "@/app/dashboard/admin/AdminDashboardContainer";

export const metadata: Metadata = {
  title: {
    template: '[Admin] %s - ABI.',
    default: 'Admin Dashboard',
  },
  description: 'Administriere hier die Abizeitung!'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SecureAdminDashboardContainer>
      {children}
    </SecureAdminDashboardContainer>
  )
}
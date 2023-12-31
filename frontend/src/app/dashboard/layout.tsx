import './dashboard.css'
import React from 'react'
import DashboardContextProvider from "@/app/dashboard/DashboardContextProvider";
import {Metadata} from 'next';
import DashboardContainer from './DashboardContainer';
import DashboardNavigation from './DashboardNavigation';

export const metadata: Metadata = {
  title: {
    template: '%s - ABI.',
    default: 'Dashboard - ABI.',
  },
  description: 'Verwalte hier deine Abizeitung!'
}

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <>
      <DashboardContextProvider>
        <DashboardNavigation/>
        <DashboardContainer>
          {children}
        </DashboardContainer>
      </DashboardContextProvider>
    </>
  )
}
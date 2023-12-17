'use client'

import {PageHeading} from "@/components/PageIntro";
import {Color, PillWithBorder} from "@/components/Badge";
import {SectionHeader} from "@/components/SectionIntro";
import {TableWithBorder} from "@/components/Table";
import {BooleanActionButtonGroup} from "@/components/Button";
import {Tooltip} from "@/components/Tooltip";
import Pagination from "@/components/Pagination";
import {useContext, useEffect, useState} from "react";
import {fetcher} from "@/lib/backend";
import useSWR from 'swr'
import {Quote} from "@/lib/quotes";
import {RootLayoutContext} from "@/components/RootLayout";
import ErrorToast from "@/components/Toast";

const statusDescriptions: { [key:string]: { color: Color, name: string, description: string } } = {
  'Accepted': {
    color: "green",
    name: "Angenommen",
    description: "Du hast dieses Zitat angenommen"
  },
  'Pending': {
    color: "yellow",
    name: "Ausstehend",
    description: "Dieses Zitat hast du noch nicht bearbeitet"
  },
  'Denied': {
    color: "red",
    name: "Abgelehnt",
    description: "Du hast dieses Zitat abgelehnt"
  },
  'NotAllowed': {
    color: "red",
    name: "Nicht erlaubt",
    description: "Dieses Zitat wurde von uns abgelehnt"
  }
}

function createStatus(status: string) {
  const description = statusDescriptions[status]
  return (
    <Tooltip content={description.description}>
      <PillWithBorder color={description.color}>
        {description.name}
      </PillWithBorder>
    </Tooltip>
  )
}

export default function Quotes() {
  const {addToast} = useContext(RootLayoutContext)!
  const [page, setPage] = useState(1)
  const {data, error, isLoading} = useSWR<{quotes: Quote[], total: number}>(
    `/api/v1/quotes?filter=Pending&page=${page - 1}&limit=20`,
    fetcher
  )

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast
        content="Die Zitate konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        retry={false}
      />)
    }
  }, [addToast, error]);

  return (
    <>
      <PageHeading content="Zitate" className="lg:mb-8">
        <p>Verwalte hier deine Zitate!</p>
      </PageHeading>
      <SectionHeader title="Ausstehende Zitate" smaller={true} className="mt-4">
        <p className="text-base -mt-4">
          Beachte, dass für ein Zitat, das mehre Personen beinhaltet,
          alle Personen diesem Zitat zustimmen müssen,
          damit dieses gedruckt werden kann.
        </p>
      </SectionHeader>
      <TableWithBorder
        loading={isLoading || error}
        separator={true}
        headers={[{name: "Zitat"}, {name: "Status"}, {screenReader: "Aktionen"}]}
        rows={isLoading ? [] : data!.quotes.map((quote) => [
          {
            text: quote.content
          },
          {
            children: createStatus(quote.status)
          },
          {
            children: (
              <BooleanActionButtonGroup disabled={quote.status === 'NotAllowed'}/>
            ),
            className: "lg:whitespace-nowrap"
          }
        ])}
        loadingRow={[
          {
            children: (
              <>
                <div className="animate-pulse w-40 lg:w-72 xl:w-10/12 h-2 bg-neutral-300 rounded-md"/>
                <div className="animate-pulse mt-2 w-12 lg:w-32 h-2 bg-neutral-300 rounded-md"/>
              </>
            )
          },
          {
            children: <div className="animate-pulse w-16 h-2 bg-neutral-300 rounded-md"/>
          },
          {
            children: <BooleanActionButtonGroup disabled={true}/>
          }
        ]}
      />
      <Pagination
        page={page}
        setPage={setPage}
        total={isLoading ? 1 : Math.ceil(data!.total/20)}
        className="mt-8"
      />
    </>
  )
}
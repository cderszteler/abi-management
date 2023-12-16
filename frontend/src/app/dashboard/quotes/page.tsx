import {PageHeading} from "@/components/PageIntro";
import clsx from "clsx";
import {Colors, PillWithBorder} from "@/components/Badge";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {SectionHeader} from "@/components/SectionIntro";
import {TableWithBorder} from "@/components/Table";

// TODO: Abstract / fetch from server
const quotes = [
  {
    id: 1,
    content: 'Ich hatte ganz viele motivierte Q1-ser in meinem Projekt, die das als 4. oder 5. Wahl bekommen haben. War toll. Ja, ich wusste gar nicht, ob ich morgens aufstehen oder mir gleich die Kugel geben soll.',
    status: 'Accepted'
  },
  {
    id: 2,
    content: 'P.: Ein Experiment ist bei der Relativitätstheorie schwierig.\n L.: Wieso? Man muss nur schnell laufen können.',
    status: 'Pending',
  },
  {
    id: 3,
    content: 'Aber das sagt ihr nicht Frau D., sonst läuft die hier wieder so zickig rum.',
    status: 'Denied',
  }
]

function Button({className, children}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button
      className={clsx(
        "group rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold ring-1 ring-inset shadow-inner lg:hover:-translate-y-1 lg:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 transition",
        className
      )}
      type="button"
    >
      {children}
    </button>
  )
}

function statusColor(status: string): Colors {
  switch (status) {
    case "Accepted": {
      return "green"
    }
    case "Pending": {
      return "yellow"
    }
    case "Denied": {
      return "red"
    }
    default: {
      return "gray"
    }
  }
}

export default function Quotes() {
  return (
    <>
      <PageHeading content="Zitate"/>
      <SectionHeader title="Ausstehende Zitate" smaller={true} className="mt-4">
        <p className="text-base -mt-4">
          Beachte, dass für ein Zitat, das mehre Personen beinhaltet,
          alle Personen diesem Zitat zustimmen müssen,
          damit dieses gedruckt werden kann.
        </p>
      </SectionHeader>
      <TableWithBorder
        separator={true}
        headers={[{name: "Zitat"}, {name: "Status"}, {screenReader: "Aktionen"}]}
        rows={quotes.map((quote) => [
          {
            text: quote.content
          },
          {
            children: (
              <PillWithBorder color={statusColor(quote.status)}>
                {quote.status}
              </PillWithBorder>
            )
          },
          {
            children: (
              <>
                <Button
                  className="mb-4 lg:mb-0 lg:mr-4 bg-green-100 text-green-700 ring-green-500/40 shadow-green-300/80 hover:bg-green-200/80 hover:text-green-900 hover:ring-green-700/40"
                >
                  <CheckIcon className="h-4 group-hover:scale-110"/>
                </Button>
                <Button className="bg-red-100 text-red-700 ring-red-500/40 shadow-red-300/80 hover:bg-red-200/80 hover:text-red-900 hover:ring-red-700/40">
                  <XMarkIcon className="h-4 group-hover:scale-110"/>
                </Button>
              </>
            ),
            className: "lg:whitespace-nowrap"
          }
        ])}
      />
    </>
  )
}
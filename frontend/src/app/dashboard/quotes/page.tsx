import {PageHeading} from "@/components/PageIntro";
import clsx from "clsx";
import {Colors, PillWithBorder} from "@/components/Badge";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";

// TODO: Abstract / fetch from server
const quotes = [
  {
    id: 1,
    content: 'Ich hatte ganz viele motivierte Q1-ser in meinem Projekt, die das als 4. oder 5. Wahl bekommen haben. War toll. Ja, ich wusste gar nicht, ob ich morgens aufstehen oder mir gleich die Kugel geben soll.',
    status: 'Pending'
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

function RowSeparator({side}: {side: 'left' | 'right'}) {
  return (
    <div className={clsx(
      "absolute -top-px h-px bg-neutral-300",
      side === 'left' ? 'left-6 right-0' : 'left-0 right-6'
    )}/>
  )
}

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
    case "Pending": {
      return "green"
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
      <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Zitat
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
          </thead>
          <tbody>
            {quotes.map((quote, index) => (
              <tr key={quote.id} className="even:bg-neutral-50 min">
                <td className={clsx(
                  index === 0 ? '' : 'border-t border-transparent',
                  'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
                )}>
                  <div className="font-medium text-gray-900 whitespace-pre-line">
                    {quote.content}
                  </div>
                  {index !== 0 ? <RowSeparator side="left"/> : null}
                </td>
                <td
                  className={clsx(
                    index === 0 ? '' : 'border-t border-neutral-300',
                    'px-3 py-3.5 text-sm text-gray-500'
                  )}
                >
                  <PillWithBorder color={statusColor(quote.status)}>
                    {quote.status}
                  </PillWithBorder>
                </td>
                <td
                  className={clsx(
                    index === 0 ? '' : 'border-t border-transparent',
                    'relative py-3.5 pl-4 pr-4 text-right text-sm font-medium sm:pr-6 lg:whitespace-nowrap'
                  )}
                >

                  <Button
                    className="mb-4 lg:mb-0 lg:mr-4 bg-green-100 text-green-700 ring-green-500/50 shadow-green-300 hover:bg-green-200/80 hover:text-green-900 hover:ring-green-700/50"
                  >
                    <CheckIcon className="h-4 group-hover:scale-110"/>
                  </Button>
                  <Button className="bg-red-100 text-red-700 ring-red-500/50 shadow-red-300 hover:bg-red-200/80 hover:text-red-900 hover:ring-red-700/50">
                    <XMarkIcon className="h-4 group-hover:scale-110"/>
                  </Button>
                  {index !== 0 ? <RowSeparator side="right"/> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
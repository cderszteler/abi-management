import {PageHeading} from "@/components/PageIntro";
import {Colors, PillWithBorder} from "@/components/Badge";
import {SectionHeader} from "@/components/SectionIntro";
import {TableWithBorder} from "@/components/Table";
import {BooleanActionButtonGroup} from "@/components/Button";

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
        // TODO: Implement loading
        loading={false}
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
              <BooleanActionButtonGroup/>
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
    </>
  )
}
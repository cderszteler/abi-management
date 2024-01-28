'use client'

import {TableWithBorder} from "@/components/Table";
import {useContext} from "react";
import {DashboardContext} from "@/app/dashboard/DashboardContextProvider";
import {hasRoles} from "@/lib/auth";
import {Copyable} from "@/components/Copyable";
import {
  reviewStatusDescriptions
} from "@/app/dashboard/admin/quote/AdminQuoteStatus";
import {StatusPill} from "@/components/Badge";
import {AdminComments} from "@/app/dashboard/admin/comment/page";

export function AdminCommentsTable(
{
  data,
  loading,
  className
}: {
  data: AdminComments | undefined
  loading: boolean
  className?: string
}) {
  const { user } = useContext(DashboardContext)
  const isAdmin = hasRoles(user?.roles, ['Admin'])

  return (
    <div className={className}>
      <TableWithBorder
        loading={loading}
        separator={true}
        fallback="Es konnten keine Kommentare mit den ausgewählten Filter gefunden werden."
        headers={[
          ...(isAdmin ? [{name: "Id"}] : []),
          {name: "Kommentar"},
          {name: "Adressat"},
          {name: "Status"}
        ]}
        rows={loading ? [] : data!.comments.map((comment) => ({
          className: reviewStatusDescriptions[comment.status]?.backgroundColor,
          alternatingBackground: false,
          columns: [
            ...(isAdmin ? [
              {
                children: (<Copyable>{comment.id.toString()}</Copyable>)
              }
            ] : []),
            {
              className: "w-4/6",
              children: (
                <Copyable
                  content={comment.content}
                >
                  <div className="font-medium text-gray-900 whitespace-pre-line">
                    {comment.content}
                  </div>
                </Copyable>
              )
            },
            {
              className: "w-1/6",
              text: comment.userDisplayName,
            },
            {
              children: (
                <StatusPill status={comment.status} clickable={false}/>
              )
            }
          ]
        }))}
        loadingRow={[
          ...(isAdmin ? [{
            children: <div className="animate-pulse w-8 h-2 bg-neutral-300 rounded-md"/>
          }] : []),
          {
            className: "w-4/6",
            children: (
              <>
                <div className="animate-pulse w-40 lg:w-72 xl:w-8/12 h-2 bg-neutral-300 rounded-md"/>
              </>
            )
          },
          {
            className: "w-1/6",
            children: <div className="animate-pulse w-24 xl:w-32 h-2 bg-neutral-300 rounded-md"/>
          },
          {
            children: <div className="animate-pulse w-16 h-2 bg-neutral-300 rounded-md"/>
          }
        ]}
      />
    </div>
  )
}
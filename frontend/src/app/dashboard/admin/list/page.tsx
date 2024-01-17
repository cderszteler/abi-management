'use client'

import {ListType, TypeSelector} from "@/app/dashboard/admin/list/TypeSelector";
import {useState} from "react";
import AuthorsInput from "@/app/dashboard/admin/create/AuthorsInput";
import {User} from "@/lib/auth";

export default function CreatePage() {
  const [type, setType] = useState<ListType | undefined>()
  const [user, setUser] = useState<User | undefined>()

  return (
    <>
      <div className="flex flex-col gap-y-3 sm:flex-row sm:gap-x-4">
        <div className="flex items-center gap-x-2">
          <label htmlFor="types" className="block font-medium leading-6 text-neutral-950">
            Typ:
          </label>
          <TypeSelector type={type} setType={setType}/>
        </div>
        <div className="flex items-center gap-x-2">
          <label htmlFor="types" className="block font-medium leading-6 text-neutral-950">
            Nutzer:
          </label>
          <AuthorsInput
            multiple={false}
            invalid={false}
            authors={user}
            setAuthors={setUser}
            className="relative min-w-40 sm:min-w-52 md:min-w-72 max-w-72"
          />
        </div>
      </div>

    </>
  )
}
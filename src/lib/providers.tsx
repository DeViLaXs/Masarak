'use client'

import { makeQueryClient } from '@/lib/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode
}) {
  // NEVER DO THIS (at the root level):
  // const queryClient = new QueryClient()
  //
  // Creating the queryClient at the file root level makes the cache shared
  // between all requests and means _all_ data gets passed to _all_ users.
  // Besides being bad for performance, this also leaks any sensitive data.

  // Instead do this, which ensures each request has its own cache:
  const [queryClient] = React.useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

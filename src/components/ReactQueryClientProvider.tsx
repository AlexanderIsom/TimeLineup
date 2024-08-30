'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function ReactQueryClientProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			}
		}
	}))
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
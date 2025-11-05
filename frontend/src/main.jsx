import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes/index.jsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:1
    }
  }
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient }>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={true } />}
    </QueryClientProvider>
  </StrictMode>
  // <RouterProvider router={router} />
)
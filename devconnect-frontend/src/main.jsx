// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import store from './store/store.js';
import './index.css';
import App from './App.jsx';

// Create query client — configure globally
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // ↑ data stays fresh for 5 minutes — no refetch
      gcTime: 1000 * 60 * 10,
      // ↑ cache kept for 10 minutes after component unmounts
      retry: 1,
      // ↑ retry failed requests once before showing error
      refetchOnWindowFocus: false,
      // ↑ don't refetch when user switches browser tabs
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
        {/* ↑ debug tool — shows cache, queries, status */}
        {/* Only visible in development */}
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
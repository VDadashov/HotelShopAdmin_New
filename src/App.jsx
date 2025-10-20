
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import routes from "./routes/routes"
import { RouterProvider } from "react-router-dom"
import ErrorBoundary from "./components/common/ErrorBoundary"
import './i18n'; // Import i18n configuration
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function App() {
  document.title = "HotelShop Admin";
  
  // App başlananda default dil set et
  useEffect(() => {
    const currentLang = localStorage.getItem('i18nextLng') || 'az';
    localStorage.setItem('lang', currentLang);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes}></RouterProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

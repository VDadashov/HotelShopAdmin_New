
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import routes from "./routes/routes"
import { RouterProvider } from "react-router-dom"
import './i18n'; // Import i18n configuration

const queryClient = new QueryClient();

export default function App() {
  document.title = "HotelShop Admin";
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes}></RouterProvider>
      </QueryClientProvider>
  )
}

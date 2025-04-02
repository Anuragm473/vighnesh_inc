import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import AppRoutes from "./routes/AppRoutes";
import store from "./store";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <AppRoutes />
        </CookiesProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

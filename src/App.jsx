import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  return (
    <ThemeProvider>
      <LoadingScreen />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
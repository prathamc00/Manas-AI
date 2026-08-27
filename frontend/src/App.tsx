import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

/** MANAS-AI — Botanical / Organic Serif application routes. */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" />
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/login"><Auth mode="login" /></Route>
            <Route path="/signup"><Auth mode="signup" /></Route>
            <Route path="/app" component={Home} />
            <Route><Landing /></Route>
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import ShoumatakPage from "@/pages/shoumatak";
import ItineraryPage from "@/pages/itinerary";
import AttractionsPage from "@/pages/attractions";
import AttractionDetailPage from "@/pages/attraction-detail";
import HotelsPage from "@/pages/hotels";
import HotelDetailPage from "@/pages/hotel-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/shoumatak" component={ShoumatakPage} />
      <Route path="/itinerary" component={ItineraryPage} />
      <Route path="/attractions" component={AttractionsPage} />
      <Route path="/attractions/:id" component={AttractionDetailPage} />
      <Route path="/hotels" component={HotelsPage} />
      <Route path="/hotels/:id" component={HotelDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

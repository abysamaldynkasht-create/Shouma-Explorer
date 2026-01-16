import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Navigation, MapPin, Star, Loader2 } from "lucide-react";
import { attractions } from "@/lib/attractions";
import type { Attraction } from "@shared/schema";

interface NearbyAttraction extends Attraction {
  distance: number;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function NearbyPlacesPage() {
  const [, setLocation] = useLocation();
  const { t, isRTL } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [nearbyAttractions, setNearbyAttractions] = useState<NearbyAttraction[]>([]);

  const requestLocation = () => {
    setLocationStatus("loading");
    
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationStatus("success");
        
        const attractionsWithCoords = attractions.filter(a => a.lat && a.lng);
        const withDistances: NearbyAttraction[] = attractionsWithCoords.map(attraction => ({
          ...attraction,
          distance: calculateDistance(latitude, longitude, attraction.lat!, attraction.lng!)
        }));
        
        withDistances.sort((a, b) => a.distance - b.distance);
        setNearbyAttractions(withDistances.slice(0, 20));
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              data-testid="button-back"
              onClick={() => setLocation("/home")}
            >
              <BackArrow className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground" data-testid="text-page-title">
                {t('nearbyPlacesTitle')}
              </h1>
              <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">
                {t('nearbyPlacesSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {locationStatus === "idle" || locationStatus === "loading" ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="text-searching">
              {t('searchingLocation')}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {t('locationRequired')}
            </p>
          </div>
        ) : locationStatus === "error" ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <Navigation className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="text-error">
              {t('locationError')}
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              {t('locationRequired')}
            </p>
            <Button onClick={requestLocation} data-testid="button-retry">
              {t('enableLocation')}
            </Button>
          </div>
        ) : nearbyAttractions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="text-no-results">
              {t('noNearbyPlaces')}
            </h2>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Navigation className="w-4 h-4" />
              <span data-testid="text-results-count">
                {nearbyAttractions.length} {t('attractionCount')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAttractions.map((attraction) => (
                <Card 
                  key={attraction.id}
                  className="overflow-hidden hover-elevate cursor-pointer"
                  onClick={() => setLocation(`/attraction/${attraction.id}`)}
                  data-testid={`card-attraction-${attraction.id}`}
                >
                  <div className="aspect-video relative bg-muted">
                    {attraction.image ? (
                      <img 
                        src={attraction.image} 
                        alt={attraction.nameAr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <MapPin className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium`}>
                      {attraction.distance.toFixed(1)} {t('km')}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1" data-testid={`text-attraction-name-${attraction.id}`}>
                      {attraction.nameAr}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {attraction.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{attraction.wilayat}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{attraction.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Compass, 
  ArrowRight,
  Calendar,
  MapPin,
  UtensilsCrossed,
  Building2,
  Car,
  Clock,
  Download,
  Share2,
  Home,
  Sparkles
} from "lucide-react";
import type { Itinerary, ItineraryDay } from "@shared/schema";

const activityIcons: Record<string, React.ReactNode> = {
  attraction: <MapPin className="w-4 h-4" />,
  restaurant: <UtensilsCrossed className="w-4 h-4" />,
  hotel: <Building2 className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
};

const activityColors: Record<string, string> = {
  attraction: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  restaurant: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  hotel: "bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400",
  transport: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default function ItineraryPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  const fullUrl = searchString ? `/api/itinerary?${searchString}` : "/api/itinerary";
  
  const { data: itinerary, isLoading, error } = useQuery<Itinerary>({
    queryKey: [fullUrl],
  });

  const budgetLabels: Record<string, string> = {
    low: "اقتصادية",
    medium: "متوسطة",
    high: "مرتفعة",
    luxury: "فاخرة",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              <button
                onClick={() => setLocation("/shoumatak")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span className="text-sm font-medium">رجوع</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Compass className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">جدولك السياحي</span>
              </div>
              <div className="w-16" />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Skeleton className="w-64 h-10 mx-auto mb-4" />
            <Skeleton className="w-48 h-6 mx-auto" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="w-40 h-8" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex gap-4">
                      <Skeleton className="w-16 h-6" />
                      <Skeleton className="flex-1 h-6" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              حدث خطأ
            </h2>
            <p className="text-muted-foreground mb-6">
              لم نتمكن من إنشاء جدولك السياحي. يرجى المحاولة مرة أخرى.
            </p>
            <Button onClick={() => setLocation("/shoumatak")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              حاول مرة أخرى
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              data-testid="button-back"
              onClick={() => setLocation("/shoumatak")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium">رجوع</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">جدولك السياحي</span>
            </div>
            <Button
              data-testid="button-home"
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/home")}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">جدول مخصص لك</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {itinerary.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{itinerary.duration} أيام</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span>الميزانية: {budgetLabels[itinerary.budget] || itinerary.budget}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {itinerary.days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Button
            data-testid="button-new-plan"
            variant="outline"
            size="lg"
            onClick={() => setLocation("/shoumatak")}
            className="h-12 px-6 rounded-full"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            إنشاء خطة جديدة
          </Button>
          <Button
            data-testid="button-home-footer"
            size="lg"
            onClick={() => setLocation("/home")}
            className="h-12 px-6 rounded-full"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </Button>
        </div>
      </main>
    </div>
  );
}

function DayCard({ day }: { day: ItineraryDay }) {
  return (
    <Card data-testid={`card-day-${day.day}`} className="overflow-hidden">
      <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{day.day}</span>
          </div>
          <div>
            <CardTitle className="text-xl">{day.title}</CardTitle>
            <p className="text-sm text-muted-foreground">اليوم {day.day}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {day.activities.map((activity, index) => (
            <div 
              key={index}
              data-testid={`activity-${day.day}-${index}`}
              className="flex gap-4 items-start"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activityColors[activity.type]}`}>
                  {activityIcons[activity.type]}
                </div>
                {index < day.activities.length - 1 && (
                  <div className="w-0.5 h-12 bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span>{activity.time}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {activity.activity}
                </h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activity.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

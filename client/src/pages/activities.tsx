import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { activities } from "@/lib/activities";
import { Card, CardContent } from "@/components/ui/card";

export default function ActivitiesPage() {
  const [, setLocation] = useLocation();
  const { t, isRTL } = useLanguage();

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/home")}
                data-testid="button-back"
              >
                <BackArrow className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-page-title">
                {t('activities')}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-no-activities">
              {t('noActivitiesYet')}
            </h2>
            <p className="text-muted-foreground text-center max-w-md" data-testid="text-coming-soon">
              {t('activitiesComingSoon')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setLocation(`/activities/${activity.id}`)}
                data-testid={`card-activity-${activity.id}`}
              >
                <div className="aspect-video relative">
                  <img
                    src={activity.image}
                    alt={isRTL ? activity.nameAr : activity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {isRTL ? activity.nameAr : activity.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isRTL ? activity.descriptionAr : activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

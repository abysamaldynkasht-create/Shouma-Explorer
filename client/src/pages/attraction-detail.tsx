import { useLocation, useParams } from "wouter";
import { attractions } from "@/lib/attractions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  ArrowRight,
  MapPin,
  Star,
  Clock,
  Wallet,
  Share2,
  Heart,
  Navigation
} from "lucide-react";

export default function AttractionDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  
  const attraction = attractions.find((a) => a.id === params.id);

  const getPriceTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      free: "مجاني",
      low: "اقتصادي",
      medium: "متوسط",
      high: "مرتفع",
    };
    return labels[tier] || tier;
  };

  const getRelatedAttractions = () => {
    if (!attraction) return [];
    return attractions
      .filter((a) => a.id !== attraction.id && a.region === attraction.region)
      .slice(0, 3);
  };

  if (!attraction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              المكان غير موجود
            </h2>
            <p className="text-muted-foreground mb-6">
              لم نتمكن من العثور على هذا المكان السياحي.
            </p>
            <Button onClick={() => setLocation("/attractions")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للأماكن السياحية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedAttractions = getRelatedAttractions();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              data-testid="button-back"
              onClick={() => setLocation("/attractions")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium">رجوع</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">تفاصيل المكان</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" data-testid="button-share">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-favorite">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {attraction.tags.map((tag) => (
                <Badge key={tag} className="bg-white/20 backdrop-blur-sm text-white border-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg" data-testid="text-attraction-title">
              {attraction.nameAr}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{attraction.city}، {attraction.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{attraction.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-about-title">
                عن المكان
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg" data-testid="text-attraction-description">
                {attraction.description}
              </p>
            </section>

            {attraction.gallery.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  معرض الصور
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {attraction.gallery.map((img, index) => (
                    <div key={index} className="aspect-video rounded-xl overflow-hidden">
                      <img src={img} alt={`${attraction.nameAr} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground">معلومات سريعة</h3>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الموقع</p>
                    <p className="font-medium">{attraction.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التكلفة</p>
                    <p className="font-medium">{getPriceTierLabel(attraction.priceTier)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التقييم</p>
                    <p className="font-medium">{attraction.rating} / 5</p>
                  </div>
                </div>

                <Button className="w-full h-12" data-testid="button-get-directions">
                  <Navigation className="w-5 h-5 ml-2" />
                  احصل على الاتجاهات
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedAttractions.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              أماكن قريبة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedAttractions.map((related) => (
                <Card 
                  key={related.id}
                  data-testid={`card-related-${related.id}`}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLocation(`/attractions/${related.id}`)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.nameAr}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{related.nameAr}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{related.city}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            جميع الحقوق محفوظة © {new Date().getFullYear()} شومة
          </p>
        </div>
      </footer>
    </div>
  );
}

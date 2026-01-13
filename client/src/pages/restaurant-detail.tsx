import { useLocation, useParams } from "wouter";
import { restaurants } from "@/lib/restaurants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  ArrowRight,
  MapPin,
  Star,
  Share2,
  Heart,
  Phone,
  Check,
  Clock,
  Wallet
} from "lucide-react";

export default function RestaurantDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  
  const restaurant = restaurants.find((r) => r.id === params.id);

  const getPriceRangeLabel = (range: string) => {
    const labels: Record<string, string> = {
      budget: "اقتصادي",
      moderate: "متوسط",
      expensive: "مرتفع",
      luxury: "فاخر",
    };
    return labels[range] || range;
  };

  const getRelatedRestaurants = () => {
    if (!restaurant) return [];
    return restaurants
      .filter((r) => r.id !== restaurant.id && r.cuisine === restaurant.cuisine)
      .slice(0, 3);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              المطعم غير موجود
            </h2>
            <p className="text-muted-foreground mb-6">
              لم نتمكن من العثور على هذا المطعم.
            </p>
            <Button onClick={() => setLocation("/restaurants")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للمطاعم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedRestaurants = getRelatedRestaurants();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              data-testid="button-back"
              onClick={() => setLocation("/restaurants")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium">رجوع</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">تفاصيل المطعم</span>
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
          src={restaurant.image}
          alt={restaurant.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-3">
              {restaurant.cuisine}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg" data-testid="text-restaurant-title">
              {restaurant.nameAr}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{restaurant.city}، {restaurant.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{restaurant.rating}</span>
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
                عن المطعم
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg" data-testid="text-restaurant-description">
                {restaurant.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                المميزات
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {restaurant.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
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
                    <p className="font-medium">{restaurant.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">نوع المطبخ</p>
                    <p className="font-medium">{restaurant.cuisine}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">مستوى الأسعار</p>
                    <p className="font-medium">{getPriceRangeLabel(restaurant.priceRange)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التقييم</p>
                    <p className="font-medium">{restaurant.rating} / 5</p>
                  </div>
                </div>

                <Button className="w-full h-12" data-testid="button-call-restaurant">
                  <Phone className="w-5 h-5 ml-2" />
                  اتصل للحجز
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedRestaurants.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              مطاعم مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRestaurants.map((related) => (
                <Card 
                  key={related.id}
                  data-testid={`card-related-${related.id}`}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLocation(`/restaurants/${related.id}`)}
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

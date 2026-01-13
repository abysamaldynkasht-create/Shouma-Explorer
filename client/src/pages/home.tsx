import { useLocation } from "wouter";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building2, 
  UtensilsCrossed, 
  Mountain, 
  Car, 
  Sparkles,
  LogOut,
  Search,
  Hospital
} from "lucide-react";
import shoumaLogo from "@assets/شومة_1768320219408.jpg";
import { Input } from "@/components/ui/input";

const iconMap: Record<string, React.ReactNode> = {
  MapPin: <MapPin className="w-8 h-8" />,
  Building2: <Building2 className="w-8 h-8" />,
  UtensilsCrossed: <UtensilsCrossed className="w-8 h-8" />,
  Mountain: <Mountain className="w-8 h-8" />,
  Car: <Car className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  Hospital: <Hospital className="w-8 h-8" />,
};

export default function HomePage() {
  const [, setLocation] = useLocation();

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "shoumatak") {
      setLocation("/shoumatak");
    } else if (categoryId === "attractions") {
      setLocation("/attractions");
    } else if (categoryId === "hotels") {
      setLocation("/hotels");
    } else if (categoryId === "restaurants") {
      setLocation("/restaurants");
    } else if (categoryId === "taxis") {
      setLocation("/taxis");
    } else if (categoryId === "hiking") {
      setLocation("/hiking");
    } else if (categoryId === "hospitals") {
      setLocation("/hospitals");
    }
  };

  const handleLogout = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={shoumaLogo} 
                alt="شومة" 
                className="h-12 w-auto"
                data-testid="logo-icon"
              />
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              data-testid="button-logout"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg" data-testid="text-welcome">
            مرحباً بك في شومة
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-8 drop-shadow" data-testid="text-subtitle">
            دليلك الشامل لاكتشاف أجمل الوجهات السياحية والتجارب الفريدة
          </p>
          
          <div className="w-full max-w-xl">
            <div className="relative">
              <Input
                data-testid="input-search"
                type="search"
                placeholder="ابحث عن وجهتك المفضلة..."
                className="h-14 text-base pr-5 pl-14 bg-white/95 backdrop-blur border-0 shadow-xl rounded-full"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button 
            data-testid="button-start-journey"
            onClick={() => setLocation("/shoumatak")}
            className="mt-6 h-12 px-8 text-base font-semibold rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all"
          >
            <Sparkles className="w-5 h-5 ml-2" />
            ابدأ رحلتك مع شومتك
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-services-title">
              اكتشف خدماتنا
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-services-subtitle">
              نقدم لك مجموعة شاملة من الخدمات لتجعل رحلتك مميزة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                data-testid={`card-category-${category.id}`}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${getCategoryImage(category.id)}')`,
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color}`} />
                
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  {iconMap[category.icon]}
                </div>

                <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg" data-testid={`text-category-title-${category.id}`}>
                    {category.titleAr}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow" data-testid={`text-category-desc-${category.id}`}>
                    {category.description}
                  </p>
                </div>

                {category.id === "shoumatak" && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-white" data-testid="badge-featured">مميز</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-shoumatak-title">
            شومتك - مخطط رحلتك الذكي
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-shoumatak-desc">
            أجب على بضعة أسئلة بسيطة وسنقوم بإنشاء جدول سياحي مخصص لك بناءً على تفضيلاتك وميزانيتك
          </p>
          <Button 
            data-testid="button-try-shoumatak"
            onClick={() => setLocation("/shoumatak")}
            size="lg"
            className="h-14 px-10 text-lg font-semibold rounded-full"
          >
            جرب شومتك الآن
            <Sparkles className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={shoumaLogo} 
              alt="شومة" 
              className="h-10 w-auto"
            />
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            جميع الحقوق محفوظة © {new Date().getFullYear()} شومة
          </p>
        </div>
      </footer>
    </div>
  );
}

function getCategoryImage(id: string): string {
  const images: Record<string, string> = {
    attractions: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?q=80&w=800",
    hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    restaurants: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
    hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800",
    taxis: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800",
    hospitals: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800",
    shoumatak: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800",
  };
  return images[id] || images.attractions;
}

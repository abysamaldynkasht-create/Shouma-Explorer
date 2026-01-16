import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { hotels } from "@/lib/hotels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaymentModal from "@/components/PaymentModal";
import type { RoomOption } from "@shared/schema";
import { 
  Building2, 
  ArrowRight,
  MapPin,
  Star,
  Share2,
  Heart,
  CreditCard,
  Check,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Phone,
  Users,
  Bed,
  Navigation
} from "lucide-react";

export default function HotelDetailPage() {
  const [, setLocation] = useLocation();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const params = useParams<{ id: string }>();
  
  const hotel = hotels.find((h) => h.id === params.id);

  const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const getRelatedHotels = () => {
    if (!hotel) return [];
    return hotels
      .filter((h) => h.id !== hotel.id && h.region === hotel.region)
      .slice(0, 3);
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              الفندق غير موجود
            </h2>
            <p className="text-muted-foreground mb-6">
              لم نتمكن من العثور على هذا الفندق.
            </p>
            <Button onClick={() => setLocation("/hotels")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للفنادق
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedHotels = getRelatedHotels();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              data-testid="button-back"
              onClick={() => setLocation("/hotels")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium">رجوع</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">تفاصيل الفندق</span>
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
          src={hotel.image}
          alt={hotel.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-1 mb-3">
              {renderStars(hotel.stars)}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg" data-testid="text-hotel-title">
              {hotel.nameAr}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{hotel.city}، {hotel.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{hotel.rating}</span>
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
                عن الفندق
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg" data-testid="text-hotel-description">
                {hotel.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                المرافق والخدمات
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {hotel.roomOptions && hotel.roomOptions.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  خيارات الغرف
                </h2>
                <div className="space-y-4">
                  {hotel.roomOptions.map((room) => (
                    <Card 
                      key={room.id} 
                      className={`overflow-hidden cursor-pointer transition-all ${
                        selectedRoom?.id === room.id 
                          ? "ring-2 ring-primary border-primary" 
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedRoom(room)}
                      data-testid={`card-room-${room.id}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Bed className="w-5 h-5 text-primary" />
                              <h3 className="font-bold text-lg">{room.nameAr}</h3>
                              {selectedRoom?.id === room.id && (
                                <Badge className="bg-primary text-primary-foreground">محدد</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{room.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>حتى {room.maxGuests} ضيوف</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {room.amenities.slice(0, 4).map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.amenities.length - 4} المزيد
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-2xl font-bold text-primary">{room.pricePerNight} ر.ع</p>
                            <p className="text-sm text-muted-foreground">لليلة الواحدة</p>
                            <Button 
                              className="mt-3"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoom(room);
                                setPaymentOpen(true);
                              }}
                              data-testid={`button-book-room-${room.id}`}
                            >
                              احجز الآن
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {hotel.gallery.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  معرض الصور
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {hotel.gallery.map((img, index) => (
                    <div key={index} className="aspect-video rounded-xl overflow-hidden">
                      <img src={img} alt={`${hotel.nameAr} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-1">السعر يبدأ من</p>
                  <p className="text-3xl font-bold text-primary">{hotel.pricePerNight} ر.ع</p>
                  <p className="text-xs text-muted-foreground">لليلة الواحدة</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الموقع</p>
                    <p className="font-medium">{hotel.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التقييم</p>
                    <p className="font-medium">{hotel.rating} / 5</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التصنيف</p>
                    <div className="flex gap-0.5">
                      {renderStars(hotel.stars)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">للحجز والاستفسار</p>
                    <a 
                      href={`tel:${hotel.phone}`} 
                      className="font-medium text-primary hover:underline"
                      dir="ltr"
                      data-testid="link-hotel-phone"
                    >
                      {hotel.phone}
                    </a>
                  </div>
                </div>

                {hotel.mapUrl && (
                  <a
                    href={hotel.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    data-testid="link-hotel-map"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">عرض على الخريطة</p>
                      <p className="text-xs text-muted-foreground">افتح في خرائط جوجل</p>
                    </div>
                  </a>
                )}

                {hotel.roomOptions && hotel.roomOptions.length > 0 ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">اختر نوع الغرفة من الخيارات أعلاه</p>
                    {selectedRoom && (
                      <Button 
                        className="w-full h-12" 
                        data-testid="button-book-now"
                        onClick={() => setPaymentOpen(true)}
                      >
                        <CreditCard className="w-5 h-5 ml-2" />
                        احجز {selectedRoom.nameAr}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    className="w-full h-12" 
                    data-testid="button-book-now"
                    onClick={() => setPaymentOpen(true)}
                  >
                    <CreditCard className="w-5 h-5 ml-2" />
                    احجز الآن
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <PaymentModal
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          hotelName={selectedRoom ? `${hotel.nameAr} - ${selectedRoom.nameAr}` : hotel.nameAr}
          pricePerNight={selectedRoom ? selectedRoom.pricePerNight : hotel.pricePerNight}
          nights={1}
        />

        {relatedHotels.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              فنادق مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedHotels.map((related) => (
                <Card 
                  key={related.id}
                  data-testid={`card-related-${related.id}`}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLocation(`/hotels/${related.id}`)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.nameAr}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex gap-0.5">
                      {renderStars(related.stars)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{related.nameAr}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{related.city}</span>
                      </div>
                      <span className="font-bold text-primary">{related.pricePerNight} ر.ع</span>
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

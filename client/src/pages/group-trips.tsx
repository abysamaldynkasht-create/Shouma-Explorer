import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Calendar,
  Globe,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/شومة_1768320219408.jpg";

const preferenceKeys = [
  "prefAdventures",
  "prefExploration",
  "prefHeritage",
  "prefNature",
  "prefEntertainment",
  "prefCustom",
] as const;

const preferenceValues = [
  "adventures",
  "exploration",
  "heritage",
  "nature",
  "entertainment",
  "custom",
];

const countries = [
  "Oman", "UAE", "Saudi Arabia", "Kuwait", "Bahrain", "Qatar",
  "Egypt", "Jordan", "Lebanon", "Iraq", "Morocco", "Tunisia",
  "Turkey", "Iran", "India", "Pakistan", "Bangladesh",
  "United Kingdom", "United States", "Canada", "Germany", "France",
  "Spain", "Italy", "Netherlands", "Australia", "Japan", "China",
  "South Korea", "Malaysia", "Indonesia", "Thailand", "Philippines",
  "Russia", "Brazil", "Mexico", "South Africa", "Kenya", "Nigeria",
];

const countriesAr: Record<string, string> = {
  "Oman": "عُمان", "UAE": "الإمارات", "Saudi Arabia": "السعودية",
  "Kuwait": "الكويت", "Bahrain": "البحرين", "Qatar": "قطر",
  "Egypt": "مصر", "Jordan": "الأردن", "Lebanon": "لبنان",
  "Iraq": "العراق", "Morocco": "المغرب", "Tunisia": "تونس",
  "Turkey": "تركيا", "Iran": "إيران", "India": "الهند",
  "Pakistan": "باكستان", "Bangladesh": "بنغلاديش",
  "United Kingdom": "المملكة المتحدة", "United States": "الولايات المتحدة",
  "Canada": "كندا", "Germany": "ألمانيا", "France": "فرنسا",
  "Spain": "إسبانيا", "Italy": "إيطاليا", "Netherlands": "هولندا",
  "Australia": "أستراليا", "Japan": "اليابان", "China": "الصين",
  "South Korea": "كوريا الجنوبية", "Malaysia": "ماليزيا",
  "Indonesia": "إندونيسيا", "Thailand": "تايلاند",
  "Philippines": "الفلبين", "Russia": "روسيا", "Brazil": "البرازيل",
  "Mexico": "المكسيك", "South Africa": "جنوب أفريقيا",
  "Kenya": "كينيا", "Nigeria": "نيجيريا",
};

export default function GroupTripsPage() {
  const [, setLocation] = useLocation();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const mutation = useMutation({
    mutationFn: async (data: {
      numberOfPeople: number;
      numberOfDays: number;
      preferences: string[];
      country: string;
      arrivalDate: string;
    }) => {
      const res = await apiRequest("POST", "/api/group-trips", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("tryAgain"),
        variant: "destructive",
      });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!numberOfPeople || parseInt(numberOfPeople) < 1) {
      newErrors.numberOfPeople = t("minPeople");
    }
    if (!numberOfDays || parseInt(numberOfDays) < 1) {
      newErrors.numberOfDays = t("minDays");
    }
    if (selectedPreferences.length === 0) {
      newErrors.preferences = t("fieldRequired");
    }
    if (!country) {
      newErrors.country = t("fieldRequired");
    }
    if (!arrivalDate) {
      newErrors.arrivalDate = t("fieldRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutation.mutate({
      numberOfPeople: parseInt(numberOfPeople),
      numberOfDays: parseInt(numberOfDays),
      preferences: selectedPreferences,
      country,
      arrivalDate,
    });
  };

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
    if (errors.preferences) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.preferences;
        return next;
      });
    }
  };

  const getCountryDisplay = (c: string) => {
    if (isRTL || language === "ar" || language === "fa") {
      return countriesAr[c] || c;
    }
    return c;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground" data-testid="text-request-submitted">
              {t("requestSubmitted")}
            </h2>
            <p className="text-muted-foreground text-sm" data-testid="text-request-desc">
              {t("requestSubmittedDesc")}
            </p>
            <Button
              data-testid="button-back-home"
              onClick={() => setLocation("/home")}
              className="mt-4"
            >
              {t("backToHome")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              data-testid="button-back"
              onClick={() => setLocation("/home")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BackArrow className="w-5 h-5" />
              <span className="text-sm font-medium">{t("back")}</span>
            </button>

            <div className="flex items-center gap-2">
              <img
                src={logoImage}
                alt="شومة"
                className="w-8 h-8 rounded-full object-cover"
              />
              <h1 className="text-lg font-bold text-foreground">
                {t("groupTrips")}
              </h1>
            </div>

            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-page-title">
            {t("groupTrips")}
          </h2>
          <p className="text-muted-foreground text-sm" data-testid="text-page-subtitle">
            {t("groupTripsSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="numberOfPeople" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {t("numberOfPeople")}
                </Label>
                <Input
                  data-testid="input-number-of-people"
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="1"
                  value={numberOfPeople}
                  onChange={(e) => {
                    setNumberOfPeople(e.target.value);
                    if (errors.numberOfPeople) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.numberOfPeople;
                        return next;
                      });
                    }
                  }}
                />
                {errors.numberOfPeople && (
                  <p className="text-sm text-destructive" data-testid="error-number-of-people">
                    {errors.numberOfPeople}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfDays" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {t("numberOfDays")}
                </Label>
                <Input
                  data-testid="input-number-of-days"
                  id="numberOfDays"
                  type="number"
                  min="1"
                  max="90"
                  placeholder="1"
                  value={numberOfDays}
                  onChange={(e) => {
                    setNumberOfDays(e.target.value);
                    if (errors.numberOfDays) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.numberOfDays;
                        return next;
                      });
                    }
                  }}
                />
                {errors.numberOfDays && (
                  <p className="text-sm text-destructive" data-testid="error-number-of-days">
                    {errors.numberOfDays}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Label className="flex items-center gap-2 mb-1">
                {t("tripPreferences")}
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                {t("selectPreferences")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {preferenceKeys.map((key, index) => {
                  const value = preferenceValues[index];
                  const isSelected = selectedPreferences.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      data-testid={`button-pref-${value}`}
                      onClick={() => togglePreference(value)}
                      className={`px-4 py-3 rounded-md border text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500"
                          : "bg-background border-border text-foreground hover-elevate"
                      }`}
                    >
                      {t(key)}
                    </button>
                  );
                })}
              </div>
              {errors.preferences && (
                <p className="text-sm text-destructive" data-testid="error-preferences">
                  {errors.preferences}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {t("countryOfOrigin")}
                </Label>
                <Select
                  value={country}
                  onValueChange={(val) => {
                    setCountry(val);
                    if (errors.country) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.country;
                        return next;
                      });
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-country">
                    <SelectValue placeholder={t("selectCountry")} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c} data-testid={`option-country-${c}`}>
                        {getCountryDisplay(c)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive" data-testid="error-country">
                    {errors.country}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {t("arrivalDate")}
                </Label>
                <Input
                  data-testid="input-arrival-date"
                  id="arrivalDate"
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => {
                    setArrivalDate(e.target.value);
                    if (errors.arrivalDate) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.arrivalDate;
                        return next;
                      });
                    }
                  }}
                />
                {errors.arrivalDate && (
                  <p className="text-sm text-destructive" data-testid="error-arrival-date">
                    {errors.arrivalDate}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            data-testid="button-submit-request"
            type="submit"
            className="w-full"
            size="lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("submitRequest")}</span>
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}

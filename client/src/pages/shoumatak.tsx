import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Wallet,
  Users,
  Heart,
  Home,
  UtensilsCrossed,
  Sparkles,
  Check
} from "lucide-react";
import type { QuestionnaireData } from "@shared/schema";

interface Question {
  id: keyof QuestionnaireData | "welcome";
  title: string;
  subtitle: string;
  type: "single" | "multiple" | "number" | "welcome";
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  min?: number;
  max?: number;
}

const questions: Question[] = [
  {
    id: "welcome",
    title: "مرحباً بك في شومتك",
    subtitle: "سنساعدك في تخطيط رحلتك المثالية من خلال بضعة أسئلة بسيطة",
    type: "welcome",
  },
  {
    id: "duration",
    title: "كم مدة إقامتك؟",
    subtitle: "حدد عدد أيام رحلتك",
    type: "number",
    min: 1,
    max: 30,
  },
  {
    id: "budget",
    title: "ما هي ميزانيتك؟",
    subtitle: "اختر نطاق الميزانية المناسب لك",
    type: "single",
    options: [
      { value: "low", label: "اقتصادية", icon: <Wallet className="w-6 h-6" /> },
      { value: "medium", label: "متوسطة", icon: <Wallet className="w-6 h-6" /> },
      { value: "high", label: "مرتفعة", icon: <Wallet className="w-6 h-6" /> },
      { value: "luxury", label: "فاخرة", icon: <Sparkles className="w-6 h-6" /> },
    ],
  },
  {
    id: "groupSize",
    title: "كم عدد المسافرين؟",
    subtitle: "حدد عدد الأشخاص في رحلتك",
    type: "number",
    min: 1,
    max: 20,
  },
  {
    id: "interests",
    title: "ما هي اهتماماتك؟",
    subtitle: "اختر واحدة أو أكثر من اهتماماتك",
    type: "multiple",
    options: [
      { value: "culture", label: "الثقافة والتاريخ" },
      { value: "nature", label: "الطبيعة والمناظر" },
      { value: "adventure", label: "المغامرة والإثارة" },
      { value: "relaxation", label: "الاسترخاء والراحة" },
      { value: "shopping", label: "التسوق" },
      { value: "food", label: "الطعام والمأكولات" },
    ],
  },
  {
    id: "accommodation",
    title: "أين تفضل الإقامة؟",
    subtitle: "اختر نوع السكن المفضل",
    type: "single",
    options: [
      { value: "hotel", label: "فندق", icon: <Home className="w-6 h-6" /> },
      { value: "resort", label: "منتجع", icon: <Sparkles className="w-6 h-6" /> },
      { value: "apartment", label: "شقة فندقية", icon: <Home className="w-6 h-6" /> },
      { value: "hostel", label: "نُزُل", icon: <Home className="w-6 h-6" /> },
    ],
  },
  {
    id: "mealPreference",
    title: "ما نوع الطعام المفضل؟",
    subtitle: "اختر تفضيلاتك للوجبات",
    type: "single",
    options: [
      { value: "local", label: "محلي تقليدي", icon: <UtensilsCrossed className="w-6 h-6" /> },
      { value: "international", label: "عالمي متنوع", icon: <UtensilsCrossed className="w-6 h-6" /> },
      { value: "mixed", label: "مزيج من الاثنين", icon: <Heart className="w-6 h-6" /> },
    ],
  },
  {
    id: "preferredActivities",
    title: "ما الأنشطة التي تفضلها؟",
    subtitle: "اختر الأنشطة المفضلة لرحلتك",
    type: "multiple",
    options: [
      { value: "sightseeing", label: "مشاهدة المعالم" },
      { value: "photography", label: "التصوير" },
      { value: "swimming", label: "السباحة" },
      { value: "camping", label: "التخييم" },
      { value: "sports", label: "الرياضة" },
      { value: "wellness", label: "العناية بالصحة" },
    ],
  },
];

export default function ShoumatakPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireData>>({
    duration: 3,
    groupSize: 2,
    interests: [],
    preferredActivities: [],
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep) / (questions.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const params = new URLSearchParams({
        duration: String(answers.duration || 3),
        budget: answers.budget || "medium",
        groupSize: String(answers.groupSize || 2),
        interests: (answers.interests || []).join(","),
        accommodation: answers.accommodation || "hotel",
        mealPreference: answers.mealPreference || "mixed",
        preferredActivities: (answers.preferredActivities || []).join(","),
      });
      setLocation(`/itinerary?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setLocation("/home");
    }
  };

  const handleSingleSelect = (value: string) => {
    const key = currentQuestion.id as keyof QuestionnaireData;
    setAnswers({ ...answers, [key]: value });
  };

  const handleMultipleSelect = (value: string) => {
    const key = currentQuestion.id as keyof QuestionnaireData;
    const current = (answers[key] as string[]) || [];
    if (current.includes(value)) {
      setAnswers({ ...answers, [key]: current.filter((v) => v !== value) });
    } else {
      setAnswers({ ...answers, [key]: [...current, value] });
    }
  };

  const handleNumberChange = (delta: number) => {
    const key = currentQuestion.id as "duration" | "groupSize";
    const current = answers[key] || 1;
    const min = currentQuestion.min || 1;
    const max = currentQuestion.max || 30;
    const newValue = Math.max(min, Math.min(max, current + delta));
    setAnswers({ ...answers, [key]: newValue });
  };

  const isNextDisabled = () => {
    if (currentQuestion.type === "welcome") return false;
    if (currentQuestion.type === "single") {
      const key = currentQuestion.id as keyof QuestionnaireData;
      return !answers[key];
    }
    if (currentQuestion.type === "multiple") {
      const key = currentQuestion.id as keyof QuestionnaireData;
      const arr = answers[key] as string[] | undefined;
      return !arr || arr.length === 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              data-testid="button-back-header"
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium">رجوع</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">شومتك</span>
            </div>

            <div className="w-16" />
          </div>
        </div>
      </header>

      {currentStep > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-sm text-muted-foreground font-medium">
              {currentStep}/{questions.length - 1}
            </span>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {currentQuestion.type === "welcome" && (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {currentQuestion.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {currentQuestion.subtitle}
          </p>
        </div>

        {currentQuestion.type === "single" && currentQuestion.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => {
              const key = currentQuestion.id as keyof QuestionnaireData;
              const isSelected = answers[key] === option.value;
              return (
                <button
                  key={option.value}
                  data-testid={`option-${option.value}`}
                  onClick={() => handleSingleSelect(option.value)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-right ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  {option.icon && (
                    <div className={`mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                      {option.icon}
                    </div>
                  )}
                  <span className={`text-lg font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "multiple" && currentQuestion.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {currentQuestion.options.map((option) => {
              const key = currentQuestion.id as keyof QuestionnaireData;
              const arr = (answers[key] as string[]) || [];
              const isSelected = arr.includes(option.value);
              return (
                <button
                  key={option.value}
                  data-testid={`option-${option.value}`}
                  onClick={() => handleMultipleSelect(option.value)}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <span className={`text-base font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "number" && (
          <Card className="max-w-sm mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-6">
                <Button
                  data-testid="button-decrease"
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full text-xl"
                  onClick={() => handleNumberChange(-1)}
                >
                  -
                </Button>
                <div className="text-center">
                  <span className="text-5xl font-bold text-primary">
                    {answers[currentQuestion.id as "duration" | "groupSize"] || 1}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentQuestion.id === "duration" ? "أيام" : "أشخاص"}
                  </p>
                </div>
                <Button
                  data-testid="button-increase"
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full text-xl"
                  onClick={() => handleNumberChange(1)}
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4 mt-12">
          <Button
            data-testid="button-back"
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="h-14 px-8 rounded-full"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            رجوع
          </Button>
          <Button
            data-testid="button-next"
            size="lg"
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="h-14 px-8 rounded-full"
          >
            {currentStep === questions.length - 1 ? (
              <>
                عرض الجدول
                <Sparkles className="w-5 h-5 mr-2" />
              </>
            ) : (
              <>
                التالي
                <ArrowLeft className="w-5 h-5 mr-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

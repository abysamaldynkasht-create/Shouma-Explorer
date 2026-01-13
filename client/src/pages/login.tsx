import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Compass } from "lucide-react";
import { insertUserSchema } from "@shared/schema";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const result = insertUserSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "username") {
          fieldErrors.username = "اسم المستخدم مطلوب";
        }
        if (err.path[0] === "password") {
          fieldErrors.password = "كلمة المرور مطلوبة";
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      return apiRequest("POST", endpoint, data);
    },
    onSuccess: () => {
      toast({
        title: isLogin ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في شومة!",
      });
      setLocation("/home");
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        
        <div className="absolute top-8 right-8 flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center" data-testid="logo-login">
            <Compass className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold text-white drop-shadow-lg" data-testid="text-brand">شومة</span>
        </div>
        
        <div className="absolute bottom-16 right-12 left-12 z-10">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg" data-testid="text-hero-title">
            اكتشف جمال الوجهات السياحية
          </h1>
          <p className="text-lg text-white/90 max-w-xl drop-shadow" data-testid="text-hero-subtitle">
            رحلتك المثالية تبدأ من هنا. اكتشف أجمل الأماكن، أفضل الفنادق، وألذ المطاعم في مكان واحد.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center" data-testid="logo-mobile">
              <Compass className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-4xl font-bold text-foreground" data-testid="text-brand-mobile">شومة</span>
          </div>

          <Card className="border-card-border shadow-lg" data-testid="card-login">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold" data-testid="text-form-title">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </CardTitle>
              <CardDescription className="text-muted-foreground" data-testid="text-form-subtitle">
                {isLogin 
                  ? "أدخل بياناتك للوصول إلى حسابك"
                  : "أنشئ حساباً جديداً للبدء في استكشاف العالم"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="username"
                    data-testid="input-username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`h-12 text-base ${errors.username ? "border-destructive" : ""}`}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive" data-testid="error-username">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      data-testid="input-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`h-12 text-base pl-12 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      data-testid="button-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive" data-testid="error-password">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  data-testid="button-submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending 
                    ? "جاري التحميل..." 
                    : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"
                  }
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    data-testid="button-toggle-mode"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    {isLogin 
                      ? "ليس لديك حساب؟ سجل الآن"
                      : "لديك حساب بالفعل؟ سجل دخولك"
                    }
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

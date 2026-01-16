import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff } from "lucide-react";
import shoumaLogo from "@assets/شومة_1768320219408.jpg";
import { insertUserSchema } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
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
          fieldErrors.username = t('usernameRequired');
        }
        if (err.path[0] === "password") {
          fieldErrors.password = t('passwordRequired');
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
        title: isLogin ? t('loginSuccess') : t('registerSuccess'),
        description: t('welcomeMessage'),
      });
      setLocation("/home");
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message || t('tryAgain'),
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
      <div className="absolute top-4 left-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-stone-900 dark:to-amber-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <img 
            src={shoumaLogo} 
            alt={t('appName')}
            className="w-80 h-auto mb-8 drop-shadow-2xl"
            data-testid="logo-login"
          />
          <h1 className="text-4xl font-bold text-foreground mb-4 text-center" data-testid="text-hero-title">
            {t('welcomeToShouma')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl text-center" data-testid="text-hero-subtitle">
            {t('homeSubtitle')}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img 
              src={shoumaLogo} 
              alt="شومة" 
              className="h-24 w-auto"
              data-testid="logo-mobile"
            />
          </div>

          <Card className="border-card-border shadow-lg" data-testid="card-login">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold" data-testid="text-form-title">
                {isLogin ? t('welcomeBack') : t('createNewAccount')}
              </CardTitle>
              <CardDescription className="text-muted-foreground" data-testid="text-form-subtitle">
                {isLogin ? t('loginSubtitle') : t('registerSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    {t('username')}
                  </Label>
                  <Input
                    id="username"
                    data-testid="input-username"
                    type="text"
                    placeholder={t('username')}
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
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      data-testid="input-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password')}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`h-12 text-base ${isRTL ? 'pl-12' : 'pr-12'} ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      data-testid="button-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
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
                    ? t('loading')
                    : isLogin ? t('login') : t('register')
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
                      ? `${t('noAccount')} ${t('createAccount')}`
                      : `${t('haveAccount')} ${t('loginHere')}`
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

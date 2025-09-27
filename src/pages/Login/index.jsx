import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { postData } from "@/utils/api/requests";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Əgər artıq login olubsa, dashboard-a yönləndir
  const token = Cookies.get('token');
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  const validationSchema = Yup.object({
    username: Yup.string().required(t('login.usernameRequired')),
    password: Yup.string().min(8, t('login.passwordMin')).required(t('login.passwordRequired')),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      const response = await postData(ENDPOINTS.login, {
        username: values.username,
        password: values.password,
      });
      if (response.access_token) {
        Cookies.set("token", response.access_token, { expires: 7 });
        toast.success(t('login.success'));
        const from = location.state?.from?.pathname || "/";
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        toast.error(t('login.tokenError'));
      }
    } catch (error) {
      console.error("Login error:", error);
      if (typeof error === 'string') {
        if (error.includes("username") || error.includes("email") || error.includes("Email")) {
          setFieldError("username", error);
        } else if (error.includes("password") || error.includes("Password") || error.includes("şifrə")) {
          setFieldError("password", error);
        } else {
          toast.error(error || t('login.failed'));
        }
      } else {
        toast.error(t('login.failed'));
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-[rgb(var(--primary-brand))] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('login.title')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('login.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('login.username')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Field
                        as={Input}
                        id="username"
                        name="username"
                        type="text"
                        placeholder={t('login.usernamePlaceholder')}
                        className={`pl-10 ${errors.username && touched.username ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    <ErrorMessage name="username" component="div" className="text-red-500 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('login.password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('login.passwordPlaceholder')}
                        className={`pl-10 pr-10 ${errors.password && touched.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[rgb(var(--primary-brand))] text-black font-semibold cursor-pointer hover:bg-[rgb(var(--primary-brand-hover))] transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
                  </Button>
                </Form>
              )}
            </Formik>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rockvell Group Admin Panel
              </p>
            </div>
          </CardContent>
        </Card>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              success: "!bg-green-500 !text-white",
              error: "!bg-red-500 !text-white"
            },
            duration: 3000
          }}
        />
      </div>
    </div>
  );
}; 
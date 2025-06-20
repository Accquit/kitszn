
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signupSchema = signinSchema.extend({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof signupSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const resolver = useMemo(() => zodResolver(mode === "signin" ? signinSchema : signupSchema), [mode]);

  const form = useForm<FormData>({
    resolver,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [mode, form]);

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: values.fullName,
          },
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.info("Please check your email to verify your account.");
        setMode("signin");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={[]} onCartClick={() => {}} />
      <main className="pt-20">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient mb-2">
                {mode === "signin" ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-gray-400">
                {mode === "signin"
                  ? "Sign in to your Jersey Town account"
                  : "Get started with Jersey Town"}
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {mode === 'signup' && (
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-300 mb-2">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <Input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cc73f8] focus:border-transparent transition-colors h-auto"
                                placeholder="Enter your full name"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-300 mb-2">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="email"
                              required
                              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cc73f8] focus:border-transparent transition-colors h-auto"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-300 mb-2">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type={showPassword ? "text" : "password"}
                              required
                              className="block w-full pl-10 pr-12 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cc73f8] focus:border-transparent transition-colors h-auto"
                              placeholder="Enter your password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {mode === 'signup' && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <Input
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full pl-10 pr-12 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cc73f8] focus:border-transparent transition-colors h-auto"
                                placeholder="Confirm your password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {mode === 'signin' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#cc73f8] focus:ring-[#cc73f8] border-gray-600 rounded bg-gray-800" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Remember me</label>
                      </div>
                      <div className="text-sm">
                        <a href="#" className="font-medium text-[#cc73f8] hover:text-[#b85df0] transition-colors">Forgot your password?</a>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#cc73f8] hover:bg-[#b85df0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc73f8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-auto">
                    {isSubmitting ? (mode === 'signin' ? "Signing in..." : "Creating account...") : (mode === 'signin' ? "Sign in" : "Create account")}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="font-medium text-[#cc73f8] hover:text-[#b85df0] transition-colors bg-transparent border-none p-0">
                    {mode === 'signin' ? "Sign up here" : "Sign in here"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;

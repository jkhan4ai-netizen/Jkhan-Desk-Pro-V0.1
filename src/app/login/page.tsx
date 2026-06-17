"use client"

import * as React from "react"
import { login, signup } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoginMode, setIsLoginMode] = React.useState(true)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      if (isLoginMode) {
        const result = await login(formData)
        if (result?.error) {
          toast.error(result.error)
        }
      } else {
        const result = await signup(formData)
        if (result?.error) {
          toast.error(result.error)
        } else {
          toast.success("Регистрация успешна! Теперь вы можете войти.")
          setIsLoginMode(true)
        }
      }
    } catch (error) {
      toast.error("Произошла неизвестная ошибка.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent ring-1 ring-accent/30 shadow-glow-success">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <Card className="glass-panel border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-sans font-bold tracking-tight text-3xl tracking-tight">
              {isLoginMode ? "С возвращением" : "Создать аккаунт"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLoginMode 
                ? "Войдите в систему Jkhan Desk Pro" 
                : "Зарегистрируйтесь для старта работы"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="designer@example.com" 
                  required 
                  className="bg-background/50 border-border/50 focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  {isLoginMode && (
                    <a href="#" className="text-xs text-accent hover:text-accent/80 transition-smooth">
                      Забыли пароль?
                    </a>
                  )}
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="bg-background/50 border-border/50 focus-visible:ring-accent"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-success mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  isLoginMode ? "Войти" : "Зарегистрироваться"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-4">
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              {isLoginMode 
                ? "Нет аккаунта? Зарегистрируйтесь" 
                : "Уже есть аккаунт? Войти"}
            </button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Jkhan Desk Pro © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

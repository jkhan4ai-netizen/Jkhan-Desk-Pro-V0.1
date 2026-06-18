"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updateSettings } from "@/lib/actions/settings"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Send, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { sendTelegramMessage } from "@/lib/telegram"

const formSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  home_currency: z.enum(['UZS', 'RUB', 'USD']),
  pomodoro_work_minutes: z.coerce.number().min(1).max(120),
  pomodoro_short_break: z.coerce.number().min(1).max(60),
  telegram_chat_id: z.string().nullable().optional(),
  custom_usd_rate: z.coerce.number().nullable().optional(),
  custom_rub_rate: z.coerce.number().nullable().optional(),
})

export function SettingsForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const { setTheme } = useTheme()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      theme: initialData?.theme || 'dark',
      home_currency: initialData?.home_currency || 'UZS',
      pomodoro_work_minutes: initialData?.pomodoro_work_minutes || 25,
      pomodoro_short_break: initialData?.pomodoro_short_break || 5,
      telegram_chat_id: initialData?.telegram_chat_id || null,
      custom_usd_rate: initialData?.custom_usd_rate || null,
      custom_rub_rate: initialData?.custom_rub_rate || null,
    },
  })

  const userId = initialData?.user_id;
  // Replace with your actual bot username when deploying
  const botUsername = "jkhan_desk_pro_bot"; 
  const telegramLink = `https://t.me/${botUsername}?start=${userId}`;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const { error } = await updateSettings(values)
      if (error) {
        toast.error(error)
      } else {
        setTheme(values.theme) // Apply theme immediately on client
        toast.success("Настройки успешно сохранены")
      }
    } catch (err) {
      toast.error("Произошла ошибка при сохранении")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Внешний вид и локализация */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Основные настройки</CardTitle>
            <CardDescription>Внешний вид и валюта по умолчанию.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема оформления</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Выберите тему" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Светлая</SelectItem>
                      <SelectItem value="dark">Тёмная</SelectItem>
                      <SelectItem value="system">Как в системе</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Переключение цвета интерфейса.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="home_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Базовая валюта</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UZS">Узбекский Сум (UZS)</SelectItem>
                      <SelectItem value="RUB">Российский Рубль (RUB)</SelectItem>
                      <SelectItem value="USD">Доллар США (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    В этой валюте будет считаться общая прибыль на главной.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Курсы валют */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Курсы валют</CardTitle>
            <CardDescription>Оставьте пустым для авто-обновления с сайта ЦБ РУз.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="custom_usd_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Курс USD к UZS (свой)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="bg-background/50" placeholder="Например: 12600" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>Оставьте пустым для авто-расчета</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="custom_rub_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Курс RUB к UZS (свой)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="bg-background/50" placeholder="Например: 140.5" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>Оставьте пустым для авто-расчета</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Настройки таймера */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Метод Pomodoro</CardTitle>
            <CardDescription>Стандартные интервалы для фокуса и перерывов.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="pomodoro_work_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Время фокуса (минуты)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormDescription>По умолчанию: 25 минут</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pomodoro_short_break"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Короткий перерыв (минуты)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormDescription>По умолчанию: 5 минут</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Интеграция с Telegram */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#0088cc]" /> Уведомления в Telegram</CardTitle>
            <CardDescription>Привяжите свой Telegram для получения уведомлений о новых заказах, оплатах и дедлайнах.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="telegram_chat_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ваш Telegram Chat ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: 123456789" className="bg-background/50" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    {field.value 
                      ? "Бот успешно привязан! Вы можете вручную изменить ID, если нужно."
                      : "Вы можете ввести ID вручную, или привязать бота автоматически по ссылке ниже."
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.getValues('telegram_chat_id') && (
              <div className="p-4 rounded-lg bg-[#0088cc]/10 border border-[#0088cc]/20 flex flex-col items-start gap-3">
                <p className="text-sm font-medium text-foreground">Как привязать автоматически:</p>
                <ol className="text-sm text-muted-foreground list-decimal ml-4 space-y-1">
                  <li>Перейдите по ссылке ниже.</li>
                  <li>Нажмите кнопку <b>Запустить</b> (Start) в боте.</li>
                  <li>Обновите эту страницу, Chat ID должен заполниться сам.</li>
                </ol>
                <Button type="button" variant="outline" asChild className="border-[#0088cc]/50 text-[#0088cc] hover:bg-[#0088cc]/10">
                  <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Перейти в бота
                  </a>
                </Button>
              </div>
            )}

            {form.getValues('telegram_chat_id') && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={async () => {
                  toast.loading("Отправка сообщения...", { id: 'tg-test' });
                  const res = await sendTelegramMessage(form.getValues('telegram_chat_id')!, "👋 Привет! Это тестовое сообщение из **Jkhan Desk Pro**.");
                  if (res.error) toast.error(res.error, { id: 'tg-test' });
                  else toast.success("Сообщение отправлено! Проверьте Telegram.", { id: 'tg-test' });
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Отправить тестовое сообщение
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Сохранить настройки
          </Button>
        </div>
        
      </form>
    </Form>
  )
}

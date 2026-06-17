"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addWishlistItem } from "@/lib/actions/wishlist"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(2, "Слишком короткое название"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Цена не может быть отрицательной"),
  currency: z.enum(['UZS', 'RUB', 'USD']),
  category: z.enum(['HARDWARE', 'COURSES', 'LICENSES', 'OTHER']),
  priority: z.enum(['URGENT', 'MEDIUM', 'LATER']),
  url: z.string().url("Неверный формат ссылки").optional().or(z.literal("")),
})

export function AddWishlistDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      currency: "UZS",
      category: "HARDWARE",
      priority: "MEDIUM",
      url: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const { error } = await addWishlistItem({
        ...values,
        url: values.url === "" ? undefined : values.url
      })
      if (error) {
        toast.error(error)
      } else {
        toast.success("Добавлено в список покупок!")
        setOpen(false)
        form.reset()
      }
    } catch (err) {
      toast.error("Произошла ошибка при сохранении")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Добавить цель
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-panel border-border/50">
        <DialogHeader>
          <DialogTitle className="font-calistoga">Новая цель для покупки</DialogTitle>
          <DialogDescription>
            Запланируйте покупку софта, курсов или техники для работы.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: MacBook Pro M3" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" className="bg-background/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Валюта</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Валюта" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UZS">UZS (Сум)</SelectItem>
                        <SelectItem value="RUB">RUB (Рубль)</SelectItem>
                        <SelectItem value="USD">USD (Доллар)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Категория" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HARDWARE">Железо</SelectItem>
                        <SelectItem value="COURSES">Курсы</SelectItem>
                        <SelectItem value="LICENSES">Лицензии</SelectItem>
                        <SelectItem value="OTHER">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Приоритет</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Приоритет" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="URGENT">Срочно</SelectItem>
                        <SelectItem value="MEDIUM">Средне</SelectItem>
                        <SelectItem value="LATER">Потом</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на товар (опционально)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Добавить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

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

import { createProject } from "@/lib/actions/projects"
import { getClients } from "@/lib/actions/clients"

const formSchema = z.object({
  title: z.string().min(2, "Название должно содержать минимум 2 символа"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Введите корректную сумму"),
  currency: z.string(),
  prepayment: z.string().optional(),
  status: z.string(),
  client_id: z.string().optional(),
  new_client_name: z.string().optional(),
  description: z.string().optional(),
})

export function CreateProjectDialog() {
  const [open, setOpen] = React.useState(false)
  const [clients, setClients] = React.useState<any[]>([])
  const [isClientNew, setIsClientNew] = React.useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "0",
      currency: "UZS",
      prepayment: "0",
      status: "NEW",
      client_id: "new_client",
      new_client_name: "",
      description: "",
    },
  })

  // Load existing clients when dialog opens
  React.useEffect(() => {
    if (open) {
      getClients().then((res) => {
        if (res.clients) {
          setClients(res.clients)
          if (res.clients.length === 0) {
            form.setValue("client_id", "new_client")
            setIsClientNew(true)
          }
        }
      })
    }
  }, [open, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("amount", values.amount)
      formData.append("currency", values.currency)
      formData.append("prepayment", values.prepayment || "0")
      formData.append("status", values.status)
      if (values.description) formData.append("description", values.description)
      
      if (values.client_id) {
        formData.append("client_id", values.client_id)
      }
      if (values.client_id === "new_client" && values.new_client_name) {
        formData.append("new_client_name", values.new_client_name)
      }

      const result = await createProject(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Проект успешно создан!")
      setOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error("Произошла неизвестная ошибка.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-success">
          <Plus className="mr-2 h-4 w-4" /> Новый Проект
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-panel border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans font-bold tracking-tight text-2xl">Создать Проект</DialogTitle>
          <DialogDescription>
            Укажите детали нового проекта. Предоплата будет учтена автоматически.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            {/* Client Section */}
            <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border/50">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Клиент</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val)
                        setIsClientNew(val === "new_client")
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Выберите клиента" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new_client" className="text-accent font-medium">+ Создать нового клиента</SelectItem>
                        {clients.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isClientNew && (
                <FormField
                  control={form.control}
                  name="new_client_name"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel>Имя нового клиента</FormLabel>
                      <FormControl>
                        <Input placeholder="Иван Иванов" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название Проекта</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Логотип для TechCorp" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Общая Стоимость</FormLabel>
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
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="RUB">RUB (₽)</SelectItem>
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
                name="prepayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Предоплата</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" className="bg-background/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">Новый</SelectItem>
                        <SelectItem value="IN_PROGRESS">В Работе</SelectItem>
                        <SelectItem value="READY">Готов</SelectItem>
                        <SelectItem value="PAID">Оплачен</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание (опционально)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Дополнительные детали или ссылки на ТЗ..." 
                      className="bg-background/50 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="border-border/50"
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Создать"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

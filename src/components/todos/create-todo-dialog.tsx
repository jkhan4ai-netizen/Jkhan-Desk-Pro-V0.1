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

import { createTodo } from "@/lib/actions/todos"
import { getProjects } from "@/lib/actions/projects"

const formSchema = z.object({
  title: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z.string().optional(),
  category: z.string(),
  project_id: z.string().optional(),
})

export function CreateTodoDialog() {
  const [open, setOpen] = React.useState(false)
  const [projects, setProjects] = React.useState<any[]>([])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "WORK",
      project_id: "none",
    },
  })

  React.useEffect(() => {
    if (open) {
      getProjects().then((res) => {
        if (res.projects) {
          setProjects(res.projects)
        }
      })
    }
  }, [open])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      if (values.description) formData.append("description", values.description)
      formData.append("category", values.category)
      
      if (values.project_id && values.project_id !== "none") {
        formData.append("project_id", values.project_id)
      }

      const result = await createTodo(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Задача успешно добавлена!")
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
          <Plus className="mr-2 h-4 w-4" /> Новая Задача
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-panel border-border/50">
        <DialogHeader>
          <DialogTitle className="font-sans font-bold tracking-tight text-2xl">Новая Задача</DialogTitle>
          <DialogDescription>
            Запишите задачу, чтобы не забыть. Привяжите её к проекту, если нужно.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Что нужно сделать?</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Сделать драфт логотипа" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Проект</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 text-xs">
                          <SelectValue placeholder="Без проекта" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Без проекта</SelectItem>
                        {projects.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="WORK">Работа</SelectItem>
                        <SelectItem value="FINANCE">Финансы</SelectItem>
                        <SelectItem value="LEARNING">Обучение</SelectItem>
                        <SelectItem value="PERSONAL">Личное</SelectItem>
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
                      placeholder="Подробности..." 
                      className="bg-background/50 resize-none h-20" 
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
                  "Сохранить"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

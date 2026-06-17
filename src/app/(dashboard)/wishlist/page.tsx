import { getWishlistItems, markWishlistPurchased, deleteWishlistItem } from "@/lib/actions/wishlist"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Monitor, BookOpen, Key, Package, ExternalLink, CheckCircle2, Trash2 } from "lucide-react"
import { AddWishlistDialog } from "@/components/wishlist/add-wishlist-dialog"
import { revalidatePath } from "next/cache"

const CategoryIcons = {
  HARDWARE: Monitor,
  COURSES: BookOpen,
  LICENSES: Key,
  OTHER: Package
}

const CategoryColors = {
  HARDWARE: "text-blue-500 bg-blue-500/10",
  COURSES: "text-purple-500 bg-purple-500/10",
  LICENSES: "text-orange-500 bg-orange-500/10",
  OTHER: "text-gray-500 bg-gray-500/10"
}

const CategoryLabels = {
  HARDWARE: "Железо",
  COURSES: "Курсы",
  LICENSES: "Лицензии/Софт",
  OTHER: "Другое"
}

export default async function WishlistPage() {
  const { items, error } = await getWishlistItems();

  const plannedItems = items?.filter((i: any) => i.status === 'PLANNED') || [];
  const purchasedItems = items?.filter((i: any) => i.status === 'PURCHASED') || [];
  
  // Quick calculation: how many projects?
  // Let's assume an average check of 1,500,000 UZS for simplicity in MVP.
  // In a real app, this would be computed from past projects.
  const avgCheck = 1500000; 

  const handlePurchase = async (formData: FormData) => {
    "use server"
    const id = formData.get("id") as string;
    if (id) await markWishlistPurchased(id);
  }

  const handleDelete = async (formData: FormData) => {
    "use server"
    const id = formData.get("id") as string;
    if (id) await deleteWishlistItem(id);
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-calistoga text-3xl font-bold tracking-tight">Список покупок</h1>
          <p className="text-muted-foreground mt-1">Планируйте инвестиции в свою профессию.</p>
        </div>
        <AddWishlistDialog />
      </div>

      {error && <div className="text-destructive text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Planned Items (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-calistoga text-xl mb-2 flex items-center gap-2">
            В планах <Badge variant="secondary" className="rounded-full">{plannedItems.length}</Badge>
          </h2>
          
          {plannedItems.length === 0 ? (
            <Card className="glass-panel border-dashed border-border/50 bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <Package className="h-12 w-12 mb-4 opacity-50" />
                <p>Ваш список покупок пуст.</p>
                <p className="text-sm">Добавьте технику или курсы, которые хотите купить.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plannedItems.map((item: any) => {
                const Icon = CategoryIcons[item.category as keyof typeof CategoryIcons];
                const projectsNeeded = Math.ceil(Number(item.price) / avgCheck);
                
                return (
                  <Card key={item.id} className="glass-panel border-border/50 hover:border-primary/30 transition-all group overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${CategoryColors[item.category as keyof typeof CategoryColors]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {item.priority === 'URGENT' && <Badge variant="destructive" className="text-[10px]">Срочно</Badge>}
                        {item.priority === 'MEDIUM' && <Badge variant="outline" className="text-[10px] text-yellow-500 border-yellow-500/20">Средне</Badge>}
                        {item.priority === 'LATER' && <Badge variant="secondary" className="text-[10px] opacity-50">Потом</Badge>}
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2 min-h-[32px]">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="text-xl font-calistoga text-accent tabular-nums mb-1">
                        {Number(item.price).toLocaleString()} {item.currency}
                      </div>
                      <div className="text-xs text-muted-foreground mb-4">
                        ≈ {projectsNeeded} средних {projectsNeeded === 1 ? 'проект' : 'проекта'}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-auto">
                        <form action={handlePurchase} className="flex-1">
                          <input type="hidden" name="id" value={item.id} />
                          <Button size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Куплено
                          </Button>
                        </form>
                        {item.url && (
                          <Button size="sm" variant="outline" asChild className="px-3 border-border/50">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <form action={handleDelete}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button size="sm" variant="ghost" className="px-3 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Purchased Items (1 col) */}
        <div className="flex flex-col gap-4">
          <h2 className="font-calistoga text-xl mb-2 flex items-center gap-2 text-muted-foreground">
            Уже куплено <Badge variant="secondary" className="rounded-full bg-background/50">{purchasedItems.length}</Badge>
          </h2>
          
          <div className="flex flex-col gap-3">
            {purchasedItems.length === 0 ? (
               <p className="text-sm text-muted-foreground italic">Здесь будут отображаться ваши приобретения.</p>
            ) : (
              purchasedItems.map((item: any) => {
                const Icon = CategoryIcons[item.category as keyof typeof CategoryIcons];
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${CategoryColors[item.category as keyof typeof CategoryColors]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1 decoration-muted-foreground/30 line-through">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{Number(item.price).toLocaleString()} {item.currency}</p>
                      </div>
                    </div>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </form>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

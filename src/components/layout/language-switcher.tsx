"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter()

  const toggleLang = () => {
    const newLang = currentLang === 'uz' ? 'ru' : 'uz'
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`
    // Refresh to apply new language across Server Components
    router.refresh()
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLang}
      className="font-medium px-2 rounded-full text-xs text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
    >
      {currentLang === 'uz' ? 'UZ' : 'RU'}
    </Button>
  )
}

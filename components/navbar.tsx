"use client"

import { Home, Search, BookmarkIcon, User, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/use-translation"

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  const t = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2 z-50">
      <div className="flex justify-around items-center">
        <Button variant="ghost" size="icon" className="text-white" title={t.home}>
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" title={t.search}>
          <Search className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" title={t.bookmarks}>
          <BookmarkIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" title={t.profile}>
          <User className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white" 
          title={t.switchLanguage}
          onClick={toggleLanguage}
        >
          <Languages className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}


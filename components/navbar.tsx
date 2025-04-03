import { Home, Search, BookmarkIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2 z-50">
      <div className="flex justify-around items-center">
        <Button variant="ghost" size="icon" className="text-white">
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Search className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <BookmarkIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}


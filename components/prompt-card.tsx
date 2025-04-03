"use client"

import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/use-translation"

interface Prompt {
  id: number
  text: string
  author: string
  likes: number
  comments: number
  avatar: string
}

interface PromptCardProps {
  prompt: Prompt
  isLiked: boolean
  onLike: () => void
  onComment: () => void
  onShare: () => void
}

export default function PromptCard({ prompt, isLiked, onLike, onComment, onShare }: PromptCardProps) {
  const t = useTranslation()

  return (
    <Card className="w-full h-[80vh] flex flex-col justify-between bg-gradient-to-b from-gray-900 to-black border-gray-800 text-white overflow-hidden">
      <CardContent className="p-6 flex-grow flex flex-col justify-center pointer-events-none">
        <div className="text-2xl font-bold mb-8 text-center leading-relaxed">
          {prompt.text}
        </div>
      </CardContent>

      <CardFooter className="p-6 border-t border-gray-800 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-gray-700">
              <AvatarImage src={prompt.avatar} alt={prompt.author} />
              <AvatarFallback>{prompt.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">@{prompt.author}</span>
          </div>
        </div>

        <div className="flex justify-around w-full">
          <Button variant="ghost" size="icon" onClick={onLike} className="flex flex-col items-center gap-1" title={t.likes}>
            <Heart className={cn("h-6 w-6", isLiked ? "fill-red-500 text-red-500" : "")} />
            <span className="text-xs">{prompt.likes.toLocaleString()}</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={onComment} className="flex flex-col items-center gap-1" title={t.comments}>
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs">{prompt.comments.toLocaleString()}</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={onShare} className="flex flex-col items-center gap-1" title={t.share}>
            <Share2 className="h-6 w-6" />
            <span className="text-xs">{t.share}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


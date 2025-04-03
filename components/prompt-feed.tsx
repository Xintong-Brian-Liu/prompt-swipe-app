"use client"

import { useState, useRef } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import PromptCard from "@/components/prompt-card"
import { useToast } from "@/hooks/use-toast"
import ChatInterface from "@/components/chat-interface"
import { useTranslation } from "@/lib/use-translation"

// Sample data - in a real app this would come from an API
const SAMPLE_PROMPTS = [
  {
    id: 1,
    text: "prompts.sample1",
    author: "CreativeWriter",
    likes: 1243,
    comments: 89,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    text: "prompts.sample2",
    author: "FutureThinker",
    likes: 2567,
    comments: 134,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    text: "prompts.sample3",
    author: "PoetryLover",
    likes: 987,
    comments: 45,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    text: "prompts.sample4",
    author: "SciFiCreator",
    likes: 1876,
    comments: 112,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    text: "prompts.sample5",
    author: "StoryMaster",
    likes: 3421,
    comments: 201,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function PromptFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedPrompts, setLikedPrompts] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const controls = useAnimation()
  const constraintsRef = useRef(null)
  const { toast } = useToast()
  const t = useTranslation()

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100

    if (info.offset.y > threshold) {
      // Swiped down - next prompt
      await controls.start({ y: "100%", opacity: 0 })
      nextPrompt()
    } else if (info.offset.y < -threshold) {
      // Swiped up - previous prompt
      await controls.start({ y: "-100%", opacity: 0 })
      previousPrompt()
    } else if (info.offset.x > threshold) {
      // Swiped right - show chat interface
      await controls.start({ x: "100%", opacity: 0 })
      setShowChat(true)
      controls.start({ x: 0, y: 0, opacity: 1 })
    } else {
      // Return to center if not swiped far enough
      controls.start({ x: 0, y: 0, opacity: 1 })
    }
  }

  const nextPrompt = () => {
    if (currentIndex < SAMPLE_PROMPTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
      controls.start({ x: 0, opacity: 1 })
    } else {
      // Reset to beginning when we reach the end
      setCurrentIndex(0)
      controls.start({ x: 0, opacity: 1 })
      toast({
        title: t.allPromptsSeen,
        description: t.allPromptsSeenDescription,
      })
    }
  }

  const previousPrompt = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      controls.start({ x: 0, y: 0, opacity: 1 })
    } else {
      // Go to the end when at the beginning
      setCurrentIndex(SAMPLE_PROMPTS.length - 1)
      controls.start({ x: 0, y: 0, opacity: 1 })
      toast({
        title: t.firstPromptReached,
        description: t.firstPromptReachedDescription,
      })
    }
  }

  const handleDoubleClick = () => {
    handleLike(SAMPLE_PROMPTS[currentIndex].id)
  }

  const handleLike = (promptId: number) => {
    if (!likedPrompts.includes(promptId)) {
      setLikedPrompts([...likedPrompts, promptId])
      toast({
        title: t.promptLiked,
        description: t.promptLikedDescription,
      })
    }
  }

  const handleComment = () => {
    toast({
      title: t.commentsTitle,
      description: t.commentsDescription,
    })
  }

  const handleShare = () => {
    toast({
      title: t.shareTitle,
      description: t.shareDescription,
    })
  }

  const currentPrompt = {
    ...SAMPLE_PROMPTS[currentIndex],
    text: t.prompts[SAMPLE_PROMPTS[currentIndex].text.replace('prompts.', '') as keyof typeof t.prompts]
  }
  const isLiked = likedPrompts.includes(currentPrompt.id)

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={constraintsRef}
    >
      {showChat && (
        <ChatInterface
          initialPrompt={currentPrompt.text}
          onClose={() => setShowChat(false)}
        />
      )}
      
      <motion.div
        drag={true}
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, y: 0, opacity: 1 }}
        className="w-full max-w-md"
        onDoubleClick={handleDoubleClick}
      >
        <PromptCard
          prompt={currentPrompt}
          isLiked={isLiked}
          onLike={() => handleLike(currentPrompt.id)}
          onComment={handleComment}
          onShare={handleShare}
        />
      </motion.div>

      <div className="text-white text-xs mt-4 opacity-50">
        {t.swipeInstructions}
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}


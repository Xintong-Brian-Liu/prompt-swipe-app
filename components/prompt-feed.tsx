"use client"

import { useState, useRef } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import PromptCard from "@/components/prompt-card"
import { useToast } from "@/hooks/use-toast"

// Sample data - in a real app this would come from an API
const SAMPLE_PROMPTS = [
  {
    id: 1,
    text: "Create a story about a detective who can talk to animals",
    author: "CreativeWriter",
    likes: 1243,
    comments: 89,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    text: "Design a futuristic city where nature and technology are perfectly balanced",
    author: "FutureThinker",
    likes: 2567,
    comments: 134,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    text: "Write a poem about the feeling of discovering something new",
    author: "PoetryLover",
    likes: 987,
    comments: 45,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    text: "Describe a world where humans can photosynthesize like plants",
    author: "SciFiCreator",
    likes: 1876,
    comments: 112,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    text: "Create a character who can manipulate time but only for 10 seconds",
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
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null)
  const controls = useAnimation()
  const constraintsRef = useRef(null)
  const { toast } = useToast()

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
      // Swiped right - apply to deepseek
      await controls.start({ x: "100%", opacity: 0 })
      applyToDeepseek(SAMPLE_PROMPTS[currentIndex].text)
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
        title: "You've seen all prompts",
        description: "Starting from the beginning again",
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
        title: "First prompt reached",
        description: "Going to the last prompt",
      })
    }
  }

  const applyToDeepseek = async (promptText: string) => {
    setIsLoading(true)
    setGeneratedResponse(null)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate with DeepSeek');
      }
      
      const data = await response.json();
      setGeneratedResponse(data.response);
      
      toast({
        title: "Generated with DeepSeek",
        description: "Prompt successfully processed by DeepSeek model",
      });
    } catch (error) {
      console.error('Error applying prompt to DeepSeek:', error);
      toast({
        title: "Error",
        description: "Failed to process prompt with DeepSeek model",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDoubleClick = () => {
    handleLike(SAMPLE_PROMPTS[currentIndex].id)
  }

  const handleLike = (promptId: number) => {
    if (!likedPrompts.includes(promptId)) {
      setLikedPrompts([...likedPrompts, promptId])
      toast({
        title: "Prompt liked!",
        description: "This prompt has been added to your favorites",
      })
    }
  }

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment functionality would open here",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Sharing options would appear here",
    })
  }

  const currentPrompt = SAMPLE_PROMPTS[currentIndex]
  const isLiked = likedPrompts.includes(currentPrompt.id)

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={constraintsRef}
    >
      {generatedResponse ? (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg text-white mb-4 overflow-auto max-h-[40vh]">
          <h3 className="text-xl font-bold mb-2">DeepSeek Response:</h3>
          <p className="whitespace-pre-wrap">{generatedResponse}</p>
          <button 
            onClick={() => setGeneratedResponse(null)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      
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
        Swipe up/down to navigate • Double-click to like • Swipe right to apply to DeepSeek
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}


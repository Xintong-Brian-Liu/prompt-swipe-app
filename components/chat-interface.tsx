"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "@/lib/use-translation"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  initialPrompt: string
  onClose: () => void
}

export default function ChatInterface({ initialPrompt, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: initialPrompt }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslation()

  // Automatically send initial prompt to AI when component mounts
  useEffect(() => {
    const sendInitialPrompt = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt: initialPrompt,
            conversation: messages
          }),
        });
        
        if (!response.ok) {
          throw new Error(t.errorGeneratingText);
        }
        
        const data = await response.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } catch (error) {
        console.error('Error sending initial prompt:', error);
      } finally {
        setIsLoading(false);
      }
    }

    sendInitialPrompt();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: userMessage,
          conversation: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(t.errorSendingMessage);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{t.chatWithDeepSeek}</h2>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-gray-800">
            {t.close}
          </Button>
        </div>
        
        <ScrollArea className="h-[60vh] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-800">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t.typeMessage}
              className="flex-1 bg-gray-800 text-white border-gray-700"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t.send}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 
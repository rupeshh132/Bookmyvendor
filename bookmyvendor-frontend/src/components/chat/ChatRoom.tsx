import { useEffect, useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { chatService } from '../../services/chatService'
import { bookingService } from '../../services/bookingService'
import useAuthStore from '../../lib/authStore'
import { jwtDecode } from 'jwt-decode'

export default function ChatRoom({ bookingId }: { bookingId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { token } = useAuthStore()

  // Decode JWT to get my user ID
  let myUserId = ''
  if (token) {
    const decoded: any = jwtDecode(token)
    myUserId = decoded.sub
  }

  // Fetch initial history
  const { data: history } = useQuery({
    queryKey: ['chatHistory', bookingId],
    queryFn: () => bookingService.getChatHistory(bookingId),
  })

  useEffect(() => {
    if (history) setMessages(history)
  }, [history])

  // Connect WebSocket
  useEffect(() => {
    chatService.connect((newMsg) => {
      setMessages((prev) => [...prev, newMsg])
    }, bookingId)

    return () => {
      chatService.disconnect()
    }
  }, [bookingId])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    chatService.sendMessage(bookingId, input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-stone/20 rounded-card overflow-hidden border border-stone">
      <div className="bg-navy p-4">
        <h4 className="font-display font-semibold text-white">Live Chat</h4>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === myUserId
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 font-sans text-sm ${
                isMe ? 'bg-navy text-white rounded-br-none' : 'bg-white text-ink shadow-sm rounded-bl-none'
              }`}>
                {msg.content}
                <div className={`text-[10px] mt-1 ${isMe ? 'text-white/70 text-right' : 'text-muted text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone flex gap-2">
        <input 
          type="text" 
          className="flex-1 bmv-input rounded-full" 
          placeholder="Type a message..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button type="submit" className="bg-terracotta text-white p-3 rounded-full hover:bg-terracotta/90 transition-colors">
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

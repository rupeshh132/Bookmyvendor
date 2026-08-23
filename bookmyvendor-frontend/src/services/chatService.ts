import { Client } from '@stomp/stompjs'
import { useAuthStore } from '../lib/authStore'

let stompClient: Client | null = null

// Use native WebSocket (avoids SockJS unload policy violation in modern browsers)
function createNativeWS(url: string) {
  const wsUrl = url.replace(/^http/, 'ws')
  return new WebSocket(wsUrl)
}

export const chatService = {
  connect: (onMessageReceived: (msg: any) => void, bookingId: string) => {
    const { accessToken } = useAuthStore.getState()

    stompClient = new Client({
            webSocketFactory: () => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws';
        return createNativeWS(wsUrl);
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken ?? ''}`,
      },
      debug: () => { /* silent in production */ },
      onConnect: () => {
        stompClient?.subscribe(`/topic/booking/${bookingId}`, (message) => {
          if (message.body) {
            onMessageReceived(JSON.parse(message.body))
          }
        })
      },
      reconnectDelay: 5000,
    })

    stompClient.activate()
  },

  disconnect: () => {
    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
    }
  },

  sendMessage: (bookingId: string, content: string) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ bookingRequestId: bookingId, content }),
      })
    }
  },
}


import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import useAuthStore from './authStore'

let stompClient: Client | null = null

export const chatService = {
  connect: (onMessageReceived: (msg: any) => void, bookingId: string) => {
    const { token } = useAuthStore.getState()
    
    stompClient = new Client({
      // Use SockJS fallback if standard WS fails or for better compat
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        // console.log(str)
      },
      onConnect: () => {
        stompClient?.subscribe(`/topic/booking/${bookingId}`, (message) => {
          if (message.body) {
            onMessageReceived(JSON.parse(message.body))
          }
        })
      },
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
        body: JSON.stringify({ bookingRequestId: bookingId, content })
      })
    }
  }
}

import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientVideoCallService {
  private socket?: WebSocketSubject<any>;
  private signalStream = new Subject<any>();
  private socketSubscription?: Subscription;

  connectToRoom(roomName: string): void {
   const url = `wss://tarek-zryb.onrender.com/ws/video/${roomName}/`;


    this.socket = webSocket({
      url,
      deserializer: msg => msg.data ? JSON.parse(msg.data) : msg,
      serializer: msg => JSON.stringify(msg),
      openObserver: {
        next: () => console.log(`[WebSocket] Connected to ${roomName}`)
      },
      closeObserver: {
        next: () => console.log(`[WebSocket] Disconnected from ${roomName}`)
      }
    });

    this.socketSubscription = this.socket.subscribe({
      next: data => this.signalStream.next(data),
      error: err => console.error('[WebSocket] Error:', err),
      complete: () => console.log('[WebSocket] Connection closed')
    });
  }

  sendSignal(data: any): void {
    if (this.socket) {
      this.socket.next(data);
    } else {
      console.warn('[WebSocket] Cannot send signal: socket not connected');
    }
  }

  onSignal(callback: (data: any) => void): void {
    this.signalStream.subscribe(callback);
  }

  closeConnection(): void {
    this.socketSubscription?.unsubscribe();
    this.socket?.complete();
    this.signalStream.complete();
  }
}

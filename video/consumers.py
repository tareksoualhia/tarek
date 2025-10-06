from channels.generic.websocket import AsyncWebsocketConsumer
import json

class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"video_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"[WebSocket] Connected to room: {self.room_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"[WebSocket] Disconnected from room: {self.room_name}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print(f"[WebSocket] Received: {data}")

            # Optional: handle join message
            if data.get("type") == "join":
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "video_signal",
                        "message": json.dumps({
                            "info": f"{data.get('user', 'client')} joined room {self.room_name}",
                            "timestamp": data.get("timestamp")
                        })
                    }
                )
            else:
                # Forward signaling data (SDP, ICE)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "video_signal",
                        "message": text_data
                    }
                )
        except Exception as e:
            print(f"[WebSocket] Error in receive: {e}")

    async def video_signal(self, event):
        await self.send(text_data=event['message'])

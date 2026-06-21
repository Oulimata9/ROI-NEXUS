from fastapi import WebSocket


class MessageConnectionManager:
    def __init__(self):
        self._connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, entreprise_id: int) -> None:
        await websocket.accept()
        self._connections.setdefault(entreprise_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, entreprise_id: int) -> None:
        bucket = self._connections.get(entreprise_id, [])
        try:
            bucket.remove(websocket)
        except ValueError:
            pass

    async def broadcast(self, data: dict, entreprise_id: int) -> None:
        bucket = self._connections.get(entreprise_id, [])
        dead: list[WebSocket] = []
        for ws in bucket:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            try:
                bucket.remove(ws)
            except ValueError:
                pass


manager = MessageConnectionManager()

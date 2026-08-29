import asyncio
import websockets


async def test_websocket():
    uri = "ws://127.0.0.1:8000/ws/threats"

    async with websockets.connect(uri) as websocket:
        print("WebSocket connected successfully!")

        await websocket.send("test")

        print("Waiting for threat notification...")

        try:
            message = await asyncio.wait_for(
                websocket.recv(),
                timeout=10
            )

            print("Received:")
            print(message)

        except asyncio.TimeoutError:
            print("No threat received within 10 seconds.")


asyncio.run(test_websocket())
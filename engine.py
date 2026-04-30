import asyncio
import websockets
import json
import numpy as np
import os

# Tentativa de importar serial (Bluetooth), se falhar o código ainda roda
try:
    import serial
    HAS_SERIAL = True
except ImportError:
    HAS_SERIAL = False

class ObjectumXEngine:
    def __init__(self):
        self.state_x = 0.0
        self.stability = 1.0
        self.is_emulated = True
        print(">>> SISTEMA HÍBRIDO OBJECTUM X INICIALIZADO")

    def get_entropy(self):
        # Enquanto os jumpers não chegam, usamos entropia simulada
        # Isso garante que o site funcione AGORA
        fext = np.random.normal(0, 0.05)
        return fext

    def process_physics(self, fext):
        # Integral Quântica de Estado Contínuo
        self.state_x += fext * 0.1
        self.stability = np.clip(self.stability - (abs(fext) * 0.02), 0.1, 1.0)
        return self.state_x

async def handler(websocket):
    engine = ObjectumXEngine()
    try:
        while True:
            fext = engine.get_entropy()
            x = engine.process_physics(fext)
            
            # Dados para o Next.js
            data = {
                "x": round(x, 4),
                "stability": round(engine.stability, 4),
                "fext": round(fext, 4),
                "hadamard": round(np.sin(x)**2, 4),
                "status": "STABLE" if engine.stability > 0.4 else "CRITICAL",
                "hardware": "EMULATED"
            }
            
            await websocket.send(json.dumps(data))
            await asyncio.sleep(0.05)
    except websockets.ConnectionClosed:
        print(">>> Conexão com o site fechada.")

async def main():
    print("--- MAINFRAME ONLINE: Aguardando conexão do Next.js na porta 8765 ---")
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nSaindo do sistema...")
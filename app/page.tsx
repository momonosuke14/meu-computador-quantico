"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Bluetooth, Zap } from 'lucide-react';

export default function QuantumMainframe() {
  const [stats, setStats] = useState({
    x: 0,
    stability: 1.0,
    fext: 0,
    hadamard: 0,
    status: "OFFLINE",
    hardware: "DISCONNECTED"
  });

  useEffect(() => {
    // Conectando ao nosso engine.py na porta 8765
    const socket = new WebSocket('ws://localhost:8765');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(data);
    };

    socket.onclose = () => {
      setStats(prev => ({ ...prev, status: "OFFLINE", hardware: "ERROR" }));
    };

    return () => socket.close();
  }, []);

  const isCritical = stats.stability < 0.4;

  return (
    <main className="min-h-screen bg-black text-amber-500 p-8 font-mono selection:bg-amber-500 selection:text-black">
      
      {/* HEADER DO SISTEMA */}
      <div className="max-w-6xl mx-auto flex justify-between items-center border-b border-amber-900/30 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            OBJECTUM <span className="text-white bg-amber-600 px-2">𝓧</span>
          </h1>
          <p className="text-[10px] opacity-50 tracking-[0.3em] uppercase">Quantum Simulation v4.1 PilotOS Core</p>
        </div>
        
        <div className="flex gap-6 text-right">
          <div className="flex flex-col">
            <span className="text-[10px] opacity-40 uppercase">Hardware Link</span>
            <span className={`text-sm font-bold flex items-center gap-2 ${stats.hardware === 'EMULATED' ? 'text-blue-400' : 'text-green-500'}`}>
              <Bluetooth size={14} /> {stats.hardware}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] opacity-40 uppercase">System Status</span>
            <span className={`text-sm font-bold ${isCritical ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
              {stats.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PAINEL PRINCIPAL: ESTADO X */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-amber-900/20 p-8 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[12px] opacity-40 flex items-center gap-2 mb-4">
                <Activity size={12} /> WAVEFUNCTION AMPLITUDE (X)
              </span>
              <h2 className="text-7xl font-bold tracking-tighter text-white">
                {stats.x.toFixed(6)}
              </h2>
              <div className="mt-8 h-[100px] flex items-end gap-1">
                {/* Mini Gráfico de Barras */}
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${Math.abs(stats.x * 50) + Math.random() * 20}%` }}
                    className="flex-1 bg-amber-600/20 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
            {/* Efeito de Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
          </div>

          {/* GRID DE INFORMAÇÕES SECUNDÁRIAS */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-950 border border-amber-900/10 p-6 rounded-2xl">
              <p className="text-[10px] opacity-40 mb-2 uppercase">Entropia (Fext)</p>
              <p className="text-2xl font-bold text-amber-200">{stats.fext.toFixed(4)}</p>
            </div>
            <div className="bg-zinc-950 border border-amber-900/10 p-6 rounded-2xl">
              <p className="text-[10px] opacity-40 mb-2 uppercase">Hadamard Prob.</p>
              <p className="text-2xl font-bold text-amber-200">{(stats.hadamard * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* BARRA LATERAL: ESTABILIDADE E COERÊNCIA */}
        <div className="space-y-6">
          <div className={`p-8 rounded-3xl border transition-all duration-500 ${isCritical ? 'bg-red-950/20 border-red-500' : 'bg-zinc-950 border-amber-900/20'}`}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[12px] font-bold">ESTABILIDADE Ξ</span>
              <ShieldAlert size={18} className={isCritical ? 'text-red-500' : 'text-amber-500'} />
            </div>
            
            <div className="relative h-4 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
              <motion.div 
                animate={{ width: `${stats.stability * 100}%` }}
                className={`h-full ${isCritical ? 'bg-red-600' : 'bg-amber-500'}`}
              />
            </div>
            <p className="text-xs opacity-50 leading-relaxed">
              {isCritical 
                ? "ALERTA: Decoerência quântica detectada. Aproxime o hardware para recalibragem." 
                : "Sistema em equilíbrio termodinâmico. Fluxo de dados estável."}
            </p>
          </div>

          <div className="bg-zinc-950 border border-amber-900/10 p-8 rounded-3xl">
            <h4 className="text-[10px] opacity-40 mb-6 tracking-widest uppercase">Processador de Entropia</h4>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: Math.random() * 2, repeat: Infinity }}
                  className="h-2 w-full bg-amber-900/30 rounded-full"
                />
              ))}
            </div>
            <button className="w-full mt-8 py-3 border border-amber-500/20 rounded-xl text-[10px] hover:bg-amber-500 hover:text-black transition-all font-bold">
              RECALIBRAR NÚCLEO
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
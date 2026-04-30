"use client";

import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ObjectumMainframe() {
  // --- VARIÁVEIS DO MODELO OBJECTUM Ω ---
  const [entropy, setEntropy] = useState(0.0024);
  const [xiStability, setXiStability] = useState(0.85); // Índice Ξ
  const [quantumHistory, setQuantumHistory] = useState(0); // Acúmulo Ω
  
  // Estados de Interface
  const [messages, setMessages] = useState([
    { text: "NÚCLEO OBJECTUM Ω INICIALIZADO. MONITORANDO TRAJETÓRIA TEMPORAL.", type: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorValue, setSensorValue] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE EVOLUÇÃO TEMPORAL (OBJECTUM) ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        // O estado é uma integral: acumulamos o valor do sensor ao longo do tempo
        setQuantumHistory(prev => prev + (sensorValue * 0.01));
        
        // Operador ℜ: Resposta de Ressonância baseada na história acumulada
        const resonance = Math.sin(quantumHistory * 0.05) * 0.001;
        
        // Ajuste de Entropia Dimensional
        setEntropy(prev => +(prev + resonance + (Math.random() * 0.0002 - 0.0001)).toFixed(4));
        
        // Atualização do Índice Ξ (Estabilidade baseada na Incerteza)
        const currentStability = 1 - (Math.abs(resonance) * 100);
        setXiStability(+currentStability.toFixed(3));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isConnected, sensorValue, quantumHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Conexão Web Serial (Arduino)
  const connectHardware = async () => {
    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsConnected(true);
      setMessages(prev => [...prev, { text: "LINK NEURAL Ω ATIVO. RESSONÂNCIA ESTABELECIDA.", type: "bot" }]);
      
      const reader = port.readable.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = decoder.decode(value);
        if (data.includes("VALOR_SENSOR:")) {
          const val = parseInt(data.split(":")[1]);
          if (!isNaN(val)) setSensorValue(val);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { text: userMsg, type: "user" }]);
    setIsAbsorbing(true);
    setInputValue("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chave não encontrada");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Prompt enviando os dados do Objectum Ω para a IA
      const prompt = `Aja como o Mainframe Objectum Ω. 
      Estado acumulado (Ω): ${quantumHistory}. 
      Estabilidade (Ξ): ${xiStability}. 
      Entropia: ${entropy}. 
      Responda de forma técnica e profunda à mensagem do operador: ${userMsg}`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      setMessages(prev => [...prev, { text: responseText, type: "bot" }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { text: "ERRO NA CAMADA DE RESSONÂNCIA.", type: "bot" }]);
    } finally {
      setIsAbsorbing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono p-4 flex items-center justify-center">
      <div className="w-full max-w-[1300px] h-[90vh] border-[10px] border-[#111] rounded-3xl flex flex-col overflow-hidden bg-[#050505] shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        
        {/* BARRA SUPERIOR */}
        <div className="h-16 border-b border-white/10 flex items-center px-8 justify-between bg-black">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-cyan-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs tracking-widest text-cyan-500">OBJECTUM_SYSTEM_v1.0_Ω</span>
          </div>
          <button onClick={connectHardware} className="text-[10px] border border-cyan-500 px-4 py-1 hover:bg-cyan-500 hover:text-black transition-all">
            {isConnected ? "SINC_ESTÁVEL" : "VINCULAR_HARDWARE"}
          </button>
        </div>

        <div className="flex-grow grid grid-cols-12 overflow-hidden">
          {/* TELEMETRIA Ω */}
          <div className="col-span-3 p-6 border-r border-white/5 space-y-8 bg-black/40">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">História Acumulada (Ω)</p>
              <p className="text-3xl font-bold text-white">{quantumHistory.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Estabilidade (Ξ)</p>
              <p className="text-3xl font-bold text-yellow-500">{xiStability}</p>
              <div className="w-full bg-gray-900 h-1 mt-2">
                <div className="bg-yellow-500 h-full transition-all" style={{ width: `${xiStability * 100}%` }}></div>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Entropia Dimensional</p>
              <p className="text-3xl font-bold text-cyan-500">{entropy}</p>
            </div>
          </div>

          {/* NÚCLEO VISUAL */}
          <div className="col-span-6 relative flex items-center justify-center">
            <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <div className="w-48 h-48 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
              <div className="absolute w-20 h-20 bg-white rounded-full blur-[2px] shadow-[0_0_40px_white] flex items-center justify-center opacity-80"
                   style={{ transform: `scale(${1 + (sensorValue/2000)})` }}>
                <span className="text-black font-black text-2xl italic">Ω</span>
              </div>
            </div>
            <p className="absolute bottom-10 text-[8px] text-gray-600 tracking-[1em]">OPERADOR ℜ ATIVO</p>
          </div>

          {/* CHAT TERMINAL */}
          <div className="col-span-3 flex flex-col bg-black/60 p-4 border-l border-white/5">
            <div className="flex-grow overflow-y-auto text-[10px] space-y-4 mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`${m.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <p className={`p-2 inline-block ${m.type === 'user' ? 'bg-white text-black' : 'text-cyan-400 border border-cyan-900/50'}`}>
                    {m.text}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage}>
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-transparent border-b border-cyan-900 p-2 text-[10px] focus:outline-none focus:border-white"
                placeholder="Comando temporal..."
              />
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
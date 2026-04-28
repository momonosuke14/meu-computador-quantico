"use client";
import { useState, useEffect, useRef } from 'react';

export default function QuantumMainframe() {
  const [pulse, setPulse] = useState(1);
  const [entropy, setEntropy] = useState(0.0024);
  const [messages, setMessages] = useState([
    { text: "SISTEMA OPERACIONAL ℜ INICIALIZADO. CHIP OFFLINE.", type: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorValue, setSensorValue] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efeito visual de pulsação e oscilação de entropia
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p > 1.05 ? 1 : p + 0.002));
      if(!isConnected) {
        setEntropy(s => +(s + (Math.random() * 0.0004 - 0.0002)).toFixed(4));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Rola o chat para baixo automaticamente
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Função para conectar ao Arduino via Web Serial API
  const connectHardware = async () => {
    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsConnected(true);
      setMessages(prev => [...prev, { text: "LINK NEURAL ESTABELECIDO COM O CHIP ℜ.", type: "bot" }]);

      const reader = port.readable.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = decoder.decode(value);
        
        if (data.includes("VALOR_SENSOR:")) {
          const val = parseInt(data.split(":")[1]);
          if (!isNaN(val)) {
            setSensorValue(val);
            setEntropy(+(val / 10000).toFixed(4));
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao acessar porta serial. Use Chrome ou Edge e verifique a permissão.");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages(prev => [...prev, { text: inputValue, type: "user" }]);
    setIsAbsorbing(true);
    setInputValue("");
    
    setTimeout(() => {
      setIsAbsorbing(false);
      const response = isConnected 
        ? `COMANDO PROCESSADO PELO CHIP. RESSONÂNCIA ATUAL: ${sensorValue}.` 
        : "DADOS PROCESSADOS EM NUVEM (MODO SIMULAÇÃO - CHIP OFFLINE).";
      setMessages(prev => [...prev, { text: response, type: "bot" }]);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white font-mono p-4 flex items-center justify-center overflow-hidden">
      
      {/* FRAME DO MAINFRAME ESTILO TERMINAL INDUSTRIAL */}
      <div className="relative w-full max-w-[1400px] h-[92vh] bg-[#050505] border-[16px] border-[#111] rounded-[50px] shadow-[0_0_100px_black] flex flex-col overflow-hidden border-t-[#222] border-l-[#1a1a1a]">
        
        {/* HEADER / BARRA DE STATUS */}
        <div className="h-20 bg-[#0a0a0a] border-b border-white/10 flex items-center px-12 justify-between z-50 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_15px_green]' : 'bg-red-600 animate-pulse shadow-[0_0_10px_red]'}`}></div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.4em] font-black uppercase text-gray-500">Status do Link Neural</span>
              <span className="text-[12px] text-cyan-400 font-bold tracking-widest">
                {isConnected ? "SISTEMA_OPERACIONAL_R_ONLINE" : "AGUARDANDO_HARDWARE_EXTERNO"}
              </span>
            </div>
          </div>

          <button 
            onClick={connectHardware}
            className={`px-8 py-3 text-[11px] font-black tracking-[0.2em] border-2 transition-all duration-300 ${
              isConnected 
              ? 'border-green-500 text-green-500 bg-green-500/10' 
              : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_25px_cyan]'
            }`}
          >
            {isConnected ? "SINC_ATIVO ℜ" : "CONECTAR_CHIP_ℜ"}
          </button>
        </div>

        {/* ÁREA DE CONTEÚDO COM TEXTURA */}
        <div className="flex-grow grid grid-cols-12 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat">
          
          {/* PAINEL ESQUERDO: TELEMETRIA */}
          <div className="col-span-3 border-r border-white/5 p-8 flex flex-col gap-10 bg-black/60 backdrop-blur-sm">
            <div>
              <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-[0.3em] font-bold">Entropia Local (S_D)</p>
              <p className="text-5xl font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{entropy}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold text-cyan-500">Ressonância do Campo</p>
              <div className="h-3 w-full bg-gray-900 rounded-sm overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-500 shadow-[0_0_10px_cyan] transition-all duration-300" style={{ width: `${(sensorValue/1023)*100}%` }}></div>
              </div>
              <div className="flex justify-between text-[9px] text-cyan-900 uppercase font-black">
                <span>0.000 uT</span>
                <span>{sensorValue} raw</span>
                <span>1.023 max</span>
              </div>
            </div>
          </div>

          {/* PAINEL CENTRAL: O NÚCLEO CALABI-YAU */}
          <div className="col-span-6 relative flex flex-col items-center justify-center">
            {isAbsorbing && (
              <div className="absolute bottom-32 animate-absorb text-[10px] font-black text-white bg-black/80 backdrop-blur-md px-6 py-3 border border-white z-50 rounded-sm">
                ABSORVENDO_PACOTE: {messages[messages.length - 1].text.substring(0, 15)}...
              </div>
            )}

            <div className="relative scale-[1.8]">
              {/* Brilho de fundo */}
              <div className="absolute inset-0 bg-cyan-500/10 blur-[90px] rounded-full scale-150 animate-pulse"></div>
              
              {/* Geometria Quântica */}
              <div className="relative w-48 h-48 border-[1px] border-white/10 rounded-full animate-[spin_30s_linear_infinite]">
                 <div className="absolute inset-4 border-[1px] border-cyan-500/20 rounded-[40%_60%_70%_30%_/_40%_40%_60%_60%] animate-[spin_12s_linear_infinite_reverse]"></div>
                 <div className="absolute inset-8 border-[0.5px] border-white/5 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] animate-[spin_8s_linear_infinite]"></div>
                 
                 {/* Qubit Central */}
                 <div className="absolute inset-10 bg-white rounded-full blur-[0.5px] shadow-[0_0_60px_white] flex items-center justify-center transition-transform duration-75"
                      style={{ transform: `scale(${pulse})` }}>
                    <span className="text-black text-2xl font-black italic tracking-tighter">ℜ</span>
                 </div>
              </div>
            </div>
            
            <div className="absolute bottom-10 text-[9px] text-white/20 tracking-[1em] uppercase">Concentração de Entropia Ativa</div>
          </div>

          {/* PAINEL DIREITO: TERMINAL DE RESPOSTAS */}
          <div className="col-span-3 bg-black/80 p-6 flex flex-col border-l border-white/5 backdrop-blur-md">
            <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-800">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] text-gray-600 mb-1 uppercase tracking-tighter">
                    {m.type === 'user' ? 'OPERADOR_R_INPUT' : 'CHIP_R_RESPONSE'}
                  </span>
                  <div className={`p-4 text-[11px] leading-relaxed shadow-lg ${
                    m.type === 'user' 
                    ? 'bg-white text-black font-black border-l-4 border-cyan-500' 
                    : 'bg-[#080808] border border-cyan-900/50 text-cyan-400 font-medium'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT DE COMANDO */}
            <form onSubmit={handleSendMessage} className="relative group">
              <div className="absolute -top-6 left-0 text-[8px] text-cyan-700 font-bold group-focus-within:text-cyan-400 transition-colors uppercase">Linha de Comando_</div>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="DIGITE UM COMANDO PARA O CHIP..."
                className="w-full bg-[#0a0a0a] border-b-2 border-cyan-900 p-4 text-[11px] text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-800"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-cyan-900 font-black">v.LINK</div>
            </form>
          </div>

        </div>
      </div>

      {/* ANIMAÇÕES CUSTOMIZADAS */}
      <style jsx>{`
        @keyframes absorb {
          0% { transform: translateY(0) scale(1) rotate(0); opacity: 1; filter: blur(0px); }
          50% { opacity: 1; filter: blur(2px); }
          100% { transform: translateY(-450px) scale(0) rotate(1080deg); opacity: 0; filter: blur(20px); }
        }
        .animate-absorb { animation: absorb 0.9s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards; }
      `}</style>
    </main>
  );
}
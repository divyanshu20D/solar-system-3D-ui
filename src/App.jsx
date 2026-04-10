import { useState, useCallback } from "react";
import { Scene } from "./components/SolarSystem/Scene";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  X,
  Zap,
  Globe,
  Compass,
  Shield,
  Cpu,
  Activity,
  Database,
  Layers,
  Lock,
  Terminal,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const FeatureCard = ({ title, desc, icon: Icon, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bento-card group ${className}`}
  >
    <div className="flex flex-col h-full">
      <div className="mb-4 p-3 bg-white/5 border border-white/10 w-fit rounded-sm group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all">
        <Icon className="w-6 h-6 text-white group-hover:text-blue-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 tracking-tight uppercase">
          {title}
        </h3>
        <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
      </div>
    </div>
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ChevronRight className="w-5 h-5 text-blue-400" />
    </div>
  </motion.div>
);

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handleSelectPlanet = useCallback((planet) => {
    setSelectedPlanet(planet);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-space-900 overflow-x-hidden selection:bg-blue-500/30">
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Scene
          onSelectPlanet={handleSelectPlanet}
          selectedPlanet={selectedPlanet}
        />
      </div>

      {/* Content Wrapper (Scrollable - Events pass through) */}
      <div className="relative z-10 pointer-events-none">
        {/* Navigation */}
        <nav className="w-full flex justify-between items-center p-6 md:px-12 backdrop-blur-md bg-black/20 border-b border-white/5 fixed top-0 z-50 pointer-events-auto">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-blue-500/50 transition-all">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">
              COSMIC
              <span className="text-blue-500 underline decoration-2 underline-offset-4">
                CORE
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-bold">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Protocol
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terminal
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Satellite
            </a>
            <button className="px-6 py-2 bg-white text-black hover:bg-blue-400 hover:text-white transition-all">
              Connect
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="h-screen w-full flex flex-col justify-center px-6 md:px-12 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-blue-500"></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">
                System Online // v4.02
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase">
              Beyond the <br />
              <span className="text-gradient">Static Void</span>
            </h2>
            <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-xl">
              Next-generation spatial awareness and telemetry orchestration.
              Explore the solar system through high-fidelity rendering and
              real-time gravitational data processing.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors border border-blue-400/50">
                Initialize System
              </button>
              <button className="px-10 py-4 border border-white/10 bg-white/5 backdrop-blur-md font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                View Data
              </button>
            </div>
          </motion.div>
        </section>

        {/* Bento Grid Mid-Section (Blocks background interaction for clarity) */}
        <section className="py-24 px-6 md:px-12 bg-black/40 backdrop-blur-sm border-y border-white/5 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                  Core Infrastructure
                </h2>
                <p className="text-white/40 uppercase tracking-widest text-xs font-bold leading-loose">
                  Our system architecture is designed for deep space resilience
                  & real-time telemetry processing across multiple planetary
                  hubs.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
                  Latency
                </p>
                <p className="text-xl font-mono text-green-400">1.02ms</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-full md:h-[600px]">
              <FeatureCard
                className="md:col-span-3 md:row-span-2"
                title="Neural Telemetry"
                desc="Quantum-encrypted data streams from over 14,000 deep-space probes, providing real-time surface metrics and atmospheric dynamics across the entire cluster."
                icon={Activity}
              />
              <FeatureCard
                className="md:col-span-3 md:row-span-1"
                title="Secure Core"
                desc="Military-grade redundancy for all celestial coordination protocols and satellite alignment."
                icon={Lock}
              />
              <FeatureCard
                className="md:col-span-1 md:row-span-1"
                title="Relay"
                desc="Fast data."
                icon={Layers}
              />
              <FeatureCard
                className="md:col-span-2 md:row-span-1"
                title="Processing"
                desc="24.5 exaflops of raw spatial power."
                icon={Cpu}
              />
            </div>
          </div>
        </section>

        {/* Feature List Section (Standard) */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <Terminal className="w-10 h-10 text-blue-500" />
              <h4 className="text-2xl font-bold uppercase tracking-tight">
                Real-time Terminal
              </h4>
              <p className="text-white/40 text-sm leading-relaxed">
                Direct command-line access to our satellite constellation for
                immediate redirect and focus on target coordinates.
              </p>
            </div>
            <div className="space-y-4">
              <Layers className="w-10 h-10 text-rose-500" />
              <h4 className="text-2xl font-bold uppercase tracking-tight">
                Planetary Layers
              </h4>
              <p className="text-white/40 text-sm leading-relaxed">
                Multi-spectral imaging across X-ray, Infrared, and Ultraviolet
                spectrums for deep core analysis of planetary bodies.
              </p>
            </div>
            <div className="space-y-4">
              <BarChart3 className="w-10 h-10 text-yellow-500" />
              <h4 className="text-2xl font-bold uppercase tracking-tight">
                Growth Metrics
              </h4>
              <p className="text-white/40 text-sm leading-relaxed">
                Advanced predictive modeling for gravitational shifts and
                planetary development over the next millennium.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-12 border-t border-white/5 flex flex-col items-center gap-8 bg-black/60 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-black tracking-tighter uppercase">
              Cosmic Core
            </span>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">
            © 2025 Cosmic Core Systems // All Rights Reserved
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <a href="#" className="hover:text-blue-500">
              Security
            </a>
            <a href="#" className="hover:text-blue-500">
              Logistics
            </a>
            <a href="#" className="hover:text-blue-500">
              Legal
            </a>
          </div>
        </footer>
      </div>

      {/* Planet Info Modal (Floating Action) */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 right-12 w-full max-w-md z-[100] pointer-events-auto"
          >
            <div className="glass-panel p-8 border-b-4 border-b-blue-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">
                    {selectedPlanet.name}
                  </h3>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">
                    Satellite Tracking Active
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="p-2 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 border border-white/5">
                  <p className="text-[8px] text-white/30 uppercase mb-1">
                    Distance
                  </p>
                  <p className="font-mono text-lg font-bold">
                    {selectedPlanet.distance} AU
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/5">
                  <p className="text-[8px] text-white/30 uppercase mb-1">
                    Stability
                  </p>
                  <p className="font-mono text-lg font-bold text-green-400">
                    99.8%
                  </p>
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-xs transition-colors">
                Initialize Surface Scan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Shield, Zap } from "lucide-react";
import Link from "next/link";
import "./page.module.css";

export default function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            EnvForge Agent v0.2.0 is now live
          </div>
          <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem', textWrap: 'balance' }}>
            Provision ML Environments with <span className="text-gradient">Zero Guesswork</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Deterministic, safe, and platform-aware setup scripts for PyTorch, TensorFlow, and more. Stop fighting CUDA mismatches.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/profiles" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Browse Profiles
            </Link>
            <Link href="/diagnose" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Diagnose System
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Code Snippet / Demo Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <motion.div 
          className="glass-panel"
          style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'var(--brand-primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#e4e4e7', overflowX: 'auto', lineHeight: 1.5 }}>
            <code>
<span style={{ color: '#ec4899' }}>$</span> envforge diagnose --send --api-url http://localhost:8000<br/>
<br/>
<span style={{ color: '#10b981' }}>✓</span> OS: Ubuntu 22.04.4 LTS (x86_64)<br/>
<span style={{ color: '#10b981' }}>✓</span> CPU: Intel(R) Core(TM) i9-13900K (24 cores)<br/>
<span style={{ color: '#10b981' }}>✓</span> RAM: 64.0 GB total<br/>
<span style={{ color: '#10b981' }}>✓</span> GPU: NVIDIA GeForce RTX 4090 (24.0 GB VRAM)<br/>
<span style={{ color: '#10b981' }}>✓</span> CUDA: 12.1 (cuDNN: 8.9.0)<br/>
<br/>
<span style={{ color: '#6366f1' }}>ℹ</span> Sent diagnostic report to EnvForge API.<br/>
<span style={{ color: '#6366f1' }}>ℹ</span> Matched Profile: pytorch-cuda (PyTorch 2.1.2 + cu121)<br/>
            </code>
          </pre>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container">
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Why EnvForge?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          
          <FeatureCard 
            icon={<Cpu size={32} color="var(--brand-primary)" />}
            title="Deterministic Engine"
            description="No AI hallucinations guessing your package versions. Our engine uses a strict matrix of known-good combinations."
          />
          <FeatureCard 
            icon={<Shield size={32} color="var(--brand-secondary)" />}
            title="Safety Filtered"
            description="Generated scripts are piped through a regex-based Safety Filter that actively blocks destructive shell commands."
          />
          <FeatureCard 
            icon={<Zap size={32} color="#eab308" />}
            title="Cross-Platform"
            description="Native support for Ubuntu, WSL2, and Windows PowerShell out of the box."
          />
          <FeatureCard 
            icon={<Terminal size={32} color="var(--brand-accent)" />}
            title="Offline Agent"
            description="The CLI diagnostic agent works completely offline to scan your hardware without phoning home."
          />

        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="glass-panel"
      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      whileHover={{ y: -5, boxShadow: 'var(--shadow-glow)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{description}</p>
    </motion.div>
  );
}

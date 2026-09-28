import { memo, useMemo } from "react";
import { motion } from "framer-motion";

function AnimatedBackgroundInner() {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return <div className="fixed inset-0 -z-10" />;
  }

  const particles = useMemo(() => {
    const isClient = typeof window !== "undefined";
    const width = isClient ? window.innerWidth : 1200;
    const height = isClient ? window.innerHeight : 800;
    const count = width < 768 ? 12 : 24;
    return Array.from({ length: count }).map((_, i) => ({
      key: i,
      x0: Math.random() * width,
      y0: Math.random() * height,
      x1: Math.random() * width,
      y1: Math.random() * height,
      size: Math.random() > 0.7 ? 2 : 1.5,
      opacity: 0.15 + Math.random() * 0.2,
      duration: 12 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none will-change-transform">
      {/* Particules subtiles */}
      {particles.map((p) => (
        <motion.div
          key={p.key}
          className="absolute bg-white rounded-full"
          style={{ width: p.size, height: p.size }}
          initial={{ x: p.x0, y: p.y0, opacity: p.opacity * 0.5 }}
          animate={{
            x: [p.x0, p.x1, p.x0],
            y: [p.y0, p.y1, p.y0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Orbes vaporeuses lentes */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-white/5 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -right-20 w-[28rem] h-[28rem] bg-gradient-to-bl from-purple-500/8 via-white/5 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -60, 40, 0],
          scale: [1.1, 0.95, 1.15, 1.1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-80 h-80 bg-gradient-to-t from-blue-400/8 via-white/5 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 20, 0],
          scale: [0.95, 1.1, 1, 0.95],
          opacity: [0.18, 0.28, 0.18],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default memo(AnimatedBackgroundInner);
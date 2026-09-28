import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Curseur artistique discret : un petit orbe qui suit la souris avec un léger délai.
 * Visible uniquement sur desktop (pointer: fine). N'interfère pas avec le curseur système.
 */
export default function ArtCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFine, setIsFine] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFine(mq.matches);
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };
    const onLeave = () => setIsVisible(false);
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      setIsHovering(!!target.closest('a, button, [role="button"], .artwork-card, img'));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!isFine) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        opacity: isVisible ? 1 : 0,
        width: isHovering ? 28 : 14,
        height: isHovering ? 28 : 14,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)",
          boxShadow: isHovering
            ? "0 0 20px 6px rgba(255,255,255,0.18)"
            : "0 0 8px 2px rgba(255,255,255,0.12)",
        }}
      />
    </motion.div>
  );
}

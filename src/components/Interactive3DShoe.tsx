import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Interactive3DShoeProps {
  imageSrc: string;
  altText: string;
  tagline?: string;
  brandTag?: string;
  badge?: string;
  floatingPills?: { label: string; value: string; icon?: React.ReactNode }[];
  className?: string;
  onCtaClick?: () => void;
}

export const Interactive3DShoe: React.FC<Interactive3DShoeProps> = ({
  imageSrc,
  altText,
  tagline = 'Engineered for Performance & Craft',
  brandTag = 'DROP EXCLUSIVE',
  badge = 'LIMITED EDITION',
  floatingPills = [],
  className = '',
  onCtaClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse coordinates (-0.5 to 0.5) and hover state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const hoverValue = useMotionValue(0);

  // Smooth springs for 60fps buttery response
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const shoeTranslateZ = useSpring(useTransform(hoverValue, [0, 1], [0, 45]), springConfig);
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverValue.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    hoverValue.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className={`relative w-full select-none cursor-pointer group ${className}`}
      onClick={onCtaClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] rounded-3xl bg-gradient-to-br from-neutral-900/90 via-neutral-950 to-black border border-neutral-800/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* Layer 1: Ambient Dynamic Lighting Glow */}
        <motion.div
          style={{
            left: `${glowX}%`,
            top: `${glowY}%`,
          }}
          className="absolute w-72 h-72 sm:w-96 sm:h-96 -translate-x-1/2 -translate-y-1/2 bg-radial from-amber-500/20 via-orange-500/10 to-transparent blur-3xl pointer-events-none rounded-full"
        />

        {/* Layer 2: Deep Background Kinetic Typography */}
        <div
          style={{ transform: 'translateZ(-30px)' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        >
          <span className="text-[100px] sm:text-[140px] lg:text-[180px] font-black text-white/4 tracking-tighter uppercase whitespace-nowrap">
            FOOTVERA
          </span>
        </div>

        {/* Layer 3: Top Header Pill & Badge */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="flex items-center justify-between z-10"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {brandTag}
            </span>
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3 py-1 rounded-full backdrop-blur-md">
            {badge}
          </span>
        </div>

        {/* Layer 4: Featured High-Res 3D Floating Shoe Image with Shadow */}
        <div
          style={{ transform: 'translateZ(60px)' }}
          className="relative my-auto flex items-center justify-center py-4 z-20"
        >
          {/* Dynamic 3D Contact Shadow */}
          <motion.div
            style={{
              scale: useTransform(shoeTranslateZ, [0, 45], [0.85, 1.15]),
              opacity: useTransform(shoeTranslateZ, [0, 45], [0.4, 0.7]),
            }}
            className="absolute -bottom-4 w-3/4 h-8 bg-black/80 blur-xl rounded-full pointer-events-none"
          />

          <motion.img
            src={imageSrc}
            alt={altText}
            referrerPolicy="no-referrer"
            style={{
              translateZ: shoeTranslateZ,
            }}
            className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Interactive Floating Micro-Pills */}
          {floatingPills.map((pill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              style={{
                transform: `translateZ(${40 + idx * 15}px)`,
              }}
              className={`absolute ${
                idx === 0
                  ? 'top-2 right-2 sm:top-4 sm:right-4'
                  : 'bottom-2 left-2 sm:bottom-4 sm:left-4'
              } px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xl border border-neutral-700/80 text-white shadow-xl flex items-center gap-2 pointer-events-none`}
            >
              {pill.icon}
              <div>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold">
                  {pill.label}
                </span>
                <span className="text-xs font-black text-amber-300 block">
                  {pill.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Layer 5: Card Bottom Info & Hint */}
        <div
          style={{ transform: 'translateZ(35px)' }}
          className="flex items-end justify-between z-10 pt-4 border-t border-neutral-800/80"
        >
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400 block mb-0.5">
              Interactive 3D Preview
            </span>
            <p className="text-xs sm:text-sm font-bold text-neutral-200">
              {tagline}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 bg-neutral-900/90 px-2.5 py-1 rounded-lg border border-neutral-800">
            <span>Hover to Tilt</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

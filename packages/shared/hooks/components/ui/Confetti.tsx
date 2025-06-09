/**
 * Confetti Component
 * GOAL: Fun, accessible confetti animation for gamification and celebration.
 * Usage: Show on milestone achievements (e.g., streaks, badges).
 */

import React, { useEffect, useRef } from "react";

export interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = 400;
    const H = canvas.height = 200;
    const confettiCount = 80;
    const confettiColors = ["#6366f1", "#f59e42", "#22c55e", "#ef4444", "#fbbf24", "#3b82f6", "#a21caf"];
    const confetti: { x: number; y: number; r: number; d: number; color: string; tilt: number; tiltAngle: number; }[] = [];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * W,
        y: Math.random() * -H,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
      });
    }

    let frame = 0;
    let animationFrame: number;

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (let i = 0; i < confettiCount; i++) {
        const c = confetti[i];
        ctx!.beginPath();
        ctx!.lineWidth = c.r;
        ctx!.strokeStyle = c.color;
        ctx!.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx!.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 3);
        ctx!.stroke();
      }
      update();
      frame++;
      if (frame < 120) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        if (onComplete) onComplete();
      }
    }

    function update() {
      for (let i = 0; i < confettiCount; i++) {
        const c = confetti[i];
        c.y += Math.cos(c.d) + 2 + c.r / 2;
        c.x += Math.sin(frame / 10) * 2;
        c.tilt = Math.sin(frame / 10 + i) * 15;
        if (c.y > H) {
          c.y = Math.random() * -20;
          c.x = Math.random() * W;
        }
      }
    }

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [trigger, onComplete]);

  return (
    <canvas
      ref={ref}
      width={400}
      height={200}
      aria-label="Confetti celebration"
      style={{ pointerEvents: "none", background: "transparent", position: "absolute", left: 0, top: 0, zIndex: 50 }}
      tabIndex={-1}
    />
  );
};

export default Confetti;

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas尺寸为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 创建粒子
    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.floor(
      (window.innerWidth * window.innerHeight) / 15000
    );

    const colors = [
      "#ffffff", // 白色
      "#a78bfa", // 紫色
      "#818cf8", // 蓝紫色
      "#60a5fa", // 蓝色
      "#4ade80", // 绿色
      "#fb7185", // 粉红色
      "#fbbf24", // 琥珀色
      "#38bdf8", // 亮蓝色
      "#f472b6", // 玫瑰红
      "#a3e635", // 浅绿色
      "#93c5fd", // 浅蓝色
      "#c084fc", // 浅紫色
      "#fcd34d", // 浅黄色
      "#6ee7b7", // 薄荷绿
      "#bae6fd", // 浅蓝色变体
    ];

    for (let i = 0; i < numberOfParticles; i++) {
      // 将粒子大小从原来的 0.5-2 增加到 1-3
      const radius = Math.random() * 2 + 1;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      // 将粒子速度从原来的 -0.15-0.15 增加到 -0.5-0.5
      const speedX = (Math.random() - 0.5) * 1;
      const speedY = (Math.random() - 0.5) * 1;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particlesArray.push({ x, y, radius, color, speedX, speedY });
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制和更新粒子
      particlesArray.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // 更新粒子位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }

        // 连接相近的粒子
        particlesArray.forEach((otherParticle, index) => {
          if (particle === otherParticle) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 - distance / 500})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    // 清理函数
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-1" />
  );
};

export default ParticleBackground;

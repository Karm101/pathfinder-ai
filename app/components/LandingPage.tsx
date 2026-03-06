"use client";
import { Brain, Target, TrendingUp } from "lucide-react";
import { GetStartedButton } from "./landing-page/GetStartedButton";
import { useState, useEffect } from "react";

type Star = { top: string; left: string; size: string; opacity: number };

function FeatureCard({
  delay,
  icon,
  title,
  description,
  iconBg,
  iconBorder,
  iconColor,
  glowColor,
}: {
  delay: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  glowColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 text-center animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        boxShadow: hovered ? `0 0 0 1px ${glowColor}99, 0 0 20px 4px ${glowColor}33` : "none",
        borderColor: hovered ? `${glowColor}99` : undefined,
      }}
    >
      <div className={`inline-flex items-center justify-center p-3 ${iconBg} rounded-full ${iconBorder} mb-4`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

export function LandingPage() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() > 0.85 ? "2px" : "1px",
        opacity: Math.random() * 0.5 + 0.1,
      }))
    );
  }, []);

  const fadeIn = (delay: number) => ({
    style: { animationDelay: `${delay}ms` },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">

          {/* Bobbing Brain Logo */}
          <div
            className="mb-6 animate-fade-in-up"
            style={{
              animation: "fadeInUp 0.6s ease both, bob 3s ease-in-out infinite",
            }}
          >
            <div
              className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full border border-blue-500/20"
              style={{
                filter: "drop-shadow(0 0 12px rgba(96,165,250,0.6)) drop-shadow(0 0 28px rgba(96,165,250,0.3))",
              }}
            >
              <Brain className="size-16 text-blue-400" />
            </div>
          </div>

          {/* Title */}
          <h1
            {...fadeIn(150)}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 animate-fade-in-up"
          >
            Pathfinder
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> AI</span>
          </h1>

          {/* Subtitle */}
          <p
            {...fadeIn(300)}
            className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-6 animate-fade-in-up"
          >
            Your personalized IT career roadmap.
          </p>

          {/* Description */}
          <p
            {...fadeIn(400)}
            className="text-lg text-slate-400 mb-10 max-w-xl animate-fade-in-up"
          >
            Bridge the gap between your current skills and dream IT career. Get
            data-driven insights and a step-by-step learning plan tailored just for you.
          </p>

          <GetStartedButton animationDelay={500} />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 pb-16">
          <FeatureCard
            delay={600}
            icon={<Target className="size-8" />}
            title="Skill Gap Analysis"
            description="Visualize exactly where you stand and what skills you need to develop for your target role."
            iconBg="bg-blue-500/10"
            iconBorder="border border-blue-500/20"
            iconColor="text-blue-400"
            glowColor="#60a5fa"
          />
          <FeatureCard
            delay={750}
            icon={<TrendingUp className="size-8" />}
            title="Personalized Roadmap"
            description="Get a customized learning path with actionable steps to reach your career goals."
            iconBg="bg-cyan-500/10"
            iconBorder="border border-cyan-500/20"
            iconColor="text-cyan-400"
            glowColor="#22d3ee"
          />
          <FeatureCard
            delay={900}
            icon={<Brain className="size-8" />}
            title="Data-Driven Insights"
            description="Make informed decisions based on industry standards and role requirements."
            iconBg="bg-purple-500/10"
            iconBorder="border border-purple-500/20"
            iconColor="text-purple-400"
            glowColor="#a78bfa"
          />
        </div>
      </div>
    </div>
  );
}
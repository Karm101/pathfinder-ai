"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRight, Brain, Target, TrendingUp } from "lucide-react";

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="mb-8 inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
            <Brain className="size-12 text-blue-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl">
            Your Personalized IT Career
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Roadmap</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl">
            Bridge the gap between your current skills and dream IT career. Get data-driven insights and a step-by-step learning plan tailored just for you.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => router.push('/input')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
          >
            Get Started <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 pb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
              <Target className="size-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Skill Gap Analysis</h3>
            <p className="text-slate-400">
              Visualize exactly where you stand and what skills you need to develop for your target role.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-4">
              <TrendingUp className="size-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Personalized Roadmap</h3>
            <p className="text-slate-400">
              Get a customized learning path with actionable steps to reach your career goals.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4">
              <Brain className="size-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Data-Driven Insights</h3>
            <p className="text-slate-400">
              Make informed decisions based on industry standards and role requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

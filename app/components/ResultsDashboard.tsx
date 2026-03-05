"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, Circle, Loader2, TrendingUp, MapPin, Building2, GraduationCap, BarChart2, Lightbulb, Map } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

interface RadarSkill    { skill: string; current: number; required: number; }
interface PrioritySkill { skill: string; gap: number; }
interface RoadmapPhase  {
  phase: string;
  title: string;
  duration_months: number;
  description: string;
  skills: string[];
}
interface AnalysisResult {
  radar_skills: RadarSkill[];
  priority_skills: PrioritySkill[];
  analysis: string;
  roadmap: RoadmapPhase[];
}

type Star = { top: string; left: string; size: string; opacity: number };

// Skill category color mapping
const SKILL_COLORS: Record<string, string> = {
  // Languages
  "javascript": "#f7df1e", "python": "#3776ab", "java": "#ed8b00", "typescript": "#3178c6",
  "c++": "#00599c", "c#": "#239120", "ruby": "#cc342d", "php": "#777bb4",
  // Frontend
  "react": "#61dafb", "html/css": "#e34f26", "tailwind css": "#38bdf8", "next.js": "#ffffff",
  "vue.js": "#42b883", "angular": "#dd0031", "figma": "#f24e1e",
  // Backend / DevOps
  "node.js": "#339933", "docker": "#2496ed", "kubernetes": "#326ce5", "aws": "#ff9900",
  "azure": "#0089d6", "git": "#f05032", "linux": "#fcc624", "terraform": "#7b42bc",
  // Data
  "sql": "#336791", "postgresql": "#336791", "mongodb": "#47a248", "mysql": "#4479a1",
  "tableau": "#e97627", "power bi": "#f2c811", "pandas": "#150458",
  // ML/AI
  "tensorflow": "#ff6f00", "pytorch": "#ee4c2c", "machine learning": "#0ea5e9",
  // Design/UX
  "user research": "#8b5cf6", "prototyping": "#a78bfa", "design systems": "#6d28d9",
  "accessibility": "#10b981", "usability testing": "#059669", "interaction design": "#7c3aed",
  // Default
  "default": "#64748b",
};

function getSkillColor(skill: string): string {
  const key = skill.toLowerCase();
  return SKILL_COLORS[key] || SKILL_COLORS["default"];
}

// Animated counter hook
function useCounter(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Roadmap card with hover effects
function RoadmapCard({ step, index }: { step: RoadmapPhase; index: number }) {
  const [hovered, setHovered] = useState(false);
  const phaseColors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];
  const color = phaseColors[index] || phaseColors[0];

  return (
    <div className="relative pl-20">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-2 flex items-center justify-center size-16 rounded-full border-4 transition-all duration-300"
        style={{
          backgroundColor: hovered || index === 0 ? `${color}33` : "#334155",
          borderColor: hovered || index === 0 ? color : "#475569",
          boxShadow: hovered ? `0 0 16px ${color}66` : "none",
        }}
      >
        {/* Phase number badge */}
        <span
          className="text-xl font-bold transition-all duration-300"
          style={{
            color: hovered || index === 0 ? color : "#94a3b8",
            transform: hovered ? "scale(1.2)" : "scale(1)",
            display: "inline-block",
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="p-6 rounded-lg border-2 cursor-default transition-all duration-300"
        style={{
          backgroundColor: hovered ? `${color}0d` : index === 0 ? "#3b82f611" : "#1e293b80",
          borderColor: hovered ? `${color}80` : index === 0 ? "#3b82f680" : "#475569",
          boxShadow: hovered ? `0 0 0 1px ${color}33, 0 8px 32px ${color}22` : "none",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase mb-1 block" style={{ color }}>
              {step.phase}
            </span>
            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
          </div>
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full shrink-0 ml-4 transition-all duration-300"
            style={{
              color,
              backgroundColor: `${color}1a`,
              border: `1px solid ${color}40`,
            }}
          >
            {step.duration_months} {step.duration_months === 1 ? "month" : "months"}
          </span>
        </div>

        <p className="text-slate-300 mb-4 text-sm leading-relaxed">{step.description}</p>

        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Key Skills</p>
          <div className="flex flex-wrap gap-2">
            {step.skills.map((skill, i) => {
              const skillColor = getSkillColor(skill);
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm text-slate-200 transition-all duration-200"
                  style={{
                    backgroundColor: "#1e293b",
                    border: `1px solid ${skillColor}40`,
                  }}
                >
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: skillColor }}
                  />
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overall skill gap progress bar
function SkillGapBar({ radarSkills }: { radarSkills: RadarSkill[] }) {
  const avgCurrent = Math.round(radarSkills.reduce((s, r) => s + r.current, 0) / radarSkills.length);
  const avgRequired = Math.round(radarSkills.reduce((s, r) => s + r.required, 0) / radarSkills.length);
  const pct = Math.round((avgCurrent / avgRequired) * 100);
  const [animate, setAnimate] = useState(false);
  const counter = useCounter(pct, 1200, animate);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-cyan-400" />
          <span className="text-white font-semibold">Overall Skill Readiness</span>
        </div>
        <span className="text-2xl font-bold text-cyan-400">{counter}%</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: animate ? `${pct}%` : "0%" }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>Beginner</span>
        <span>Role Ready</span>
      </div>
    </div>
  );
}

// Market stat badge
function StatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
      <div className="text-cyan-400 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-white font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

export function ResultsDashboard() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stars, setStars] = useState<Star[]>([]);

  const chartsRef   = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const roadmapRef  = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const role     = sessionStorage.getItem("targetRole");
    const skills   = sessionStorage.getItem("currentSkills");
    const hasExp   = sessionStorage.getItem("hasJobExperience");
    const yearsExp = sessionStorage.getItem("yearsOfExperience");

    if (!role || !skills) { router.push("/input"); return; }
    setTargetRole(role);

    // Load market data for stat badges
    fetch("/job_market.json")
      .then(r => r.json())
      .then(data => setMarketData(data[role] || null))
      .catch(() => {});

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole: role,
        currentSkills: JSON.parse(skills),
        hasJobExperience: hasExp === "true",
        yearsOfExperience: yearsExp || "",
      }),
    })
      .then(res => res.json())
      .then(data => { if (data.error) throw new Error(data.error); setResult(data); })
      .catch(err => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [router]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fadeIn = (delay: number) => ({
    style: { animationDelay: `${delay}ms` },
  });

  const totalMonths = result?.roadmap.reduce((s, p) => s + p.duration_months, 0) ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {stars.map((star, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: star.size, height: star.size,
            top: star.top, left: star.left, opacity: star.opacity,
          }} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative">

        {/* Back button */}
        <div {...fadeIn(0)} className="animate-fade-in-up">
          <Button variant="ghost" onClick={() => router.push("/input")} className="text-slate-300 hover:text-white mb-8">
            <ArrowLeft className="mr-2 size-4" /> Back to Input
          </Button>
        </div>

        {/* Header */}
        <div {...fadeIn(100)} className="mb-6 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-2">Your Personalized Learning Roadmap</h1>
          <p className="text-xl text-slate-300 mb-6">
            Target Role: <span className="text-cyan-400">{targetRole}</span>
          </p>

          {/* Smooth scroll nav */}
          {result && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { label: "Charts",   icon: <BarChart2 className="size-3.5" />, ref: chartsRef },
                { label: "Analysis", icon: <Lightbulb className="size-3.5" />, ref: analysisRef },
                { label: "Roadmap",  icon: <Map       className="size-3.5" />, ref: roadmapRef },
              ].map(({ label, icon, ref }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(ref)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-slate-300 border border-slate-600 hover:border-blue-500 hover:text-white transition-all duration-200 hover:bg-blue-500/10"
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="size-12 text-blue-400 animate-spin" />
            <p className="text-slate-300 text-lg">Analyzing your profile...</p>
            <p className="text-slate-500 text-sm">This may take a few seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="bg-red-900/30 border-red-500/50 max-w-lg mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-red-300 mb-4">{error}</p>
              <Button onClick={() => router.push("/input")} variant="outline" className="border-red-500 text-red-300">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && result && (
          <div className="space-y-8">

            {/* Progress bar */}
            <div {...fadeIn(150)} className="animate-fade-in-up">
              <SkillGapBar radarSkills={result.radar_skills} />
            </div>

            {/* Charts */}
            <div ref={chartsRef} className="grid lg:grid-cols-2 gap-8 scroll-mt-8">
              <div {...fadeIn(200)} className="animate-fade-in-up">
                <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">Skill Gap Analysis</CardTitle>
                    <CardDescription className="text-slate-400">Your current levels vs. what the role requires</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={380}>
                      <RadarChart data={result.radar_skills.map(s => ({
                        skill: s.skill.length > 15 ? s.skill.substring(0, 12) + "..." : s.skill,
                        current: s.current,
                        required: s.required,
                      }))}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <Radar name="Required Level" dataKey="required" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} />
                        <Radar name="Current Level" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} strokeWidth={2} />
                        <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div {...fadeIn(300)} className="animate-fade-in-up">
                <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">Priority Skills to Develop</CardTitle>
                    <CardDescription className="text-slate-400">Skills with the largest gap to close</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={result.priority_skills.map(s => ({
                        skill: s.skill.length > 20 ? s.skill.substring(0, 17) + "..." : s.skill,
                        gap: s.gap,
                      }))} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis type="number" tick={{ fill: "#cbd5e1" }} domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" tick={{ fill: "#cbd5e1", fontSize: 11 }} width={110} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px" }} labelStyle={{ color: "#cbd5e1" }} />
                        <Bar dataKey="gap" fill="#8b5cf6" name="Skill Gap %" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Analysis */}
            <div ref={analysisRef} {...fadeIn(400)} className="animate-fade-in-up scroll-mt-8">
              <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Profile Analysis</CardTitle>
                  <CardDescription className="text-slate-400">AI-generated insights based on your profile and market data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Market stat badges */}
                  {marketData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatBadge
                        icon={<TrendingUp className="size-4" />}
                        label="Avg. Salary"
                        value={`$${marketData.avg_salary?.toLocaleString() ?? "N/A"}`}
                      />
                      <StatBadge
                        icon={<GraduationCap className="size-4" />}
                        label="Top Education"
                        value={Object.keys(marketData.education_distribution ?? {})[0] ?? "N/A"}
                      />
                      <StatBadge
                        icon={<Building2 className="size-4" />}
                        label="Top Company Size"
                        value={Object.keys(marketData.company_size_distribution ?? {})[0] ?? "N/A"}
                      />
                      <StatBadge
                        icon={<MapPin className="size-4" />}
                        label="Top Location"
                        value={marketData.top_locations?.[0] ?? "N/A"}
                      />
                    </div>
                  )}
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{result.analysis}</p>
                </CardContent>
              </Card>
            </div>

            {/* Roadmap */}
            <div ref={roadmapRef} {...fadeIn(500)} className="animate-fade-in-up scroll-mt-8">
              <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-2xl">Your Step-by-Step Career Roadmap</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        Follow this personalized learning path to achieve your career goals
                      </CardDescription>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Total Duration</p>
                      <p className="text-2xl font-bold text-cyan-400">{totalMonths} <span className="text-sm font-normal text-slate-400">months</span></p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />
                    <div className="space-y-12">
                      {result.roadmap.map((step, index) => (
                        <RoadmapCard key={index} step={step} index={index} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div {...fadeIn(600)} className="pb-8 text-center animate-fade-in-up">
              <Button
                onClick={() => router.push("/input")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
              >
                Create New Roadmap
              </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
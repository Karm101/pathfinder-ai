"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface SkillLevel {
  skill: string;
  current: number;
  required: number;
}

interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  status: "completed" | "current" | "upcoming";
}

// Role requirements mapping
const ROLE_REQUIREMENTS: Record<string, string[]> = {
  "Frontend Developer": ["JavaScript", "React", "HTML/CSS", "TypeScript", "REST APIs", "Git", "Responsive Design", "Web Performance"],
  "Backend Developer": ["Python", "Node.js", "SQL", "REST APIs", "Docker", "Git", "PostgreSQL", "API Design"],
  "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL", "REST APIs", "Git", "Docker", "TypeScript"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Git", "Terraform", "Monitoring"],
  "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Data Visualization", "R", "Deep Learning"],
  "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "MLOps", "Docker", "Git"],
  "Mobile Developer": ["React Native", "Swift", "Kotlin", "Mobile UI/UX", "REST APIs", "Git", "App Store", "Firebase"],
  "Cloud Architect": ["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "Networking", "Security", "CI/CD"],
  "Cybersecurity Analyst": ["Network Security", "Penetration Testing", "Linux", "Python", "SIEM", "Encryption", "Compliance", "Incident Response"],
  "UI/UX Designer": ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility", "HTML/CSS", "Interaction Design", "Usability Testing"],
  "QA Engineer": ["Test Automation", "Selenium", "Jest", "API Testing", "Git", "CI/CD", "Bug Tracking", "Python"],
  "Database Administrator": ["SQL", "PostgreSQL", "MongoDB", "Database Design", "Performance Tuning", "Backup & Recovery", "Security", "MySQL"],
};

export function ResultsDashboard() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillGapData, setSkillGapData] = useState<SkillLevel[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const role = sessionStorage.getItem('targetRole');
    const skills = sessionStorage.getItem('currentSkills');

    if (!role || !skills) {
      router.push('/input');
      return;
    }

    setTargetRole(role);
    const parsedSkills = JSON.parse(skills);
    setCurrentSkills(parsedSkills);

    // Generate skill gap analysis
    const requiredSkills = ROLE_REQUIREMENTS[role] || [];
    const gapData: SkillLevel[] = requiredSkills.map(skill => {
      const hasSkill = parsedSkills.some((s: any) => {
        // This safely extracts the skill name whether it is a string or an object!
        const skillName = typeof s === 'string' ? s : (s.skill || s.name || s.title || "");
        return skillName.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(skillName.toLowerCase());
      });
      return {
        skill,
        current: hasSkill ? 80 + Math.random() * 20 : Math.random() * 30,
        required: 85 + Math.random() * 15,
      };
    });
    setSkillGapData(gapData);

    // Generate roadmap
    const missingSkills = gapData
      .filter(item => item.current < 50)
      .map(item => item.skill);
    
    const improvementSkills = gapData
      .filter(item => item.current >= 50 && item.current < item.required)
      .map(item => item.skill);

    const roadmap: RoadmapStep[] = [
      {
        phase: "Phase 1",
        title: "Foundation Building",
        description: "Master the fundamental skills required for your target role",
        duration: "2-3 months",
        skills: missingSkills.slice(0, 3),
        status: "current",
      },
      {
        phase: "Phase 2",
        title: "Intermediate Development",
        description: "Strengthen your core competencies and build practical projects",
        duration: "3-4 months",
        skills: missingSkills.slice(3, 6).concat(improvementSkills.slice(0, 2)),
        status: "upcoming",
      },
      {
        phase: "Phase 3",
        title: "Advanced Skills",
        description: "Deep dive into advanced topics and specializations",
        duration: "2-3 months",
        skills: improvementSkills.slice(2, 5),
        status: "upcoming",
      },
      {
        phase: "Phase 4",
        title: "Career Readiness",
        description: "Build portfolio projects and prepare for job applications",
        duration: "1-2 months",
        skills: ["Portfolio Development", "Interview Prep", "Networking"],
        status: "upcoming",
      },
    ];
    setRoadmapSteps(roadmap);
  }, [router.push]);

  // Prepare radar chart data
  const radarData = skillGapData.slice(0, 6).map(item => ({
    skill: item.skill.length > 15 ? item.skill.substring(0, 12) + '...' : item.skill,
    current: Math.round(item.current),
    required: Math.round(item.required),
  }));

  // Prepare bar chart data
  const barData = skillGapData.map(item => ({
    skill: item.skill.length > 20 ? item.skill.substring(0, 17) + '...' : item.skill,
    gap: Math.max(0, Math.round(item.required - item.current)),
  })).sort((a, b) => b.gap - a.gap).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/input')}
          className="text-slate-300 hover:text-white mb-8"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Input
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Your Personalized Learning Roadmap</h1>
          <p className="text-xl text-slate-300">Target Role: <span className="text-cyan-400">{targetRole}</span></p>
        </div>

        {/* Skill Gap Analysis Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Skill Gap Analysis - Radar View</CardTitle>
              <CardDescription className="text-slate-400">
                Compare your current skill levels vs. required levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#cbd5e1' }} />
                  <Radar name="Current Level" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Radar name="Required Level" dataKey="required" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Priority Skills to Develop</CardTitle>
              <CardDescription className="text-slate-400">
                Skills with the largest gap between current and required levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis type="number" tick={{ fill: '#cbd5e1' }} />
                  <YAxis dataKey="skill" type="category" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                  />
                  <Bar dataKey="gap" fill="#8b5cf6" name="Skill Gap %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Career Roadmap Timeline */}
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Your Step-by-Step Career Roadmap</CardTitle>
            <CardDescription className="text-slate-400">
              Follow this personalized learning path to achieve your career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />

              {/* Timeline Steps */}
              <div className="space-y-12">
                {roadmapSteps.map((step, index) => (
                  <div key={index} className="relative pl-20">
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 top-2 flex items-center justify-center size-16 rounded-full border-4 ${
                      step.status === 'completed' 
                        ? 'bg-green-500 border-green-400' 
                        : step.status === 'current'
                        ? 'bg-blue-500 border-blue-400 animate-pulse'
                        : 'bg-slate-700 border-slate-600'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="size-8 text-white" />
                      ) : (
                        <Circle className="size-8 text-slate-300" fill={step.status === 'current' ? 'white' : 'transparent'} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={`p-6 rounded-lg border-2 ${
                      step.status === 'current'
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-slate-700/50 border-slate-600'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-sm text-slate-400">{step.phase}</span>
                          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                        </div>
                        <span className="text-sm text-cyan-400 font-medium">{step.duration}</span>
                      </div>
                      
                      <p className="text-slate-300 mb-4">{step.description}</p>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Key Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {step.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-slate-600/50 border border-slate-500 rounded-full text-sm text-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push('/input')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
          >
            Create New Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";

interface SkillWithRating {
  name: string;
  rating: number;
}

const IT_ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "DevOps Engineer", "Data Scientist", "Machine Learning Engineer",
  "Mobile Developer", "Cloud Architect", "Cybersecurity Analyst",
  "UI/UX Designer", "QA Engineer", "Database Administrator",
  "Systems Analyst", "Network Administrator", "Data Analyst",
  "Cloud Engineer", "Security Engineer", "Scrum Master",
  "IT Project Manager", "Blockchain Developer", "Game Developer",
  "AI Prompt Engineer", "Business Intelligence Analyst"
];

const COMMON_SKILLS = [
  "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP",
  "React", "Node.js", "Angular", "Vue.js", "Next.js", "Tailwind CSS",
  "SQL", "HTML/CSS", "Git", "Docker", "AWS", "TypeScript", "REST APIs",
  "MongoDB", "PostgreSQL", "MySQL", "Kubernetes", "CI/CD", "Agile", "Linux",
  "Figma", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Cybersecurity",
  "Azure", "Google Cloud (GCP)", "Terraform", "GraphQL", "Redis", "Spring Boot"
];

type Star = { top: string; left: string; size: string; opacity: number };

export function SkillInputForm() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState<SkillWithRating[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skillProficiency, setSkillProficiency] = useState([1]);
  const [hasJobExperience, setHasJobExperience] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
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

  const handleAddSkill = (skill: string) => {
    if (skill && !currentSkills.some(s => s.name === skill)) {
      setCurrentSkills([...currentSkills, { name: skill, rating: skillProficiency[0] }]);
      setSkillInput("");
      setShowSuggestions(false);
      setSkillProficiency([1]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill.name !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRole && currentSkills.length > 0) {
      sessionStorage.setItem('targetRole', targetRole);
      sessionStorage.setItem('currentSkills', JSON.stringify(currentSkills));
      sessionStorage.setItem('hasJobExperience', hasJobExperience.toString());
      sessionStorage.setItem('yearsOfExperience', yearsOfExperience);
      router.push('/results');
    }
  };

  const filteredSuggestions = COMMON_SKILLS.filter(
    skill =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !currentSkills.some(s => s.name === skill)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size, height: star.size,
              top: star.top, left: star.left, opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative">

        {/* Back button */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-slate-300 hover:text-white mb-8"
          >
            <ArrowLeft className="mr-2 size-4" /> Back to Home
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card
            className="bg-slate-800/90 backdrop-blur-sm border-slate-700 animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <CardHeader>
              <CardTitle
                className="text-3xl text-white animate-fade-in-up"
                style={{ animationDelay: "250ms" }}
              >
                Build Your Learning Path
              </CardTitle>
              <CardDescription
                className="text-slate-400 animate-fade-in-up"
                style={{ animationDelay: "350ms" }}
              >
                Tell us about your target role and current skills to generate your personalized roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Target Role Selection */}
                <div
                  className="space-y-3 animate-fade-in-up"
                  style={{ animationDelay: "450ms" }}
                >
                  <Label htmlFor="target-role" className="text-white text-lg">
                    What's your target IT role?
                  </Label>
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger
                      id="target-role"
                      className="bg-slate-700 border-slate-600 text-white"
                    >
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {IT_ROLES.map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="text-white focus:bg-slate-600 focus:text-white"
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Skills Input */}
                <div
                  className="space-y-3 animate-fade-in-up"
                  style={{ animationDelay: "550ms" }}
                >
                  <Label htmlFor="current-skills" className="text-white text-lg">
                    What are your current skills?
                  </Label>

                  <div className="relative">
                    <Input
                      id="current-skills"
                      type="text"
                      placeholder="Type a skill name..."
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              setSkillInput(skill);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skill Proficiency Slider */}
                  <div
                    className="space-y-3 pt-2 animate-fade-in-up"
                    style={{ animationDelay: "620ms" }}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="skill-proficiency" className="text-white">
                        Skill Proficiency
                      </Label>
                      <span className="text-cyan-400 font-semibold text-lg">
                        {skillProficiency[0]}/10
                      </span>
                    </div>
                    <Slider
                      id="skill-proficiency"
                      min={1}
                      max={10}
                      step={1}
                      value={skillProficiency}
                      onValueChange={setSkillProficiency}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  {/* Add Skill Button */}
                  <div
                    className="pt-2 animate-fade-in-up"
                    style={{ animationDelay: "680ms" }}
                  >
                    <Button
                      type="button"
                      onClick={() => handleAddSkill(skillInput)}
                      disabled={!skillInput}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="mr-2 size-4" /> Add Skill
                    </Button>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {currentSkills.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300"
                      >
                        <span className="font-medium">{skill.name}:</span>
                        <span className="text-cyan-300">{skill.rating}/10</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {currentSkills.length === 0 && (
                    <p className="text-slate-500 text-sm">No skills added yet. Start typing to add skills.</p>
                  )}
                </div>

                {/* Job Experience Section */}
                <div
                  className="space-y-4 pt-4 border-t border-slate-700 animate-fade-in-up"
                  style={{ animationDelay: "750ms" }}
                >
                  <Label className="text-white text-lg">Job Experience</Label>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="job-experience"
                      checked={hasJobExperience}
                      onCheckedChange={(checked) => {
                        setHasJobExperience(checked as boolean);
                        if (!checked) setYearsOfExperience("");
                      }}
                      className="border-slate-600"
                    />
                    <Label
                      htmlFor="job-experience"
                      className="text-slate-300 cursor-pointer"
                    >
                      I have prior IT job experience
                    </Label>
                  </div>

                  {hasJobExperience && (
                    <div className="space-y-2 pl-7 animate-in slide-in-from-top-2 duration-300">
                      <Label htmlFor="years-experience" className="text-slate-300">
                        How many years of experience?
                      </Label>
                      <Input
                        id="years-experience"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        placeholder="e.g., 2"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 max-w-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div
                  className="pt-4 animate-fade-in-up"
                  style={{ animationDelay: "850ms" }}
                >
                  <Button
                    type="submit"
                    disabled={!targetRole || currentSkills.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
                  >
                    Generate My Roadmap
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
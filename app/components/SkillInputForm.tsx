"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const IT_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Developer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "QA Engineer",
  "Database Administrator",
];

const COMMON_SKILLS = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", "SQL", 
  "HTML/CSS", "Git", "Docker", "AWS", "TypeScript", "REST APIs",
  "MongoDB", "PostgreSQL", "Kubernetes", "CI/CD", "Agile", "Linux"
];

export function SkillInputForm() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddSkill = (skill: string) => {
    if (skill && !currentSkills.includes(skill)) {
      setCurrentSkills([...currentSkills, skill]);
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRole && currentSkills.length > 0) {
      // Store data in sessionStorage
      sessionStorage.setItem('targetRole', targetRole);
      sessionStorage.setItem('currentSkills', JSON.stringify(currentSkills));
      router.push('/results');
    }
  };

  const filteredSuggestions = COMMON_SKILLS.filter(
    skill => 
      skill.toLowerCase().includes(skillInput.toLowerCase()) && 
      !currentSkills.includes(skill)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="text-slate-300 hover:text-white mb-8"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-3xl text-white">Build Your Learning Path</CardTitle>
              <CardDescription className="text-slate-400">
                Tell us about your target role and current skills to generate your personalized roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Target Role Selection */}
                <div className="space-y-3">
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
                <div className="space-y-3">
                  <Label htmlFor="current-skills" className="text-white text-lg">
                    What are your current skills?
                  </Label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <Input
                        id="current-skills"
                        type="text"
                        placeholder="Type a skill and press Enter..."
                        value={skillInput}
                        onChange={(e) => {
                          setSkillInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(skillInput);
                          }
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddSkill(skillInput)}
                        disabled={!skillInput}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {currentSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
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

                {/* Submit Button */}
                <div className="pt-4">
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

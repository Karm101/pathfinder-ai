import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const { targetRole, currentSkills, hasJobExperience, yearsOfExperience } = await req.json();

    const jobMarketPath = join(process.cwd(), "public", "job_market.json");
    const jobMarket = JSON.parse(readFileSync(jobMarketPath, "utf-8"));
    const roleData = jobMarket[targetRole] || null;

    // Pre-calculate current skill levels from user input (1-10 → 0-100)
    // so Gemini only needs to decide required levels and which skills to include
    const skillMap: Record<string, number> = {};
    for (const s of currentSkills) {
      const name = typeof s === "string" ? s : s.name;
      const rating = typeof s === "string" ? 5 : s.rating;
      skillMap[name.toLowerCase()] = Math.round((rating / 10) * 100);
    }

    const prompt = `You are a career advisor AI. Generate a structured career roadmap for this user.

Job Market Data for "${targetRole}":
${roleData ? JSON.stringify(roleData) : "No specific market data available."}

User Profile:
- Target Role: ${targetRole}
- Current Skills (name: current_level_0_to_100): ${JSON.stringify(
      Object.entries(skillMap).map(([name, level]) => ({ name, current_level: level }))
    )}
- Has Prior IT Job Experience: ${hasJobExperience}
- Years of Experience: ${yearsOfExperience || "Not specified"}

Return a JSON object with exactly these fields:

{
  "radar_skills": [
    {
      "skill": "exact skill name",
      "current": <use the provided current_level exactly if skill was listed, otherwise 5-15>,
      "required": <integer 70-100 based on how critical this skill is for ${targetRole}>
    }
  ],
  "priority_skills": [
    {
      "skill": "skill name",
      "gap": <integer, required minus current, minimum 0>
    }
  ],
  "analysis": "2-3 paragraphs about the user profile, skill gaps, and market outlook",
  "roadmap": [
    {
      "phase": "Phase 1",
      "title": "phase title",
      "duration_months": <integer>,
      "description": "one sentence",
      "skills": ["Skill A", "Skill B", "Skill C"]
    }
  ]
}

Rules:
- radar_skills: exactly 6 skills. Prioritize skills the user listed that are relevant to ${targetRole}, then fill with the most important missing skills.
- For listed skills, use their exact current_level value for "current". Do not change it.
- priority_skills: exactly 8 skills sorted by gap descending. Only include skills where gap > 0.
- roadmap: exactly 4 phases from foundations to career readiness.
- duration_months: single integer only, no ranges.`;

    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini HTTP error:", error);
      return NextResponse.json({ error: "Gemini API error", details: error }, { status: 500 });
    }

    const geminiData = await response.json();
    console.log("Finish reason:", geminiData.candidates?.[0]?.finishReason);

    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let cleaned = rawText.replace(/```json|```/g, "").trim();

    // Robust parsing: if direct parse fails, extract outermost { } block
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not extract JSON from Gemini response");
      parsed = JSON.parse(match[0]);
    }

    // Post-process: enforce that current values for user-listed skills are accurate
    if (parsed.radar_skills) {
      parsed.radar_skills = parsed.radar_skills.map((s: any) => {
        const key = s.skill.toLowerCase();
        const userLevel = skillMap[key];
        return {
          ...s,
          current: userLevel !== undefined ? userLevel : s.current,
        };
      });
    }

    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error("Analysis error:", err?.message);
    return NextResponse.json({ error: err?.message || "Failed to generate analysis" }, { status: 500 });
  }
}
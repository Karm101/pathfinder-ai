"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function GetStartedButton({ animationDelay = 0 }: { animationDelay?: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      size="lg"
      onClick={() => router.push("/input")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-in-up bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg overflow-hidden"
      style={{
        animationDelay: `${animationDelay}ms`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered
          ? "0 0 0 2px rgba(99,179,237,0.6), 0 0 18px 4px rgba(99,179,237,0.35)"
          : "none",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        Get Started <ArrowRight className="size-5" />
      </span>
    </Button>
  );
}
import React from "react";
import { STAGES } from "@/lib/data";

interface StepperProps {
  currentStageIndex: number; // 0 to 5 completed count (e.g. 2 means stages 0 and 1 done)
  customNote?: string;
}

export default function Stepper({
  currentStageIndex,
  customNote,
}: StepperProps) {
  const noteIndex = Math.min(
    Math.max(currentStageIndex - 1, 0),
    STAGES.length - 1
  );
  const displayNote = customNote || STAGES[noteIndex]?.note;

  return (
    <div className="w-full">
      <div className="step" role="progressbar" aria-valuenow={currentStageIndex} aria-valuemin={0} aria-valuemax={5}>
        {STAGES.map((stage, i) => (
          <div
            key={stage.key}
            className={i < currentStageIndex ? "done" : ""}
            aria-current={i === currentStageIndex - 1 ? "step" : undefined}
          >
            {stage.label}
          </div>
        ))}
      </div>
      {displayNote && (
        <p className="hand text-center mt-6 text-xl tracking-wide select-none">
          “{displayNote}”
        </p>
      )}
    </div>
  );
}

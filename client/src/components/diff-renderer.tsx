import type { TextSegment } from "@shared/schema";
import { TooltipWrapper } from "@/components/tooltip-wrapper";

interface DiffRendererProps {
  segments: TextSegment[];
}

function TextSegmentComponent({ segment }: { segment: TextSegment }) {
  const getClassName = () => {
    const baseClass = (() => {
      switch (segment.type) {
        case "error":
          return "text-error";
        case "addition":
          return "text-addition";
        case "improvement":
          return "text-improvement";
        default:
          return "text-standard";
      }
    })();

    const isPunctuation = /^[.,;:!?]+$/.test(segment.text.trim());
    return `${baseClass} ${isPunctuation ? "is-punctuation" : "is-word"}`;
  };

  const needsTooltip = (segment.type === "error" || segment.type === "improvement") && segment.reason;

  return (
    <TooltipWrapper
      content={segment.reason || ""}
      enabled={!!needsTooltip}
    >
      <span
        className={getClassName()}
        data-testid={`text-segment-${segment.type}`}
      >
        {segment.text}
      </span>
    </TooltipWrapper>
  );
}

export function DiffRenderer({ segments }: DiffRendererProps) {
  return (
    <div
      className="min-h-[400px] w-full p-6 border border-gray-700 rounded-lg bg-black text-lg leading-relaxed font-typewriter whitespace-pre-wrap"
      data-testid="diff-output"
    >
      {segments.map((segment, index) => (
        <TextSegmentComponent key={index} segment={segment} />
      ))}
    </div>
  );
}

export function DiffLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm font-typewriter text-gray-400 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-error">strikethrough</span>
        <span>= deleted</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-addition">green</span>
        <span>= grammar fix</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-improvement">yellow</span>
        <span>= style improvement</span>
      </div>
    </div>
  );
}

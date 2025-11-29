import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = "Analyzing your text", 
  fullScreen = true 
}: LoadingStateProps) {
  const content = (
    <div className="text-center">
      <div className="mb-6">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
      </div>
      <p className="text-gray-400 font-typewriter text-lg">
        <span>{message}</span>
        <span className="typewriter-loading" />
        <span className="cursor-blink" />
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-40"
        data-testid="loading-state"
      >
        {content}
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center py-12"
      data-testid="loading-state"
    >
      {content}
    </div>
  );
}

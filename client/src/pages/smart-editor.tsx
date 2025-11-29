import { useState, useRef } from "react";
import { ArrowRight, RotateCcw, Loader2, Copy, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SettingsModal } from "@/components/settings-modal";
import { DiffRenderer, DiffLegend } from "@/components/diff-renderer";
import { LoadingState } from "@/components/loading-state";
import { useApiKey } from "@/hooks/use-api-key";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TextSegment, AnalyzeResponse } from "@shared/schema";

type EditorMode = "input" | "output";

export default function SmartEditor() {
  const [mode, setMode] = useState<EditorMode>("input");
  const [text, setText] = useState("");
  const [segments, setSegments] = useState<TextSegment[]>([]);
  const [improvedText, setImprovedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { apiKey, updateApiKey } = useApiKey();
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (inputText: string) => {
      const response = await apiRequest("POST", "/api/analyze", {
        text: inputText,
        apiKey,
      });
      const data: AnalyzeResponse = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setSegments(data.segments);
      setImprovedText(data.improvedText);
      setMode("output");
    },
    onError: (error: Error) => {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message) {
        try {
          const parsed = JSON.parse(error.message.split(": ").slice(1).join(": "));
          errorMessage = parsed.error || error.message;
        } catch {
          errorMessage = error.message.includes(": ")
            ? error.message.split(": ").slice(1).join(": ")
            : error.message;
        }
      }
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate(text);
  };

  const handleReset = () => {
    setMode("input");
    setSegments([]);
    setImprovedText("");
    setText("");
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedText);
    toast({
      title: "Copied!",
      description: "Improved text copied to clipboard.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 pt-6 pb-12">
        <header className="relative text-center mb-8">
          <div className="absolute right-0 top-0">
            <SettingsModal onApiKeyChange={updateApiKey} currentApiKey={apiKey}>
              <Button
                variant="outline"
                className="bg-gray-900 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-2 font-typewriter"
              >
                <Key className="h-4 w-4" />
                API Key
              </Button>
            </SettingsModal>
          </div>

          <h1 className="text-3xl font-bold font-typewriter mb-2 tracking-wide pt-2">
            Smart Editor
          </h1>
          <p className="text-gray-400 font-typewriter text-sm">
            AI-powered text refinement with intelligent diff view
          </p>
        </header>

        <main className="relative">
          {mode === "input" ? (
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start typing to improve your text..."
                className="min-h-[400px] w-full resize-none bg-black border border-gray-700 rounded-lg text-lg leading-relaxed font-typewriter text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-0 pr-16"
                disabled={analyzeMutation.isPending}
                data-testid="input-textarea"
              />

              <p className="text-xs text-gray-500 font-typewriter mt-3 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd> to submit
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-typewriter text-gray-300">
                  Analysis Results
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-typewriter"
                    data-testid="button-copy"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-typewriter"
                    data-testid="button-reset"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Text
                  </Button>
                </div>
              </div>

              <DiffRenderer segments={segments} />
              <DiffLegend />
            </div>
          )}

          {analyzeMutation.isPending && (
            <LoadingState message="Analyzing your text" />
          )}
        </main>

        <footer className="mt-16 text-center">
          <p className="text-xs text-gray-600 font-typewriter">
            Powered by OpenRouter x-ai/grok-4.1-fast
          </p>
        </footer>
      </div>
    </div>
  );
}

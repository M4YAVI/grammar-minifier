import { useState, useEffect } from "react";
import { Settings, X, Key, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_KEY_STORAGE_KEY } from "@/hooks/use-api-key";

interface SettingsModalProps {
  onApiKeyChange?: (key: string) => void;
  currentApiKey?: string;
  children?: React.ReactNode;
}

export function SettingsModal({ onApiKeyChange, currentApiKey, children }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentApiKey !== undefined) {
      setApiKey(currentApiKey);
    } else {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  }, [currentApiKey, open]);

  const handleSave = () => {
    onApiKeyChange?.(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1500);
  };

  const handleClear = () => {
    setApiKey("");
    onApiKeyChange?.("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="icon"
            variant="outline"
            className="fixed top-6 right-6 z-[100] text-white bg-gray-900 border-gray-700 hover:bg-gray-800 hover:text-white rounded-full h-10 w-10 shadow-lg"
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-typewriter flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-typewriter text-sm">
            Enter your OpenRouter API key to enable AI text analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-gray-300 font-typewriter text-sm">
              OpenRouter API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white font-typewriter placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500"
              data-testid="input-api-key"
            />
            <p className="text-xs text-gray-500 font-typewriter">
              Get your free API key at{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!apiKey || saved}
              className="flex-1 bg-white text-black hover:bg-gray-200 font-typewriter"
              data-testid="button-save-api-key"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                "Save Key"
              )}
            </Button>
            {apiKey && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-typewriter"
                data-testid="button-clear-api-key"
              >
                Clear
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 font-typewriter text-center">
            Your key is stored securely in your browser and never sent to our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

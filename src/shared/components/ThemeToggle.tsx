import { useStore } from "@nanostores/react";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/ui/button";
import { $theme, initTheme, toggleTheme } from "@/shared/hooks/useTheme";

export function ThemeToggle() {
  const theme = useStore($theme);

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Cambiar tema">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

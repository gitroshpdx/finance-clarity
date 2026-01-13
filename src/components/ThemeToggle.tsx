import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "mobile";
}

export function ThemeToggle({ className = "", variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + rect.width / 2;
    const y = e.clientY - rect.top + rect.height / 2;
    setClickPosition({ x: e.clientX, y: e.clientY });

    // Add transitioning class for smooth color shifts
    document.documentElement.classList.add('theme-transitioning');
    
    // Create radial wipe effect
    const overlay = document.createElement('div');
    overlay.className = 'theme-wipe-overlay';
    overlay.style.setProperty('--wipe-x', `${e.clientX}px`);
    overlay.style.setProperty('--wipe-y', `${e.clientY}px`);
    overlay.style.setProperty('--wipe-color', resolvedTheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222 47% 6%)');
    document.body.appendChild(overlay);

    // Toggle theme
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

    // Cleanup
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      overlay.remove();
    }, 600);
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`relative h-9 w-9 rounded-full ${className}`}
        disabled
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "mobile") {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors ${className}`}
      >
        <span className="text-sm font-medium text-foreground/80">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
        <div className="relative flex items-center justify-center w-14 h-7 rounded-full bg-background border border-border">
          <motion.div
            className="absolute w-5 h-5 rounded-full bg-primary shadow-lg"
            animate={{ x: isDark ? 12 : -12 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <Sun className="absolute left-1.5 h-3.5 w-3.5 text-amber-500" />
          <Moon className="absolute right-1.5 h-3.5 w-3.5 text-primary" />
        </div>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`relative h-9 w-9 rounded-full overflow-hidden group hover:bg-primary/10 transition-colors ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4 text-primary group-hover:text-primary transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDark 
            ? "0 0 0 0 transparent" 
            : "0 0 12px 2px hsl(var(--primary) / 0.3)"
        }}
        transition={{ duration: 0.3 }}
      />
    </Button>
  );
}

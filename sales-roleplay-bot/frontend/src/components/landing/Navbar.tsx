import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-purple shadow-glow-sm">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Eubrics AI <span className="text-white/40 font-normal">Sales Arena</span>
          </span>
        </div>
        <Button size="sm" onClick={() => navigate("/arena")}>
          Launch Arena
        </Button>
      </div>
    </header>
  );
}

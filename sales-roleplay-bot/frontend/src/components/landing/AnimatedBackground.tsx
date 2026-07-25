export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div
        className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-purple/25 blur-[120px] animate-float"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-[120px] animate-float"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-purple/15 blur-[100px] animate-float"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-canvas" />
    </div>
  );
}

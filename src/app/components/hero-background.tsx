export function HeroBackground() {
  return (
    <div className="fixed inset-0 bg-background">
      {/* Neon gradient wash — coral left, cyan right */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/30 via-transparent to-accent-cyan/20 animate-pulse"></div>
      </div>
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]" style={{
        backgroundImage: `radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }}></div>
    </div>
  );
}

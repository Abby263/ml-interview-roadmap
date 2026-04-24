export default function FocusMix({
  items,
}: {
  items: Array<{ label: string; weight: number }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{item.label}</span>
            <span className="text-muted">{item.weight}%</span>
          </div>
          <div className="line-muted h-3 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
              style={{ width: `${item.weight}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-wrap justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-primary font-medium">{value}</span>
  </div>
);

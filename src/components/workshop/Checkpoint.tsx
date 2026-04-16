export function Checkpoint({ items }: { items: string[] }) {
  return (
    <div className="rounded-md border p-4">
      <h4 className="font-semibold">Checkpoints</h4>
      <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}



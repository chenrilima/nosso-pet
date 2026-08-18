import { Dog } from "lucide-react";
export function Logo({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white" aria-hidden="true">
        <Dog />
      </span>
      <span className={`leading-none ${light ? "text-white" : "text-olive"}`}>
        <b className="block text-xl font-black">{name}</b>
      </span>
    </div>
  );
}

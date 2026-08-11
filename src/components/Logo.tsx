import { Dog } from "lucide-react";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2" aria-label="Nosso Pet">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white">
        <Dog />
      </span>
      <span className={`leading-none ${light ? "text-white" : "text-olive"}`}>
        <b className="block text-xl font-black">
          nosso<span className="text-brand">pet</span>
        </b>
        <small className="font-bold tracking-[.22em]">TABOÃO</small>
      </span>
    </div>
  );
}

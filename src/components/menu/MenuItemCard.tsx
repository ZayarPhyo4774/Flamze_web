import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface MenuItemCardProps {
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryName: string;
  noImageLabel?: string;
}

export function MenuItemCard({
  name,
  description,
  price,
  image,
  categoryName,
  noImageLabel = "No image",
}: MenuItemCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-zinc-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-200 text-sm font-medium text-zinc-500">
            {noImageLabel}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-lg backdrop-blur-sm">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="leading-snug font-bold text-zinc-950">{name}</h3>
          <span className="shrink-0 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-black text-zinc-950 ring-1 ring-amber-500/30">
            {formatPrice(price)}
          </span>
        </div>
        {description && (
          <p className="line-clamp-2 text-sm leading-6 text-zinc-600">{description}</p>
        )}
      </div>
    </article>
  );
}

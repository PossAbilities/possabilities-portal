"use client";

import type { ContentItem } from "@/lib/seed";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";

export function ContentLibrary({ items }: { items: ContentItem[] }) {
  const toast = useToast();
  const soon = () => toast.show("Coming soon");

  return (
    <section id="content-library" className="mt-stack-lg scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter mb-8">
        <div>
          <h3 className="font-headline-md text-headline-md text-brand-purple">Content Library</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage images, videos, and news posts across the portal.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={soon} className="bg-brand-teal text-on-tertiary-fixed font-label-bold text-label-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
            <Icon name="upload" /> Upload
          </button>
          <button onClick={soon} className="border-2 border-brand-purple text-brand-purple font-label-bold text-label-bold px-6 py-3 rounded-xl hover:bg-brand-purple hover:text-surface-white transition-all">
            Categories
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        {items.map((c) => (
          <div key={c.id} className="group cursor-pointer">
            <div className="aspect-square rounded-xl overflow-hidden mb-2 border-2 border-outline-variant group-hover:border-brand-teal transition-all relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={c.name} src={c.image} />
              <div className="absolute top-2 right-2 bg-brand-purple/80 text-surface-white p-1 rounded-md flex">
                <Icon name={c.type === "photo" ? "photo" : "video_library"} size={16} />
              </div>
            </div>
            <p className="font-label-bold text-caption truncate">{c.name}</p>
          </div>
        ))}
        <button onClick={soon} className="group cursor-pointer border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center aspect-square hover:bg-surface-container transition-all">
          <Icon name="add_circle" size={36} className="text-brand-purple" />
          <p className="font-label-bold text-caption mt-2">Add New</p>
        </button>
      </div>
    </section>
  );
}

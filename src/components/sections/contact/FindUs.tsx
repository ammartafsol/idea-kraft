import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { GlobeVisual } from "@/components/three/GlobeVisual";
import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { LocalTime } from "./LocalTime";

/** Dark band on /contact: interactive globe pointing at the studio, beside the address and local time. */
export function FindUs() {
  const a = siteConfig.address;
  const full = `${a.street}, ${a.city}, ${a.region} ${a.postalCode}, ${a.country}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(full)}`;
  const coords = `${Math.abs(a.lat).toFixed(4)}° ${a.lat >= 0 ? "N" : "S"}, ${Math.abs(a.lng).toFixed(4)}° ${a.lng >= 0 ? "E" : "W"}`;

  return (
    <section
      aria-labelledby="find-us-title"
      className="relative overflow-hidden bg-inverse text-inverse-fg"
    >
      <div className="container-x grid items-center gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-10">
        <div className="relative order-2 lg:order-1 lg:col-span-7">
          <GlobeVisual
            lat={a.lat}
            lng={a.lng}
            label="Idea Kraft"
            sublabel={`${a.city}, ${a.region}`}
            className="mx-auto aspect-square w-full max-w-[42rem] cursor-grab active:cursor-grabbing"
          />
          <p className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-mono text-[0.65rem] tracking-[0.14em] text-inverse-muted uppercase">
            <span>Drag to spin</span>
            <span aria-hidden>·</span>
            <span>{coords}</span>
          </p>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <p className="eyebrow flex items-center gap-3 text-inverse-muted">
            <span className="text-inverse-fg">(02)</span>
            <span aria-hidden className="h-px w-8 bg-inverse-line" />
            Find us
          </p>
          <SplitText id="find-us-title" lines={["Based in", "upstate New York."]} className="display-lg mt-6" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-inverse-muted">
              Our studio is in downtown Binghamton. Most of our work happens remotely with clients around the world,
              and visitors are always welcome by appointment.
            </p>

            <address className="mt-10 border-t border-inverse-line not-italic">
              <div className="flex gap-4 border-b border-inverse-line py-5">
                <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-lg">{a.street}</p>
                  <p className="text-inverse-muted">
                    {a.city}, {a.region} {a.postalCode}, {a.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 border-b border-inverse-line py-5">
                <Clock className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-lg">
                    <LocalTime timeZone={a.timeZone} />
                  </p>
                  <p className="text-inverse-muted">Local time in {a.city}</p>
                </div>
              </div>
            </address>

            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-medium text-accent-ink transition-transform active:scale-[0.97]"
            >
              Get directions
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

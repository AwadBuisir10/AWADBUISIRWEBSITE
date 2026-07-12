"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { cities, type City } from "@/data/cities";
import { landmasses, type LandRing } from "@/data/landmasses";

/**
 * Orthographic globe built from Natural Earth 110m land geometry.
 * Land is rasterized once into an equirectangular mask, then sampled into
 * halftone dots. This keeps coastlines geographically honest while matching
 * the portfolio's editorial data-visualization language.
 */

const DEG = Math.PI / 180;
const TILT = 20 * DEG;
const CENTER_LNG = -30;
const SWING_DEG = 13;
const SWING_PERIOD = 72;
const ROUTE_CYCLE = 6.4;
const ROUTE_LOOP = 12.8;
const ROUTE_STAGGER = 2.05;
const ARC_SAMPLES = 72;
const ARC_LIFT = 0.11;

const MASK_WIDTH = 720;
const MASK_HEIGHT = 360;
const DOT_STEP = 2.35;

const NAVY = "17, 26, 74";
const STEEL = "124, 127, 136";
const SEAFOAM = "22, 126, 108";
const SIGNAL = "236, 101, 43";

type Vec3 = { x: number; y: number; z: number };
type LandDot = { v: Vec3; size: number };
type Rgb = [number, number, number];
type Route = {
  city: City;
  points: { v: Vec3; lift: number }[];
};

const spectrum: Rgb[] = [
  [214, 86, 32],
  [159, 122, 238],
  [69, 117, 205],
  [113, 210, 240],
  [68, 180, 139],
  [244, 223, 105]
];

function toVec(latDeg: number, lngDeg: number): Vec3 {
  const lat = latDeg * DEG;
  const lng = lngDeg * DEG;
  return {
    x: Math.cos(lat) * Math.cos(lng),
    y: Math.cos(lat) * Math.sin(lng),
    z: Math.sin(lat)
  };
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const sinOmega = Math.sin(omega);
  const aWeight = Math.sin((1 - t) * omega) / sinOmega;
  const bWeight = Math.sin(t * omega) / sinOmega;
  return {
    x: aWeight * a.x + bWeight * b.x,
    y: aWeight * a.y + bWeight * b.y,
    z: aWeight * a.z + bWeight * b.z
  };
}

/** Orthographic projection centered on the supplied longitude and TILT. */
function project(v: Vec3, centerLng: number) {
  const lat = Math.asin(v.z);
  const lng = Math.atan2(v.y, v.x);
  const delta = lng - centerLng;
  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  return {
    x: cosLat * Math.sin(delta),
    y: Math.cos(TILT) * sinLat - Math.sin(TILT) * cosLat * Math.cos(delta),
    z: Math.sin(TILT) * sinLat + Math.cos(TILT) * cosLat * Math.cos(delta)
  };
}

const smooth = (value: number) =>
  value <= 0 ? 0 : value >= 1 ? 1 : value * value * (3 - 2 * value);

function spectrumColor(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  const scaled = clamped * (spectrum.length - 1);
  const index = Math.min(spectrum.length - 2, Math.floor(scaled));
  const mix = scaled - index;
  const from = spectrum[index];
  const to = spectrum[index + 1];
  return [
    Math.round(from[0] + (to[0] - from[0]) * mix),
    Math.round(from[1] + (to[1] - from[1]) * mix),
    Math.round(from[2] + (to[2] - from[2]) * mix)
  ] as Rgb;
}

const colorRamp = Array.from({ length: 121 }, (_, index) =>
  spectrumColor(index / 120).join(", ")
);

function unwrapRing(ring: LandRing) {
  const points: [number, number][] = [];
  let previousX = 0;

  ring.forEach(([lat, lng], index) => {
    let x = ((lng + 180) / 360) * MASK_WIDTH;
    const y = ((90 - lat) / 180) * MASK_HEIGHT;

    if (index > 0) {
      while (x - previousX > MASK_WIDTH / 2) x -= MASK_WIDTH;
      while (x - previousX < -MASK_WIDTH / 2) x += MASK_WIDTH;
    }

    points.push([x, y]);
    previousX = x;
  });

  return points;
}

function buildLandDots(): LandDot[] {
  const mask = document.createElement("canvas");
  mask.width = MASK_WIDTH;
  mask.height = MASK_HEIGHT;
  const maskContext = mask.getContext("2d", { willReadFrequently: true });
  if (!maskContext) return [];

  maskContext.fillStyle = "#fff";
  for (const ring of landmasses) {
    const points = unwrapRing(ring);
    for (const shift of [-MASK_WIDTH, 0, MASK_WIDTH]) {
      maskContext.beginPath();
      points.forEach(([x, y], index) => {
        if (index === 0) maskContext.moveTo(x + shift, y);
        else maskContext.lineTo(x + shift, y);
      });
      maskContext.closePath();
      maskContext.fill();
    }
  }

  const pixels = maskContext.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT).data;
  const dots: LandDot[] = [];
  let row = 0;

  for (let lat = -82; lat <= 84; lat += DOT_STEP) {
    const offset = row % 2 === 0 ? 0 : DOT_STEP / 2;
    for (let lng = -180 + offset; lng < 180; lng += DOT_STEP) {
      const x = Math.max(
        0,
        Math.min(MASK_WIDTH - 1, Math.floor(((lng + 180) / 360) * MASK_WIDTH))
      );
      const y = Math.max(
        0,
        Math.min(MASK_HEIGHT - 1, Math.floor(((90 - lat) / 180) * MASK_HEIGHT))
      );
      if (pixels[(y * MASK_WIDTH + x) * 4 + 3] < 32) continue;

      const hash = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
      dots.push({
        v: toVec(lat, lng),
        size: hash - Math.floor(hash)
      });
    }
    row += 1;
  }

  return dots;
}

const home = cities.find((city) => city.home) ?? cities[0];
const homeVec = toVec(home.lat, home.lng);
const landRings = landmasses.map((ring) => ring.map(([lat, lng]) => toVec(lat, lng)));

function buildRoute(city: City): Route {
  const target = toVec(city.lat, city.lng);
  const points: Route["points"] = [];
  for (let index = 0; index <= ARC_SAMPLES; index += 1) {
    const progress = index / ARC_SAMPLES;
    points.push({
      v: slerp(homeVec, target, progress),
      lift: Math.sin(Math.PI * progress) * ARC_LIFT
    });
  }
  return { city, points };
}

const routes = cities
  .filter((city) => city.marker === "work" || city.marker === "purpose")
  .map(buildRoute);
const chapterRoutes = cities
  .filter((city) => city.marker === "inspired" || city.marker === "network")
  .map(buildRoute);

export function GlobeNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const reducedMotion = useReducedMotion();
  const [activeCityName, setActiveCityName] = useState(home.name);
  const activeCity = cities.find((city) => city.name === activeCityName) ?? home;

  const navigateToStory = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", href);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const landDots = buildLandDots();
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let inView = true;
    const start = performance.now();

    const drawFrame = (time: number) => {
      const reduced = reducedQuery.matches;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.46;
      const centerLng =
        (CENTER_LNG +
          (reduced ? 0 : SWING_DEG * Math.sin((2 * Math.PI * time) / SWING_PERIOD))) *
        DEG;

      context.clearRect(0, 0, width, height);

      const halo = context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.25,
        centerX,
        centerY,
        radius * 1.18
      );
      halo.addColorStop(0, "rgba(136, 222, 235, 0.10)");
      halo.addColorStop(0.58, "rgba(30, 65, 153, 0.035)");
      halo.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${NAVY}, 0.2)`;
      context.lineWidth = 1;
      context.stroke();

      const screenX = (point: { x: number; y: number }, lift = 0) =>
        centerX + radius * (1 + lift) * point.x;
      const screenY = (point: { x: number; y: number }, lift = 0) =>
        centerY - radius * (1 + lift) * point.y;

      const traceVisible = (samples: Vec3[]) => {
        context.beginPath();
        let penDown = false;
        for (const vector of samples) {
          const point = project(vector, centerLng);
          if (point.z > 0.006) {
            if (penDown) context.lineTo(screenX(point), screenY(point));
            else context.moveTo(screenX(point), screenY(point));
            penDown = true;
          } else {
            penDown = false;
          }
        }
        context.stroke();
      };

      const traceLiftedRoute = (
        points: Route["points"],
        startIndex = 0,
        endIndex = ARC_SAMPLES
      ) => {
        context.beginPath();
        let penDown = false;
        for (let index = startIndex; index <= endIndex; index += 1) {
          const { v, lift } = points[index];
          const point = project(v, centerLng);
          if (point.z > -0.055) {
            if (penDown) context.lineTo(screenX(point, lift), screenY(point, lift));
            else context.moveTo(screenX(point, lift), screenY(point, lift));
            penDown = true;
          } else {
            penDown = false;
          }
        }
      };

      // Latitude/longitude grid beneath the land layer.
      context.strokeStyle = `rgba(${STEEL}, 0.085)`;
      context.lineWidth = 1;
      for (let lng = -180; lng < 180; lng += 20) {
        const line: Vec3[] = [];
        for (let lat = -88; lat <= 88; lat += 3) line.push(toVec(lat, lng));
        traceVisible(line);
      }
      for (let lat = -60; lat <= 75; lat += 15) {
        const line: Vec3[] = [];
        for (let lng = -180; lng <= 180; lng += 3) line.push(toVec(lat, lng));
        traceVisible(line);
      }

      // Accurate Natural Earth coastline outlines. No partial polygon fills,
      // which were the source of the previous horizon distortion.
      context.strokeStyle = `rgba(${NAVY}, 0.2)`;
      context.lineWidth = 0.8;
      for (const ring of landRings) traceVisible(ring);

      // Signature halftone land layer from the design reference.
      const dotScale = Math.max(0.78, Math.min(1.25, radius / 300));
      const dotStride = width < 520 ? 2 : 1;
      for (let dotIndex = 0; dotIndex < landDots.length; dotIndex += dotStride) {
        const dot = landDots[dotIndex];
        const point = project(dot.v, centerLng);
        if (point.z <= 0.004) continue;
        const edgeFade = smooth(point.z / 0.24);
        const rampIndex = Math.max(
          0,
          Math.min(colorRamp.length - 1, Math.round(((point.x + 1) / 2) * (colorRamp.length - 1)))
        );
        const dotRadius = (0.82 + dot.size * 0.72) * dotScale * (0.8 + point.z * 0.24);

        context.beginPath();
        context.arc(screenX(point), screenY(point), dotRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${colorRamp[rampIndex]}, ${0.2 + edgeFade * 0.5})`;
        context.fill();
      }

      // Chapter routes stay quiet and static; color distinguishes the four
      // U.S. chapters inspired by Boston from the broader global network.
      context.save();
      context.setLineDash([2, 6]);
      chapterRoutes.forEach((route) => {
        traceLiftedRoute(route.points);
        context.strokeStyle =
          route.city.marker === "inspired"
            ? `rgba(${SIGNAL}, 0.2)`
            : `rgba(${SEAFOAM}, 0.16)`;
        context.lineWidth = 0.85;
        context.stroke();
      });
      context.restore();

      // Great-circle routes from Boston.
      const arrivals = new Map<string, number>();
      routes.forEach((route, routeIndex) => {
        let head = 1;
        let tail = 0;
        let glow = 0.22;

        if (!reduced) {
          const local =
            (((time - routeIndex * ROUTE_STAGGER) % ROUTE_LOOP) + ROUTE_LOOP) % ROUTE_LOOP;
          const progress = local / ROUTE_CYCLE;
          if (progress >= 1) return;
          head = smooth(Math.min(1, progress / 0.4));
          tail = progress < 0.52 ? 0 : smooth((progress - 0.52) / 0.44);
          glow = Math.exp(-(((progress - 0.44) / 0.16) ** 2));
          arrivals.set(route.city.name, progress > 0.36 ? glow : 0);
        }

        const startIndex = Math.floor(tail * ARC_SAMPLES);
        const endIndex = Math.ceil(head * ARC_SAMPLES);
        if (endIndex <= startIndex) return;

        traceLiftedRoute(route.points, startIndex, endIndex);
        context.strokeStyle = `rgba(${SEAFOAM}, ${0.25 + 0.62 * glow})`;
        context.lineWidth = 1 + 0.7 * glow;
        context.stroke();
      });

      // Real city coordinates, projected on the same sphere as the land.
      for (const city of cities) {
        const point = project(toVec(city.lat, city.lng), centerLng);
        const x = screenX(point);
        const y = screenY(point);
        const isHome = city === home;
        const node = nodeRefs.current[city.name];

        if (node) {
          const nodeVisible = point.z > 0.08 && width >= 320;
          node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
          node.style.opacity = nodeVisible
            ? String(Math.max(0.35, smooth((point.z + 0.02) / 0.3)))
            : "0";
          node.style.pointerEvents = nodeVisible ? "auto" : "none";
        }

        if (point.z <= -0.02) continue;
        const fade = smooth((point.z + 0.02) / 0.3);

        if (isHome && !reduced) {
          const pulse = (time % 3.2) / 3.2;
          context.beginPath();
          context.arc(x, y, 4 + pulse * 15, 0, Math.PI * 2);
          context.strokeStyle = `rgba(${SIGNAL}, ${(1 - pulse) * 0.46 * fade})`;
          context.lineWidth = 1;
          context.stroke();
        }

        const arrival = arrivals.get(city.name) ?? 0;
        const chapterNode = city.marker === "inspired" || city.marker === "network";
        const signalNode = city.marker === "origin" || city.marker === "inspired";
        context.beginPath();
        context.arc(
          x,
          y,
          isHome ? 3.5 : (chapterNode ? 1.75 : 2.2) + arrival * 1.2,
          0,
          Math.PI * 2
        );
        context.fillStyle = signalNode
          ? `rgba(${SIGNAL}, ${0.94 * fade})`
          : `rgba(${SEAFOAM}, ${(0.62 + 0.36 * arrival) * fade})`;
        context.fill();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (reducedQuery.matches) drawFrame(0);
    };

    let lastDraw = 0;
    const loop = (now: number) => {
      const frameInterval = width < 520 ? 1000 / 24 : 1000 / 40;
      if (now - lastDraw >= frameInterval) {
        drawFrame((now - start) / 1000);
        lastDraw = now;
      }
      frame = requestAnimationFrame(loop);
    };

    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      if (running) frame = requestAnimationFrame(loop);
      else cancelAnimationFrame(frame);
    };

    const applyMotionPreference = () => {
      if (reducedQuery.matches) {
        setRunning(false);
        drawFrame(0);
      } else {
        setRunning(inView);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      applyMotionPreference();
    });
    const resizeObserver = new ResizeObserver(resize);

    resize();
    applyMotionPreference();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    reducedQuery.addEventListener("change", applyMotionPreference);

    return () => {
      setRunning(false);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedQuery.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none h-full w-full select-none font-mono"
      />

      <div className="absolute inset-0">
        {cities.map((city) => {
          const primaryNode =
            city.marker === "origin" || city.marker === "work" || city.marker === "purpose";
          const signalNode = city.marker === "origin" || city.marker === "inspired";
          const active = activeCityName === city.name;

          return (
            <a
              key={city.name}
              ref={(node) => {
                nodeRefs.current[city.name] = node;
              }}
              href={city.story.href}
              onClick={(event) => navigateToStory(event, city.story.href)}
              onMouseEnter={() => setActiveCityName(city.name)}
              onMouseLeave={() => setActiveCityName(home.name)}
              onFocus={() => setActiveCityName(city.name)}
              onBlur={() => setActiveCityName(home.name)}
              aria-label={`${city.name}: ${city.story.title}`}
              className={`group absolute left-0 top-0 z-20 h-8 w-8 items-center justify-center rounded-full opacity-0 transition-[opacity,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 ${primaryNode ? "flex" : "hidden lg:flex"} ${
                primaryNode
                  ? "border border-navy/20 bg-white/90 shadow-card"
                  : active
                    ? "border border-navy/20 bg-white/90 shadow-card"
                    : "border border-transparent bg-transparent hover:border-navy/20 hover:bg-white/90 hover:shadow-card"
              }`}
            >
              <span
                className={`rounded-full transition-transform duration-200 group-hover:scale-150 ${
                  city.marker === "origin"
                    ? "h-2.5 w-2.5"
                    : primaryNode
                      ? "h-2 w-2"
                      : "h-1.5 w-1.5"
                } ${signalNode ? "bg-signal" : "bg-seafoam-700"}`}
                aria-hidden="true"
              />
              {city.marker !== "inspired" || active ? (
                <span
                  style={{ marginTop: city.label.offsetY ?? 0 }}
                  className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center whitespace-nowrap rounded border bg-white/95 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.04em] shadow-card transition-[color,border-color,transform] duration-200 group-hover:text-navy ${
                    city.label.side === "right" ? "left-full ml-1" : "right-full mr-1"
                  } ${active ? "border-navy/30 text-navy" : "border-line text-navy/75"}`}
                >
                  {city.name}
                </span>
              ) : null}
            </a>
          );
        })}
      </div>

      {activeCity ? (
        <a
          href={activeCity.story.href}
          onClick={(event) => navigateToStory(event, activeCity.story.href)}
          className="absolute bottom-[6%] left-[9%] z-30 hidden w-[18.5rem] overflow-hidden rounded-lg border border-white bg-white/95 p-4 shadow-widget backdrop-blur-md transition-transform duration-200 hover:-translate-y-1 lg:block 2xl:w-[21rem] 2xl:p-5"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCity.name}
              initial={reducedMotion ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                {activeCity.story.eyebrow}
              </p>
              <p className="mt-2 font-display text-base font-medium leading-5 text-navy 2xl:text-lg 2xl:leading-6">
                {activeCity.story.title}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-seafoam-700">
                {activeCity.story.metric}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate 2xl:text-sm 2xl:leading-6">
                {activeCity.story.detail}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.11em] text-navy">
                Explore story
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-3 font-mono text-[8px] uppercase tracking-[0.06em] text-steel">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              Boston + inspired chapters
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-seafoam-700" aria-hidden="true" />
              Global network
            </span>
          </div>
        </a>
      ) : null}
    </div>
  );
}

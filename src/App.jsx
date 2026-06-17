import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import {
  Database,
  ExternalLink,
  Layers,
  Layout,
  Code,
  Sun,
  Moon,
  Menu,
  X,
  Send,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SiJavascript, SiReact, SiTailwindcss } from "react-icons/si";
import ContactForm from "./components/ContactForm";

const SECTION_X = "px-4 sm:px-6 md:px-10";
const SECTION_Y = "py-20 sm:py-24 md:py-28 lg:py-36";
const SECTION_Y_LG = "py-24 sm:py-28 md:py-32 lg:py-40";
const PANEL_ROUNDED = "rounded-3xl";
const INTERACTIVE_SELECTOR = "a, button, [data-cursor='interactive'], [data-cursor='card']";

const applyMagneticEffect = (event, intensity = 18) => {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  element.style.transform = `translate3d(${x / intensity}px, ${y / intensity}px, 0)`;
};

const resetMagneticEffect = (event) => {
  event.currentTarget.style.transform = "translate3d(0, 0, 0)";
};

const MagneticCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorScale = useMotionValue(1);
  const springConfig = { damping: 30, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorScaleSpring = useSpring(cursorScale, { damping: 24, stiffness: 340 });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;
      cursorScale.set(target.dataset.cursor === "card" ? 1.8 : 1.35);
    };

    const onMouseOut = (e) => {
      const nextTarget = e.relatedTarget?.closest?.(INTERACTIVE_SELECTOR);
      if (nextTarget) return;
      cursorScale.set(1);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [cursorX, cursorY, cursorScale]);

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen
        border border-indigo-500/45 dark:border-indigo-300/60
        bg-white/5 dark:bg-indigo-300/[0.04]
        shadow-[0_0_18px_rgba(99,102,241,0.18)] dark:shadow-[0_0_22px_rgba(129,140,248,0.3)]
        transition-[background-color,border-color] duration-200"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        scale: cursorScaleSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};

const SkillCard = ({ title, skills, icon: Icon, accentClass, index = 0, delayMs = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.5, delay: delayMs / 1000, ease: [0.2, 0.8, 0.2, 1] }}
  >
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="theme-panel-strong relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-7 lg:p-8
        group transition-[border-color,box-shadow] duration-300
        hover:border-[hsl(var(--surface-border-strong)/0.9)]
        hover:shadow-[0_24px_50px_-20px_rgba(99,102,241,0.35)] h-full"
    >
      <div
        className={`absolute -right-4 -top-4 w-32 h-32 blur-3xl opacity-60 transition-opacity group-hover:opacity-90 ${accentClass}`}
      />
      <span className="absolute top-4 right-5 z-10 text-2xl md:text-3xl font-black tabular-nums text-neutral-900/[0.06] dark:text-white/[0.08] group-hover:text-indigo-500/20 dark:group-hover:text-cyan-300/20 transition-colors duration-300">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative z-10">
        <div className="theme-icon-shell w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 md:mb-6 text-[hsl(var(--text-soft))] dark:text-white/65 group-hover:text-indigo-500 dark:group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-300">
          <Icon size={22} />
        </div>
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 tracking-tight leading-snug text-neutral-900 dark:text-white">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span
              key={i}
              className="px-2.5 py-1.5 rounded-lg text-[10px] tracking-[0.1em] uppercase
                bg-[hsl(var(--surface-muted)/0.82)] dark:bg-[hsl(var(--surface-muted)/0.86)]
                border border-[hsl(var(--surface-border)/0.6)]
                text-[hsl(var(--text-faint))] dark:text-white/50
                group-hover:text-neutral-700 dark:group-hover:text-white/70
                group-hover:border-[hsl(var(--surface-border-strong)/0.7)] transition-colors duration-300"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const tagColors = {
  React: "bg-cyan-500/15 text-cyan-400 dark:text-cyan-300 border-cyan-500/20",
  Tailwind: "bg-sky-500/15 text-sky-400 dark:text-sky-300 border-sky-500/20",
  Fullstack:
    "bg-indigo-500/15 text-indigo-400 dark:text-indigo-300 border-indigo-500/20",
  "Node.js":
    "bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 border-emerald-500/20",
  mongodb:
    "bg-green-500/15 text-green-400 dark:text-green-300 border-green-500/20",
};

const WALLPAPER_PALETTES = [
  {
    bg: "linear-gradient(135deg, #060d1f 0%, #0f1d3d 55%, #0a1530 100%)",
    primary: "#6366f1",
    secondary: "#818cf8",
    label: "FULLSTACK · WEB APP",
  },
  {
    bg: "linear-gradient(135deg, #051a10 0%, #082e1c 55%, #051812 100%)",
    primary: "#34d399",
    secondary: "#6ee7b7",
    label: "DASHBOARD · NODE.JS",
  },
  {
    bg: "linear-gradient(135deg, #1c0f00 0%, #3b2000 55%, #1e1100 100%)",
    primary: "#fbbf24",
    secondary: "#fde68a",
    label: "APP · REACT",
  },
  {
    bg: "linear-gradient(135deg, #0f0520 0%, #1e0d3d 55%, #0d0318 100%)",
    primary: "#a78bfa",
    secondary: "#c4b5fd",
    label: "PRODUCTIVITY · WEB",
  },
];

const ProjectWallpaper = ({ index, title }) => {
  const p = WALLPAPER_PALETTES[index % WALLPAPER_PALETTES.length];
  return (
    <div className="h-full w-full relative overflow-hidden" style={{ background: p.bg }}>
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${p.primary}40 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-64 h-36 rounded-full blur-3xl opacity-35"
          style={{ background: p.primary }}
        />
      </div>
      {/* Ghost title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-black uppercase tracking-tight leading-none select-none"
          style={{
            color: p.primary,
            opacity: 0.07,
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
      </div>
      {/* Geometric SVG decoration */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle cx="200" cy="110" r="78" fill="none" stroke={p.primary} strokeWidth="0.6" opacity="0.2" />
        <circle cx="200" cy="110" r="48" fill="none" stroke={p.secondary} strokeWidth="0.4" opacity="0.15" />
        <line x1="0" y1="110" x2="400" y2="110" stroke={p.primary} strokeWidth="0.4" strokeDasharray="5 10" opacity="0.18" />
        <line x1="200" y1="0" x2="200" y2="220" stroke={p.primary} strokeWidth="0.4" strokeDasharray="5 10" opacity="0.18" />
        <circle cx="200" cy="110" r="4" fill={p.primary} opacity="0.5" />
        <circle cx="122" cy="32" r="2" fill={p.secondary} opacity="0.4" />
        <circle cx="310" cy="185" r="2.5" fill={p.primary} opacity="0.35" />
      </svg>
      {/* Category label */}
      <div
        className="absolute bottom-3 left-3 text-[9px] tracking-[0.28em] font-mono font-semibold"
        style={{ color: p.primary, opacity: 0.65 }}
      >
        {p.label}
      </div>
      {/* Status dot */}
      <div
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
        style={{ background: p.primary, boxShadow: `0 0 10px ${p.primary}` }}
      />
    </div>
  );
};

const getSlidesPerView = (width) => {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};

const CAROUSEL_GAP_PX = 16;

const ProjectItem = ({
  title,
  description,
  tags,
  link,
  index = 0,
  total = 0,
  delayMs = 0,
  inCarousel = false,
}) => {
  const getTagStyle = (tag) =>
    tagColors[tag] ||
    "bg-[hsl(var(--surface-muted)/0.75)] text-[hsl(var(--text-soft))] dark:text-white/60 border-[hsl(var(--surface-border)/0.45)]";
  const siteHost = (() => {
    try {
      return new URL(link).hostname.replace(/^www\./, "");
    } catch {
      return link;
    }
  })();

  const motionProps = inCarousel
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.05 },
        transition: { duration: 0.5, delay: delayMs / 1000, ease: [0.2, 0.8, 0.2, 1] },
      };

  return (
    <motion.div
      {...motionProps}
      className={inCarousel ? "h-full w-full min-w-0" : "flex-shrink-0 snap-start w-[min(100%,320px)] sm:w-[300px] md:w-[340px]"}
    >
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 25 }}
      className="theme-panel-strong relative group overflow-hidden rounded-2xl
        border-[hsl(var(--surface-border)/0.75)]
        hover:border-[hsl(var(--surface-border-strong)/0.95)]/95
        hover:shadow-[0_20px_48px_-18px_rgba(99,102,241,0.4)]
        transition-[border-color,box-shadow] duration-300 h-full flex flex-col"
      data-cursor="card"
    >
      <div className="relative h-36 sm:h-40 overflow-hidden rounded-t-2xl">
        <div className="absolute left-0 right-0 top-0 z-20 h-8 flex items-center justify-between px-3 bg-slate-950/90 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400/70" />
            <span className="w-2 h-2 rounded-full bg-amber-400/70" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
          </div>
          <span className="text-[9px] text-white/50 tracking-[0.15em] font-mono truncate max-w-[70%]">
            {siteHost}
          </span>
        </div>
        <div className="absolute inset-0 top-8 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <ProjectWallpaper index={index} title={title} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Project index badge */}
        <span className="absolute top-11 left-4 z-20 text-[10px] font-mono font-semibold tracking-[0.25em] text-white/45">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        {/* Hover overlay CTA */}
        <div className="absolute inset-0 top-8 z-10 flex items-center justify-center bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em]
            bg-white/10 text-white border border-white/25 backdrop-blur-sm
            translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <ExternalLink size={13} />
            View Project
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5 relative z-10 flex flex-col flex-1">
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-[hsl(var(--text-soft))] dark:text-white/55 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider uppercase border ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-[hsl(var(--surface-border)/0.5)]">
          <span className="text-[9px] font-mono tracking-[0.12em] text-[hsl(var(--text-faint))] dark:text-white/35 truncate min-w-0">
            {siteHost}
          </span>
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open live site for ${title}`}
            data-cursor="interactive"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] shrink-0
              bg-indigo-500 text-white border border-indigo-400/80
              shadow-[0_6px_16px_rgba(99,102,241,0.22)]
              hover:bg-indigo-600 transition-colors"
          >
            <ExternalLink size={12} />
            <span>Live</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
    </motion.div>
  );
};

const carouselNavBtnClass =
  "theme-panel w-10 h-10 rounded-full flex items-center justify-center shrink-0 " +
  "text-[hsl(var(--text-soft))] dark:text-white/70 " +
  "hover:text-indigo-500 dark:hover:text-cyan-300 hover:border-indigo-500/30 " +
  "disabled:opacity-35 disabled:pointer-events-none disabled:cursor-not-allowed " +
  "transition-all duration-200";

const ProjectCarousel = ({ projects }) => {
  const viewportRef = useRef(null);
  const touchStartX = useRef(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const maxIndex = Math.max(0, projects.length - slidesPerView);

  const updateLayout = useCallback(() => {
    setSlidesPerView(getSlidesPerView(window.innerWidth));
    const el = viewportRef.current;
    if (!el) return;
    const spv = getSlidesPerView(window.innerWidth);
    const w = el.offsetWidth;
    setSlideWidth((w - CAROUSEL_GAP_PX * (spv - 1)) / spv);
  }, []);

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [updateLayout]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateLayout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateLayout]);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const offset = index * (slideWidth + CAROUSEL_GAP_PX);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 48) {
      if (dx > 0) {
        setDirection(1);
        setIndex((i) => Math.min(maxIndex, i + 1));
      } else {
        setDirection(-1);
        setIndex((i) => Math.max(0, i - 1));
      }
    }
    touchStartX.current = null;
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const pageCount = maxIndex + 1;
  const currentPage = index + 1;

  const carouselControls = (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentPage}
          initial={reduceMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
          transition={{ duration: 0.22 }}
          className="text-[10px] font-mono tabular-nums tracking-[0.2em] text-[hsl(var(--text-faint))] dark:text-white/40 mr-1 inline-block min-w-[3.5rem] text-right"
        >
          {String(currentPage).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
      <button
        type="button"
        onClick={goPrev}
        disabled={index === 0}
        aria-label="Previous projects"
        data-cursor="interactive"
        className={carouselNavBtnClass}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={index >= maxIndex}
        aria-label="Next projects"
        data-cursor="interactive"
        className={carouselNavBtnClass}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-6 md:gap-10">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-indigo-500 dark:text-indigo-400 mb-3">
            Selected Work
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-[7vw] lg:text-[8vw] font-black uppercase tracking-tight leading-[0.88] text-neutral-900 dark:text-white">
            Projects
            <br />
            <span className="text-neutral-300 dark:text-white/12">
              &amp; Cases
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-3 w-full md:w-auto shrink-0">
          <p className="hidden md:block max-w-[240px] text-[11px] leading-relaxed text-[hsl(var(--text-faint))] dark:text-white/35 text-right">
            Real projects. Live deployments. Built with care and attention to detail.
          </p>
          <div className="hidden md:flex items-center gap-3">
            <span className="h-px w-14 bg-indigo-500/30" />
            {carouselControls}
          </div>
          <div className="flex md:hidden justify-end w-full">{carouselControls}</div>
        </div>
      </div>

      <div className="relative md:px-12">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous projects"
          data-cursor="interactive"
          className={`${carouselNavBtnClass} absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex`}
        >
          <ChevronLeft size={22} />
        </button>

        <div
          ref={viewportRef}
          className="overflow-hidden touch-pan-x outline-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project slides"
        >
          <motion.div
            className="flex gap-4 will-change-transform"
            animate={{ x: slideWidth > 0 ? -offset : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 240, damping: 28, mass: 0.85 }
            }
          >
            {projects.map((proj, i) => {
              const isVisible = i >= index && i < index + slidesPerView;
              return (
                <motion.div
                  key={isVisible ? `${proj.title}-${index}` : proj.title}
                  className="flex-shrink-0"
                  style={{ width: slideWidth > 0 ? slideWidth : "100%" }}
                  aria-hidden={!isVisible}
                  initial={
                    reduceMotion || !isVisible
                      ? false
                      : { opacity: 0, x: direction * 28, y: 12, scale: 0.97 }
                  }
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: isVisible ? (i - index) * 0.07 : 0,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                >
                  <ProjectItem
                    inCarousel
                    index={i}
                    total={projects.length}
                    title={proj.title}
                    description={proj.description}
                    tags={proj.tags}
                    link={proj.link}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={index >= maxIndex}
          aria-label="Next projects"
          data-cursor="interactive"
          className={`${carouselNavBtnClass} absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex`}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </>
  );
};

const NAV_ITEMS = ["About", "Stack", "Works", "Connect"];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    let rafId = null;
    const onPointerMove = (event) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        root.style.setProperty("--spotlight-x", `${x}%`);
        root.style.setProperty("--spotlight-y", `${y}%`);
        rafId = null;
      });
    };

    root.style.setProperty("--spotlight-x", "50%");
    root.style.setProperty("--spotlight-y", "24%");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.toLowerCase());
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = 104;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    setMobileMenuOpen(false);
  }, []);

  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleHero = useTransform(smoothY, [0, 0.2], [1, 0.95]);
  const opacityHero = useTransform(smoothY, [0, 0.15], [1, 0]);

  const projects = [
    {
      title: "UpFix",
      description:
        "แพลตฟอร์มให้นักเรียนแจ้งปัญหาในโรงเรียนและโหวตจัดลำดับความสำคัญ โปร่งใส รวดเร็ว ส่งตรงถึงผู้แก้ไขจริง",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://upfix-web.pages.dev/",
    },
    {
      title: "CP67 Dashboard",
      description:
        "แดชบอร์ดห้องเรียน CP67 กรอกรหัสห้องเพื่อดูการบ้านและตารางสอบ สำหรับสมาชิกห้อง",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://cp67-web.pages.dev/",
    },
    {
      title: "Osara Web",
      description:
        "เว็บแอปพลิเคชันแบบ Full-stack สำหรับจัดการธุรกิจ ใช้ React สร้าง UI และ Node.js ทำ API",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://osara-web.vercel.app/",
    },
    {
      title: "Exam dashboard",
      description:
        "ระบบจัดการข้อสอบและคะแนน เชื่อมต่อ MongoDB เก็บข้อมูล real-time",
      tags: ["Node.js", "mongodb"],
      link: "https://exam-dashboard-uuii.vercel.app/",
    },
    {
      title: "Pokemon App",
      description:
        "แอปค้นหาและดูข้อมูล Pokemon ใช้ React + Tailwind สร้าง UI สวยงาม",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://pikachu-project-jd9e.vercel.app/",
    },
    {
      title: "Foucus website",
      description:
        "เว็บไซต์โฟกัสและ productivity ใช้ React และ Tailwind ออกแบบให้ใช้งานง่าย",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://focus-web-ten.vercel.app/",
    },
  ];

  const aboutSkills = [
    {
      name: "React",
      icon: SiReact,
      tone: "bg-cyan-500/15 text-cyan-500 dark:text-cyan-300 border-cyan-500/25",
    },
    {
      name: "Tailwind",
      icon: SiTailwindcss,
      tone: "bg-sky-500/15 text-sky-500 dark:text-sky-300 border-sky-500/25",
    },
    {
      name: "JavaScript",
      icon: SiJavascript,
      tone: "bg-amber-500/15 text-amber-500 dark:text-amber-300 border-amber-500/25",
    },
    {
      name: "EmailJS",
      icon: Send,
      tone: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300 border-indigo-500/25",
    },
  ];

  return (
    <div
      id="top"
      className="theme-shell min-h-screen overflow-x-hidden font-sans
      bg-background text-foreground
      selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30 selection:text-white"
    >
      <MagneticCursor />

      {/* Progress Rail */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-[hsl(var(--surface-border)/0.4)] z-[100]">
        <motion.div
          className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.45)] origin-left"
          style={{ scaleX: smoothY }}
        />
      </div>

      {/* Navigation */}
      <nav
        role="navigation"
        aria-label="Primary"
        className={`fixed top-0 w-full z-50 ${SECTION_X} flex justify-between items-center pointer-events-none
          transition-all duration-300
          ${scrolled
            ? "py-3 md:py-4 bg-[hsl(var(--page-top)/0.72)] dark:bg-[hsl(var(--page-bottom)/0.72)] backdrop-blur-xl border-b border-[hsl(var(--surface-border)/0.5)] shadow-[0_6px_24px_-12px_rgba(15,23,42,0.25)]"
            : "py-5 md:py-8"}`}
      >
        <motion.a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Go to top"
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 pointer-events-auto cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)] group-hover:shadow-[0_0_14px_rgba(99,102,241,0.9)] transition-shadow" />
          <span className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            M<span className="text-indigo-500">-Stack</span>
          </span>
        </motion.a>

        {/* Desktop nav */}
        <div
          className="theme-panel hidden md:flex items-center gap-1.5
          px-2.5 py-2 rounded-full pointer-events-auto"
        >
          {NAV_ITEMS.map((item) => {
            const id = item.toLowerCase();
            const isActive = activeSection === id;
            return (
              <a
                key={item}
                href={`#${id}`}
                onClick={(event) => scrollToSection(event, id)}
                aria-label={`Go to ${item} section`}
                aria-current={isActive ? "true" : undefined}
                className={`relative px-4 py-2 rounded-full text-[10px] tracking-[0.32em] uppercase font-medium
                  transition-colors duration-300
                  ${isActive
                    ? "text-indigo-600 dark:text-cyan-300"
                    : "text-[hsl(var(--text-faint))] dark:text-white/60 hover:text-indigo-500 dark:hover:text-cyan-200"}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-cyan-300/10 border border-indigo-500/20 dark:border-cyan-300/20"
                  />
                )}
                <span className="relative z-10">{item}</span>
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 pointer-events-auto md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="theme-panel w-12 h-12 rounded-full flex items-center justify-center
              text-[hsl(var(--text-soft))] dark:text-white/70"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          <motion.button
            onClick={() => setIsDark(!isDark)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="theme-panel w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
              text-[hsl(var(--text-soft))] dark:text-white/55 hover:text-indigo-500 dark:hover:text-cyan-300
              hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ y: -18, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 18, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/35 dark:bg-slate-950/72 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setMobileMenuOpen(false);
            }}
            role="button"
            tabIndex={0}
            aria-label="Close mobile navigation"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="theme-panel fixed top-0 right-0 bottom-0 w-[min(300px,82vw)] z-50
              rounded-none border-l flex flex-col pt-20 px-6 md:hidden"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-indigo-500 dark:text-indigo-400">
                Menu
              </span>
              <motion.button
                onClick={() => setMobileMenuOpen(false)}
                whileTap={{ scale: 0.92 }}
                aria-label="Close menu"
                className="theme-panel w-9 h-9 rounded-full flex items-center justify-center
                  text-[hsl(var(--text-soft))] dark:text-white/60"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => {
                const id = item.toLowerCase();
                const isActive = activeSection === id;
                return (
                  <motion.a
                    key={item}
                    href={`#${id}`}
                    onClick={(event) => scrollToSection(event, id)}
                    aria-label={`Go to ${item} section`}
                    aria-current={isActive ? "true" : undefined}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className={`py-4 px-4 text-base font-semibold tracking-wide rounded-xl
                      transition-colors min-h-[52px] flex items-center gap-3
                      ${isActive
                        ? "text-indigo-500 dark:text-cyan-300 bg-indigo-500/[0.08]"
                        : "text-neutral-700 dark:text-white/85 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-500/[0.06] active:bg-indigo-500/10"}`}
                  >
                    <span className={`text-[10px] font-mono w-4 ${isActive ? "text-indigo-500 dark:text-cyan-300" : "text-indigo-500/50 dark:text-indigo-400/40"}`}>
                      0{i + 1}
                    </span>
                    {item}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-300" />
                    )}
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-auto pb-8 border-t border-[hsl(var(--surface-border)/0.5)] pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--text-faint))] dark:text-white/35">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </span>
                <motion.button
                  onClick={() => {
                    setIsDark(!isDark);
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="theme-panel w-11 h-11 rounded-full flex items-center justify-center
                    text-[hsl(var(--text-soft))] dark:text-white/60
                    hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className={`relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden ${SECTION_Y}`}>
        {/* Background treatment */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(99,102,241,0.13),transparent)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(99,102,241,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(6,182,212,0.06),transparent)] dark:bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(6,182,212,0.09),transparent)]" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(hsl(232 89% 62% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(232 89% 62% / 1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          style={{ scale: scaleHero, opacity: opacityHero }}
          className="relative z-10 flex flex-col items-center gap-8 md:gap-10"
        >
          {/* Eyebrow — availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="theme-panel flex items-center gap-2.5 rounded-full pl-3 pr-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-neutral-700 dark:text-white/70">
              Web Developer · ว่างรับงาน
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="text-[13vw] sm:text-[10vw] md:text-[11vw] font-black leading-[0.88] tracking-tighter uppercase"
          >
            <span className="text-neutral-900 dark:text-white block">Build</span>
            <span
              className="animate-gradient-text block bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Beautiful
            </span>
            <span className="text-neutral-900 dark:text-white block">Web</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
            className="max-w-lg text-sm md:text-base leading-relaxed tracking-wide text-[hsl(var(--text-soft))] dark:text-white/55"
          >
            React · Node.js · Tailwind — สร้างเว็บที่ดีกว่า เร็วกว่า
            <br className="hidden sm:block" />
            และใช้งานได้จริงในทุก Platform
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <div
              onMouseMove={(event) => applyMagneticEffect(event, 14)}
              onMouseLeave={resetMagneticEffect}
              className="transition-transform duration-200 will-change-transform"
            >
              <motion.a
                href="#connect"
                onClick={(event) => scrollToSection(event, "connect")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Hire me or contact me"
                data-cursor="interactive"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]
                  bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-400/70
                  shadow-[0_8px_28px_rgba(99,102,241,0.32)] transition-colors duration-200"
              >
                จ้างงาน / ติดต่อ
              </motion.a>
            </div>
            <div
              onMouseMove={(event) => applyMagneticEffect(event, 16)}
              onMouseLeave={resetMagneticEffect}
              className="transition-transform duration-200 will-change-transform"
            >
              <motion.a
                href="#works"
                onClick={(event) => scrollToSection(event, "works")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="View selected projects"
                data-cursor="interactive"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]
                  theme-panel border-[hsl(var(--surface-border)/0.8)]
                  hover:bg-white/70 dark:hover:bg-white/[0.07]
                  text-neutral-800 dark:text-white/85 transition-all duration-300"
              >
                ดูผลงาน
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-500/[0.05] dark:bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

        {/* Scroll cue */}
        <motion.a
          href="#about"
          onClick={(event) => scrollToSection(event, "about")}
          aria-label="Scroll to about section"
          data-cursor="interactive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase font-medium text-[hsl(var(--text-faint))] dark:text-white/35 group-hover:text-indigo-500 dark:group-hover:text-cyan-300 transition-colors">
            Scroll
          </span>
          <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-[hsl(var(--surface-border)/0.9)] dark:border-white/20 pt-1.5">
            <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-300" />
          </span>
        </motion.a>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`theme-section section-divider ${SECTION_X} ${SECTION_Y} border-y border-[hsl(var(--surface-border)/0.45)]`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className={`theme-panel-strong ${PANEL_ROUNDED} p-6 md:p-8 lg:p-10 md:col-span-3`}
          >
            <p className="text-[11px] tracking-[0.28em] uppercase text-indigo-500 dark:text-cyan-300 mb-3 font-semibold">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
              M-stack - Web Developer 
            </h2>
            <p className="theme-muted leading-relaxed mb-4">
              สวัสดีครับผม M-stack
              นักพัฒนาเว็บไซต์รุ่นใหม่ที่กำลังมุ่งมั่นหาประสบการณ์และสร้างรายได้จากการทำสิ่งที่รัก
              <br />
              ผมอาจจะเป็น Developer วัยเยาว์ แต่ผมให้ความสำคัญกับ
              'คุณภาพและความรับผิดชอบ' เป็นอันดับหนึ่ง
              ทุกโปรเจกต์คือโอกาสที่ผมจะได้พิสูจน์ฝีมือ
              ผมจึงเน้นการเขียนโค้ดที่สะอาด ทันสมัย และใช้งานได้จริง
              เพื่อให้ผลงานชิ้นนี้กลายเป็น Portfolio ที่ดีที่สุดสำหรับอนาคตของผม
              และเป็นเครื่องมือที่ทรงพลังที่สุดสำหรับธุรกิจของคุณ
            </p>
            <p className="theme-muted leading-relaxed mb-7">
              เป้าหมายของผมคือการส่งมอบงานที่ยอดเยี่ยมเกินคาด
              เพื่อสร้างความพึงพอใจและมิตรภาพที่ดีกับลูกค้าทุกคนที่ไว้วางใจให้โอกาสผมได้พิสูจน์ตัวเองครับ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
            className={`theme-panel-strong ${PANEL_ROUNDED} p-6 md:p-7 lg:p-8 md:col-span-2 h-full`}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-500 dark:text-cyan-300 font-semibold mb-4">
              Core Focus
            </p>
            <div className="space-y-3 mb-7">
              <div className="rounded-xl border border-[hsl(var(--surface-border)/0.7)] bg-[hsl(var(--surface-muted)/0.55)] px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">Quality over Quantity</p>
                <p className="theme-muted text-xs mt-1">ทุกงานต้องใช้งานจริง ดูดี และดูแลต่อได้</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--surface-border)/0.7)] bg-[hsl(var(--surface-muted)/0.55)] px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">Customer Satisfaction</p>
                <p className="theme-muted text-xs mt-1">สื่อสารชัด ส่งงานตรงเวลา และแก้ไขให้จนพอใจ</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {aboutSkills.map((skill) => (
                <div
                  key={skill.name}
                  className={`rounded-xl border px-2.5 py-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-normal min-w-0 overflow-hidden ${skill.tone}`}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center shrink-0">
                    <skill.icon size={14} />
                  </span>
                  <span className="truncate">{skill.name}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="#connect"
                onClick={(event) => scrollToSection(event, "connect")}
                aria-label="Let's talk"
                data-cursor="interactive"
                className="inline-flex justify-center items-center rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]
                  bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-400/80
                  shadow-[0_12px_24px_rgba(99,102,241,0.24)] transition-colors"
              >
                Let&apos;s Talk
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stack Section */}
      <section
        id="stack"
        className={`theme-section ${SECTION_X} ${SECTION_Y_LG}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-indigo-500/50 dark:bg-indigo-400/50" />
                <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-indigo-500 dark:text-indigo-400">
                  Tech Stack
                </p>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-neutral-900 dark:text-white">
                My
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
                  Skills
                </span>
              </h2>
            </div>
            <p className="theme-kicker text-[11px] tracking-[0.16em] uppercase max-w-xs md:text-right leading-relaxed">
              The Tech Behind the Logic — เครื่องมือที่ผมใช้สร้างงานจริง
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
            <SkillCard
              title="Frontend"
              index={0}
              skills={["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"]}
              icon={Layout}
              accentClass="bg-indigo-500/10 group-hover:bg-indigo-500/20"
              delayMs={40}
            />
            <SkillCard
              title="Backend"
              index={1}
              skills={["Node.js", "Express.js", "REST APIs"]}
              icon={Database}
              accentClass="bg-purple-500/10 group-hover:bg-purple-500/20"
              delayMs={100}
            />
            <SkillCard
              title="Databases"
              index={2}
              skills={["MongoDB", "PostgreSQL"]}
              icon={Layers}
              accentClass="bg-cyan-500/10 group-hover:bg-cyan-500/20"
              delayMs={160}
            />
            <SkillCard
              title="Programming Languages"
              index={3}
              skills={["Python", "C++", "C"]}
              icon={Code}
              accentClass="bg-sky-500/10 group-hover:bg-sky-500/20"
              delayMs={220}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="works"
        className={`theme-section theme-section-alt section-divider ${SECTION_X} ${SECTION_Y_LG} border-y`}
      >
        <div className="max-w-7xl mx-auto">
          <ProjectCarousel projects={projects} />
        </div>
      </section>

      <ContactForm />

      {/* Footer */}
      <footer
        className={`theme-section section-divider ${SECTION_X} pt-16 md:pt-20 pb-10 border-t relative overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top row: CTA + back to top */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-[hsl(var(--surface-border)/0.5)]">
            <div className="max-w-md">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white leading-tight">
                พร้อมเริ่มโปรเจกต์
                <br />
                ของคุณแล้วหรือยัง?
              </h3>
              <a
                href="#connect"
                onClick={(event) => scrollToSection(event, "connect")}
                data-cursor="interactive"
                className="inline-flex items-center gap-2 mt-5 rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]
                  bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-400/70
                  shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-colors"
              >
                <Send size={14} />
                เริ่มคุยกันเลย
              </a>
            </div>

            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Back to top"
              data-cursor="interactive"
              className="theme-panel group flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-2xl shrink-0
                text-[hsl(var(--text-soft))] dark:text-white/70 hover:text-indigo-500 dark:hover:text-cyan-300 transition-colors"
            >
              <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
              <span className="text-[8px] tracking-[0.2em] uppercase font-semibold">Top</span>
            </motion.button>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 pt-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-neutral-900 dark:text-white">
                M<span className="text-indigo-500">-stack</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--text-faint))] dark:text-white/30 ml-2">
                © {new Date().getFullYear()}
              </span>
            </div>

            <nav aria-label="Footer" className="flex gap-5 md:gap-7">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(event) => scrollToSection(event, item.toLowerCase())}
                  className="text-[9px] tracking-[0.3em] uppercase font-medium text-[hsl(var(--text-faint))] dark:text-white/35
                    hover:text-indigo-500 dark:hover:text-cyan-300 transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-[hsl(var(--text-faint))] dark:text-white/30 font-medium">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p>Open to new projects</p>
            </div>
          </div>
        </div>

        {/* Giant watermark */}
        <div
          className="pointer-events-none select-none absolute -bottom-6 md:-bottom-10 left-0 right-0 text-center font-black uppercase tracking-tighter leading-none
            text-neutral-900/[0.03] dark:text-white/[0.03]"
          style={{ fontSize: "clamp(4rem, 20vw, 16rem)" }}
          aria-hidden="true"
        >
          M-Stack
        </div>
      </footer>
    </div>
  );
}

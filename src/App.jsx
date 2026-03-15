import React, { useState, useEffect } from "react";
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
  Terminal,
  Layers,
  Layout,
  Code,
  Sun,
  Moon,
  Menu,
  X,
  Braces,
  Wind,
  Code2,
  Send,
} from "lucide-react";
import { SiJavascript, SiReact, SiTailwindcss } from "react-icons/si";
import ContactForm from "./components/ContactForm";

const MagneticCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 30, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen
        border border-indigo-500/45 dark:border-indigo-300/60
        bg-white/5 dark:bg-indigo-300/[0.04]
        shadow-[0_0_18px_rgba(99,102,241,0.18)] dark:shadow-[0_0_22px_rgba(129,140,248,0.3)]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};

const SkillCard = ({ title, skills, icon: Icon, accentClass }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="theme-panel-strong relative overflow-hidden rounded-3xl p-8
      group transition-all duration-300 hover:-translate-y-1
      hover:border-[hsl(var(--surface-border-strong)/0.9)]"
  >
    <div
      className={`absolute -right-4 -top-4 w-32 h-32 blur-3xl opacity-60 transition-opacity group-hover:opacity-80 ${accentClass}`}
    />
    <div className="relative z-10">
      <div className="theme-icon-shell w-10 h-10 rounded-xl flex items-center justify-center mb-6 text-[hsl(var(--text-soft))] dark:text-white/65 group-hover:text-indigo-500 dark:group-hover:text-cyan-300 transition-colors duration-300">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold mb-4 tracking-tight leading-snug text-neutral-900 dark:text-white">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-lg text-[10px] tracking-[0.12em] uppercase
              bg-[hsl(var(--surface-muted)/0.82)] dark:bg-[hsl(var(--surface-muted)/0.86)]
              border border-[hsl(var(--surface-border)/0.6)]
              text-[hsl(var(--text-faint))] dark:text-white/50
              group-hover:text-neutral-700 dark:group-hover:text-white/70 transition-colors duration-300"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
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

const ProjectItem = ({ title, description, tags, link, image }) => {
  const getTagStyle = (tag) =>
    tagColors[tag] ||
    "bg-[hsl(var(--surface-muted)/0.75)] text-[hsl(var(--text-soft))] dark:text-white/60 border-[hsl(var(--surface-border)/0.45)]";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 25 }}
      className="theme-panel-strong relative group overflow-hidden rounded-3xl
        border-[hsl(var(--surface-border)/0.75)]
        hover:border-[hsl(var(--surface-border-strong)/0.95)]/95
        transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/15 to-transparent dark:from-slate-950/55" />
      </div>

      <div className="p-6 md:p-7 relative z-10 flex min-h-[250px] flex-col">
        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[hsl(var(--text-soft))] dark:text-white/55 mt-3 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase border ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]
              bg-indigo-500 text-white border border-indigo-400/80
              shadow-[0_12px_24px_rgba(99,102,241,0.24)]
              hover:bg-indigo-600 transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Live</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleHero = useTransform(smoothY, [0, 0.2], [1, 0.95]);
  const opacityHero = useTransform(smoothY, [0, 0.15], [1, 0]);

  const projects = [
    {
      title: "Osara Web",
      description:
        "เว็บแอปพลิเคชันแบบ Full-stack สำหรับจัดการธุรกิจ ใช้ React สร้าง UI และ Node.js ทำ API",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://osara-web.vercel.app/",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Exam dashboard",
      description:
        "ระบบจัดการข้อสอบและคะแนน เชื่อมต่อ MongoDB เก็บข้อมูล real-time",
      tags: ["Node.js", "mongodb"],
      link: "https://exam-dashboard-uuii.vercel.app/",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Pokemon App",
      description:
        "แอปค้นหาและดูข้อมูล Pokemon ใช้ React + Tailwind สร้าง UI สวยงาม",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://pikachu-project-jd9e.vercel.app/",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Foucus website",
      description:
        "เว็บไซต์โฟกัสและ productivity ใช้ React และ Tailwind ออกแบบให้ใช้งานง่าย",
      tags: ["React", "Tailwind", "Fullstack"],
      link: "https://focus-web-ten.vercel.app/",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
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
      <nav className="fixed top-0 w-full z-50 px-6 md:px-10 py-8 flex justify-between items-center pointer-events-none">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-2xl md:text-4xl font-bold tracking-tight pointer-events-auto cursor-pointer text-neutral-900 dark:text-white"
        >
          MUHAI.DEV
        </motion.div>

        {/* Desktop nav */}
        <div
          className="theme-panel hidden md:flex items-center gap-8
          px-8 py-3 rounded-full pointer-events-auto"
        >
          {["About", "Stack", "Works", "Connect"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] tracking-[0.35em] uppercase font-medium
                text-[hsl(var(--text-faint))] dark:text-white/60 hover:text-indigo-500 dark:hover:text-cyan-300
                transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 pointer-events-auto md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
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
            className="theme-panel w-10 h-10 rounded-full flex items-center justify-center
              text-[hsl(var(--text-soft))] dark:text-white/55 hover:text-indigo-500 dark:hover:text-cyan-300
              hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="theme-panel w-10 h-10 rounded-full flex items-center justify-center
              text-[hsl(var(--text-soft))] dark:text-white/55 hover:text-indigo-500 dark:hover:text-cyan-300
              hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <Terminal size={16} />
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
            className="theme-panel fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] z-50
              rounded-none border-l flex flex-col pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {["About", "Stack", "Works", "Connect"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-4 px-4 text-lg font-medium tracking-wide
                    text-neutral-700 dark:text-white/90 hover:text-indigo-500 dark:hover:text-cyan-300
                    hover:bg-[hsl(var(--surface-muted)/0.9)] dark:hover:bg-white/5 rounded-xl
                    transition-colors min-h-[48px] flex items-center"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-auto pb-8 flex gap-3">
              <motion.button
                onClick={() => {
                  setIsDark(!isDark);
                  setMobileMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
                className="theme-panel w-12 h-12 rounded-full flex items-center justify-center
                  text-neutral-600 dark:text-white/60"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="theme-panel w-12 h-12 rounded-full flex items-center justify-center
                  text-neutral-600 dark:text-white/60"
              >
                <Terminal size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden py-24 md:py-32">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.2),transparent)]" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.12),transparent)] animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(6,182,212,0.06),transparent)] dark:bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(6,182,212,0.1),transparent)]" />
        </div>

        {/* Floating code symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["</>", "{ }", "=>", "()", "[]", "async"].map((sym, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl md:text-4xl font-mono text-white/[0.03] dark:text-white/[0.05] select-none"
              style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.03, 0.06, 0.03],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {sym}
            </motion.span>
          ))}
        </div>

        <motion.div
          style={{ scale: scaleHero, opacity: opacityHero }}
          className="space-y-10 md:space-y-14 relative z-10"
        >
          <h1 className="text-[11vw] md:text-[12vw] font-extrabold leading-[0.9] tracking-tight uppercase">
            <span className="text-neutral-900 dark:text-white">Fullstack</span>
            <br />
            <span
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Developer
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-base md:text-lg font-medium tracking-wide
            text-[hsl(var(--text-soft))] dark:text-white/60"
          >
            สร้างเว็บไซต์และแอปที่ใช้งานได้จริง ด้วย React, Node.js
            และฐานข้อมูลสมัยใหม่
            <br />
            พร้อมช่วยธุรกิจของคุณเติบโตด้วยโซลูชันดิจิทัล
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <motion.a
              href="#connect"
              animate={{
                boxShadow: [
                  "0px 0px 25px rgba(99,102,241,0.4)",
                  "0px 0px 50px rgba(99,102,241,0.6)",
                  "0px 0px 25px rgba(99,102,241,0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest
                bg-indigo-500 hover:bg-indigo-600
                text-white border border-indigo-400/80
                shadow-[0_12px_35px_rgba(99,102,241,0.25)]
                transition-colors duration-300"
            >
              จ้างงาน หรือ สอบถามเพิ่มเติม
            </motion.a>
            <motion.a
              href="#works"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="theme-panel px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest
                border-[hsl(var(--surface-border)/0.8)]
                hover:bg-white/60 dark:hover:bg-white/[0.06]
                text-neutral-800 dark:text-white/90
                transition-all duration-300"
            >
              ดูผลงาน
            </motion.a>
          </div>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/[0.04] dark:bg-indigo-500/[0.03] rounded-full blur-[150px]" />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="theme-section section-divider px-6 md:px-10 py-28 md:py-36 border-y border-[hsl(var(--surface-border)/0.45)]"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="theme-panel-strong rounded-3xl p-7 md:p-10 lg:col-span-3"
          >
            <p className="text-[11px] tracking-[0.28em] uppercase text-indigo-500 dark:text-cyan-300 mb-3 font-semibold">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
              Muhaidev - Passionate Web Developer 
            </h2>
            <p className="theme-muted leading-relaxed mb-4">
              สวัสดีครับผม Muhaidev
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
            className="theme-panel-strong rounded-3xl p-6 md:p-8 lg:col-span-2 h-full"
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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
        className="theme-section px-6 md:px-10 py-32 md:py-40"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:mb-24 space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold uppercase italic tracking-tight leading-tight text-neutral-900 dark:text-white">
              My Skills
            </h2>
            <p className="theme-kicker text-[11px] tracking-[0.2em] uppercase">
              The Tech Behind the Logic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SkillCard
              title="Frontend"
              skills={["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"]}
              icon={Layout}
              accentClass="bg-indigo-500/10 group-hover:bg-indigo-500/20"
            />
            <SkillCard
              title="Backend"
              skills={["Node.js", "Express.js", "REST APIs"]}
              icon={Database}
              accentClass="bg-purple-500/10 group-hover:bg-purple-500/20"
            />
            <SkillCard
              title="Databases"
              skills={["MongoDB", "PostgreSQL"]}
              icon={Layers}
              accentClass="bg-cyan-500/10 group-hover:bg-cyan-500/20"
            />
            <SkillCard
              title="Programming Languages"
              skills={["Python", "C++", "C"]}
              icon={Code}
              accentClass="bg-sky-500/10 group-hover:bg-sky-500/20"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="works"
        className="theme-section theme-section-alt section-divider px-6 md:px-10 py-32 md:py-40 border-y"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 md:mb-40 gap-8 md:gap-10">
            <h2 className="text-5xl md:text-[10vw] font-bold uppercase tracking-tight italic leading-[0.85] text-neutral-900 dark:text-white">
              Projects
              <br />
              <span className="text-neutral-400 dark:text-white/10">
                Selected.
              </span>
            </h2>
            <div className="space-y-4 md:space-y-6 text-right hidden md:block">
              <div className="text-[10px] tracking-[0.35em] uppercase text-indigo-500 dark:text-cyan-300 font-semibold">
                Live Work
              </div>
              <p className="max-w-xs text-[10px] tracking-[0.12em] leading-relaxed uppercase italic text-[hsl(var(--text-faint))] dark:text-white/30">
                Modern web projects with real business impact.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {projects.map((proj, i) => (
              <ProjectItem
                key={i}
                title={proj.title}
                description={proj.description}
                tags={proj.tags}
                link={proj.link}
                image={proj.image}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactForm />

      {/* Footer */}
      <footer
        className="theme-section section-divider px-6 md:px-10 py-10 md:py-12
        border-t flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8
        text-[9px] tracking-[0.4em] uppercase text-[hsl(var(--text-faint))] dark:text-white/30"
      >
        <p>Available for freelance and product work</p>
        <div className="flex gap-8 md:gap-12 font-medium tracking-[0.15em]">
          <p>Yala</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <p>Open for new projects</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

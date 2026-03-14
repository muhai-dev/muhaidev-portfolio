import React, { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
} from 'framer-motion';
import { Database, ExternalLink, Terminal, Layers, Layout, Code, Sun, Moon } from 'lucide-react';
import ContactForm from './components/ContactForm';

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
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-indigo-500/50 dark:border-indigo-400/50 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_15px_rgba(99,102,241,0.25)] dark:shadow-[0_0_15px_rgba(99,102,241,0.35)]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
};

const SkillCard = ({ title, skills, icon: Icon, accentClass }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="relative overflow-hidden rounded-2xl p-8
      bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl
      border border-white/40 dark:border-white/[0.06]
      shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10
      group transition-shadow duration-300"
  >
    <div className={`absolute -right-4 -top-4 w-32 h-32 blur-3xl opacity-60 transition-opacity group-hover:opacity-80 ${accentClass}`} />
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/5 flex items-center justify-center mb-6 text-neutral-500 dark:text-white/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold mb-4 tracking-tight leading-snug text-neutral-800 dark:text-white/90">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1.5 bg-white/50 dark:bg-white/5 rounded-lg text-[10px] tracking-[0.12em] uppercase text-neutral-500 dark:text-white/40 group-hover:text-neutral-700 dark:group-hover:text-white/60 transition-colors duration-300"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const ProjectItem = ({ title, tags, link, gradientClass, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(link, '_blank')}
      whileHover={{ scale: 1.002 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="py-14 md:py-16 border-b border-neutral-200/60 dark:border-white/[0.06] relative group cursor-pointer overflow-hidden
        hover:bg-white/30 dark:hover:bg-white/[0.02] transition-colors duration-300
        rounded-lg -mx-2 px-2 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-8 md:gap-10">
          <span className="text-neutral-400 dark:text-white/10 font-mono text-xs tracking-tight">[{index + 1}]</span>
          <h3 className="text-3xl md:text-7xl font-bold uppercase tracking-tight leading-tight text-neutral-700 dark:text-white/80 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300 items-center">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-lg border border-neutral-300/50 dark:border-white/10 bg-white/30 dark:bg-white/5"
            >
              {tag}
            </span>
          ))}
          <div className="w-10 h-10 rounded-full border border-neutral-300 dark:border-white/20 flex items-center justify-center text-neutral-600 dark:text-white translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <ExternalLink size={16} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '15%' }}
            animate={{ opacity: 0.08, scale: 1, x: '8%' }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l pointer-events-none blur-3xl ${gradientClass}`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleHero = useTransform(smoothY, [0, 0.2], [1, 0.95]);
  const opacityHero = useTransform(smoothY, [0, 0.15], [1, 0]);

  const projects = [
    {
      title: 'Osara Web',
      tags: ['React', 'Tailwind', 'Fullstack'],
      link: 'https://osara-web.vercel.app/',
      gradientClass: 'from-indigo-500/0 to-indigo-500/20',
    },
    {
      title: 'Exam dashboard',
      tags: ['Node.js', 'mongodb'],
      link: 'https://exam-dashboard-uuii.vercel.app/',
      gradientClass: 'from-purple-500/0 to-purple-500/20',
    },
    {
      title: 'Pokemon App',
      tags: ['React' , 'Tailwind' , 'Fullstack'],
      link: 'https://pikachu-project-jd9e.vercel.app/',
      gradientClass: 'from-cyan-500/0 to-cyan-500/20',
    },
    {
      title: 'Foucus website',
      tags: ['React' , 'Tailwind' , 'Fullstack'],
      link: 'https://focus-web-ten.vercel.app/',
      gradientClass: 'from-cyan-500/0 to-cyan-500/20',
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden font-sans
      bg-neutral-50 dark:bg-[#050505] text-neutral-800 dark:text-white/90
      selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30 selection:text-white">
      <MagneticCursor />

      {/* Progress Rail */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-neutral-200/80 dark:bg-white/5 z-[100]">
        <motion.div
          className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] origin-left"
          style={{ scaleX: smoothY }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-10 py-8 flex justify-between items-center pointer-events-none">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-2xl md:text-4xl font-bold tracking-tight pointer-events-auto cursor-pointer text-neutral-900 dark:text-white"
        >
          DEV
        </motion.div>

        <div className="hidden md:flex items-center gap-8
          bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl
          px-8 py-3 rounded-full border border-neutral-200/60 dark:border-white/[0.06]
          shadow-sm dark:shadow-none pointer-events-auto">
          {['Stack', 'Works', 'Connect'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] tracking-[0.35em] uppercase font-medium
                text-neutral-500 dark:text-white/55 hover:text-indigo-500 dark:hover:text-indigo-400
                transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <motion.button
            onClick={() => setIsDark(!isDark)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full flex items-center justify-center
              bg-white/50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10
              text-neutral-600 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400
              hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full flex items-center justify-center
              bg-white/50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10
              text-neutral-600 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400
              hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <Terminal size={16} />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          style={{ scale: scaleHero, opacity: opacityHero }}
          className="space-y-8 md:space-y-10 relative z-10"
        >
          <h1 className="text-[9vw] md:text-[10vw] font-bold leading-[0.95] tracking-tight uppercase italic
            text-neutral-900 dark:text-white">
            Fullstack
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1px var(--hero-stroke)' }}
            >
              Developer
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base font-light tracking-[0.18em] leading-relaxed uppercase
            text-neutral-500 dark:text-white/30">
            Specializing in React, Node.js and Modern Databases.
            <br />
            Transforming Complex Logic into Visual Elegance.
          </p>

          <div className="flex justify-center pt-6">
            <motion.a
              href="#works"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="px-10 py-4 rounded-full text-[10px] font-semibold uppercase tracking-[0.35em]
                border border-neutral-300/60 dark:border-white/10
                bg-white/60 dark:bg-white/5 backdrop-blur-sm
                hover:border-indigo-500/40 dark:hover:border-indigo-500/50
                hover:shadow-lg hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/20
                text-neutral-700 dark:text-white/90
                transition-all duration-300 group overflow-hidden relative"
            >
              <span className="relative z-10">See the Projects</span>
              <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </motion.a>
          </div>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/[0.04] dark:bg-indigo-500/[0.03] rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" className="px-6 md:px-10 py-32 md:py-40 max-w-7xl mx-auto">
        <div className="mb-20 md:mb-24 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold uppercase italic tracking-tight leading-tight text-neutral-900 dark:text-white">
            My Skills
          </h2>
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 dark:text-white/25">
            The Tech Behind the Logic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SkillCard
            title="Frontend"
            skills={['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS']}
            icon={Layout}
            accentClass="bg-indigo-500/5 group-hover:bg-indigo-500/10"
          />
          <SkillCard
            title="Backend"
            skills={['Node.js', 'Express.js', 'REST APIs', ]}
            icon={Database}
            accentClass="bg-purple-500/5 group-hover:bg-purple-500/10"
          />
          <SkillCard
            title="Databases"
            skills={['MongoDB', 'PostgreSQL']}
            icon={Layers}
            accentClass="bg-cyan-500/5 group-hover:bg-cyan-500/10"
          />
          <SkillCard
            title="Programming Languages"
            skills={['Python', 'C++', 'C']}
            icon={Code}
            accentClass="bg-cyan-500/5 group-hover:bg-cyan-500/10"
          />
        </div>
      </section>

      {/* Work Section */}
      <section id="works" className="px-6 md:px-10 py-32 md:py-40
        bg-neutral-100/80 dark:bg-[#080808] backdrop-blur-sm
        border-y border-neutral-200/60 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 md:mb-40 gap-8 md:gap-10">
            <h2 className="text-5xl md:text-[10vw] font-bold uppercase tracking-tight italic leading-[0.85] text-neutral-900 dark:text-white">
              Featured
              <br />
              <span className="text-neutral-400 dark:text-white/10">Archive.</span>
            </h2>
            <div className="space-y-4 md:space-y-6 text-right hidden md:block">
              <div className="text-[10px] tracking-[0.35em] uppercase text-indigo-500 dark:text-indigo-400 font-semibold">
                Showcase 2025-2026
              </div>
              <p className="max-w-xs text-[10px] tracking-[0.12em] leading-relaxed uppercase italic text-neutral-500 dark:text-white/25">
                Explore the architecture of modern web solutions.
              </p>
            </div>
          </div>

          <div className="flex flex-col border-t border-neutral-200/60 dark:border-white/[0.06]">
            {projects.map((proj, i) => (
              <ProjectItem
                key={i}
                title={proj.title}
                tags={proj.tags}
                link={proj.link}
                gradientClass={proj.gradientClass}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactForm />

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10 md:py-12
        border-t border-neutral-200/60 dark:border-white/[0.06]
        flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8
        text-[9px] tracking-[0.4em] uppercase text-neutral-500 dark:text-white/25">
        <p>This is only test app</p>
        <div className="flex gap-8 md:gap-12 font-medium tracking-[0.15em]">
          <p>Yala</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <p>just port folio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
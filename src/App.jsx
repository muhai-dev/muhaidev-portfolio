import React, { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
} from 'framer-motion';
import { Database, ExternalLink, Terminal, Layers, Layout, Code, Sun, Moon, Github, Menu, X } from 'lucide-react';
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

const tagColors = {
  React: 'bg-cyan-500/15 text-cyan-400 dark:text-cyan-300 border-cyan-500/20',
  Tailwind: 'bg-sky-500/15 text-sky-400 dark:text-sky-300 border-sky-500/20',
  Fullstack: 'bg-indigo-500/15 text-indigo-400 dark:text-indigo-300 border-indigo-500/20',
  'Node.js': 'bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 border-emerald-500/20',
  mongodb: 'bg-green-500/15 text-green-400 dark:text-green-300 border-green-500/20',
};

const ProjectItem = ({ title, description, tags, link, githubUrl, gradientClass, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTagStyle = (tag) => tagColors[tag] || 'bg-white/10 text-white/70 dark:text-white/60 border-white/10';

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(link, '_blank')}
      whileHover={{ y: -12, transition: { duration: 0.2 } }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl min-h-[240px]
        bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl
        border border-white/10
        shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/15
        transition-shadow duration-300"
    >
      <div className="p-8 md:p-10 relative z-10 min-h-[240px] flex flex-col justify-between">
        <span className="text-neutral-400 dark:text-white/20 font-mono text-xs tracking-tight">0{index + 1}</span>
        <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mt-2 text-neutral-800 dark:text-white/90 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-white/40 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase border ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* View Project overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center
          bg-indigo-600/95 dark:bg-indigo-900/95
          rounded-2xl"
      >
        <span className="text-white font-bold text-lg md:text-xl tracking-wider uppercase drop-shadow-lg">View Project</span>
        <div className="flex gap-4 mt-4">
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 text-white no-underline"
            >
              <span className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                <Github size={20} />
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase">Source Code</span>
            </motion.a>
          )}
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 text-white no-underline"
          >
            <span className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
              <ExternalLink size={20} />
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase">Live Site</span>
          </motion.a>
        </div>
      </motion.div>

      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${gradientClass}`} />
    </motion.div>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      description: 'เว็บแอปพลิเคชันแบบ Full-stack สำหรับจัดการธุรกิจ ใช้ React สร้าง UI และ Node.js ทำ API',
      tags: ['React', 'Tailwind', 'Fullstack'],
      link: 'https://osara-web.vercel.app/',
      githubUrl: '',
      gradientClass: 'from-indigo-500/20 to-indigo-600/10',
    },
    {
      title: 'Exam dashboard',
      description: 'ระบบจัดการข้อสอบและคะแนน เชื่อมต่อ MongoDB เก็บข้อมูล real-time',
      tags: ['Node.js', 'mongodb'],
      link: 'https://exam-dashboard-uuii.vercel.app/',
      githubUrl: '',
      gradientClass: 'from-purple-500/20 to-purple-600/10',
    },
    {
      title: 'Pokemon App',
      description: 'แอปค้นหาและดูข้อมูล Pokemon ใช้ React + Tailwind สร้าง UI สวยงาม',
      tags: ['React', 'Tailwind', 'Fullstack'],
      link: 'https://pikachu-project-jd9e.vercel.app/',
      githubUrl: '',
      gradientClass: 'from-cyan-500/20 to-cyan-600/10',
    },
    {
      title: 'Foucus website',
      description: 'เว็บไซต์โฟกัสและ productivity ใช้ React และ Tailwind ออกแบบให้ใช้งานง่าย',
      tags: ['React', 'Tailwind', 'Fullstack'],
      link: 'https://focus-web-ten.vercel.app/',
      githubUrl: '',
      gradientClass: 'from-cyan-500/20 to-cyan-600/10',
    },
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

        {/* Desktop nav */}
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

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 pointer-events-auto md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full flex items-center justify-center
              bg-white/50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10
              text-neutral-600 dark:text-white/60"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] z-50
              bg-white dark:bg-neutral-900 border-l border-neutral-200/60 dark:border-white/10
              flex flex-col pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {['Stack', 'Works', 'Connect'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-4 px-4 text-lg font-medium tracking-wide
                    text-neutral-700 dark:text-white/90 hover:text-indigo-500 dark:hover:text-indigo-400
                    hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl
                    transition-colors min-h-[48px] flex items-center"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-auto pb-8 flex gap-3">
              <motion.button
                onClick={() => { setIsDark(!isDark); setMobileMenuOpen(false); }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full flex items-center justify-center
                  bg-neutral-100 dark:bg-white/10 border border-neutral-200/60 dark:border-white/10
                  text-neutral-600 dark:text-white/60"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full flex items-center justify-center
                  bg-neutral-100 dark:bg-white/10 border border-neutral-200/60 dark:border-white/10
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.12),transparent)] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(6,182,212,0.06),transparent)] dark:bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(6,182,212,0.1),transparent)]" />
        </div>

        {/* Floating code symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['</>', '{ }', '=>', '()', '[]', 'async'].map((sym, i) => (
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
                ease: 'easeInOut',
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
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Developer
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg font-medium tracking-wide
            text-neutral-600 dark:text-white/50">
            สร้างเว็บไซต์และแอปที่ใช้งานได้จริง ด้วย React, Node.js และฐานข้อมูลสมัยใหม่
            <br />
            พร้อมช่วยธุรกิจของคุณเติบโตด้วยโซลูชันดิจิทัล
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <motion.a
              href="#connect"
              animate={{ boxShadow: ['0px 0px 25px rgba(99,102,241,0.4)', '0px 0px 50px rgba(99,102,241,0.6)', '0px 0px 25px rgba(99,102,241,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest
                bg-indigo-500 hover:bg-indigo-600
                text-white border-2 border-indigo-500
                transition-colors duration-300"
            >
              จ้างงานเลย
            </motion.a>
            <motion.a
              href="#works"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest
                border-2 border-neutral-400 dark:border-white/30
                bg-transparent hover:bg-white/10 dark:hover:bg-white/5
                text-neutral-700 dark:text-white/90
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((proj, i) => (
              <ProjectItem
                key={i}
                title={proj.title}
                description={proj.description}
                tags={proj.tags}
                link={proj.link}
                githubUrl={proj.githubUrl}
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
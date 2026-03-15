import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { User, Mail, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';

const CONTACT_EMAIL = 'muhaiminsatae2555@gmail.com';
const FACEBOOK_INBOX_URL = 'https://www.facebook.com/messages';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (field, value) => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'กรุณากรอกชื่อ' : '';
      case 'email':
        if (!value.trim()) return 'กรุณากรอกอีเมล';
        if (!emailRegex.test(value)) return 'รูปแบบอีเมลไม่ถูกต้อง';
        return '';
      case 'message':
        return !value.trim() ? 'กรุณากรอกรายละเอียด' : '';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    (Object.keys(formData)).forEach((key) => {
      const err = validate(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const subject = encodeURIComponent(`[Portfolio] ${formData.name}`);
      const body = encodeURIComponent(
        `ชื่อ: ${formData.name}\nอีเมล: ${formData.email}\n\nรายละเอียด:\n${formData.message}`
      );
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${subject}&body=${body}`;

      window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (err) {
      setErrors({ submit: err.message || 'ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'w-full pl-11 pr-4 py-3 rounded-xl bg-[hsl(var(--surface-muted)/0.82)] dark:bg-[hsl(var(--surface-muted)/0.9)] ' +
    'border border-[hsl(var(--surface-border)/0.7)] transition-all duration-200 text-neutral-900 dark:text-white ' +
    'placeholder-[hsl(var(--text-faint))] dark:placeholder-white/35 focus:outline-none ' +
    'focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/60';

  const inputWrapperBase = 'relative rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:ring-offset-2 focus-within:ring-offset-white/40 dark:focus-within:ring-offset-[hsl(var(--background))]';
  const inputWrapperError = 'focus-within:ring-red-500';
  const inputError = 'border-red-500/60 dark:border-red-500/50';
  const inputValid = 'border-[hsl(var(--surface-border)/0.7)] dark:border-[hsl(var(--surface-border)/0.7)]';

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      ref={ref}
      id="connect"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, duration: 0.5 }}
      className="theme-section theme-section-alt px-4 sm:px-6 md:px-10 py-24 md:py-40 overflow-x-hidden"
    >
      <div className="max-w-xl mx-auto w-full min-w-0">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold uppercase italic tracking-tight text-neutral-900 dark:text-white mb-3">
            Get in Touch
          </h2>
          <p className="theme-kicker text-sm tracking-wide">
            มีโปรเจกต์ในใจ? ส่งข้อความมาคุยกันได้เลย
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="theme-panel-strong rounded-3xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20
                  flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Ready to Send</h3>
              <p className="theme-muted text-sm mb-6">
                Gmail opened in a new tab. If you prefer, you can message me on Facebook instead.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="theme-link text-sm underline underline-offset-2"
              >
                ส่งข้อความอีกครั้ง
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              exit={{ opacity: 0 }}
              className="theme-panel-strong rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl space-y-6 w-full max-w-full overflow-hidden"
            >
              {/* Name */}
              <motion.div variants={staggerItem}>
                <label className="theme-kicker block text-xs font-medium tracking-[0.15em] uppercase mb-2">
                  ชื่อ
                </label>
                <div className={`relative rounded-xl ${inputWrapperBase} ${errors.name ? inputWrapperError : ''}`}>
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-faint))] dark:text-white/35" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="ชื่อของคุณ"
                    className={`${inputBase} ${errors.name ? inputError : inputValid}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.name}</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div variants={staggerItem}>
                <label className="theme-kicker block text-xs font-medium tracking-[0.15em] uppercase mb-2">
                  อีเมล
                </label>
                <div className={`relative rounded-xl ${inputWrapperBase} ${errors.email ? inputWrapperError : ''}`}>
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-faint))] dark:text-white/35" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                    className={`${inputBase} ${errors.email ? inputError : inputValid}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
                )}
              </motion.div>

              {/* Message */}
              <motion.div variants={staggerItem}>
                <label className="theme-kicker block text-xs font-medium tracking-[0.15em] uppercase mb-2">
                  รายละเอียด
                </label>
                <div className={`relative rounded-xl ${inputWrapperBase} ${errors.message ? inputWrapperError : ''}`}>
                  <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-[hsl(var(--text-faint))] dark:text-white/35" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    placeholder="บอกผมหน่อยว่าต้องการอะไร..."
                    className={`${inputBase} resize-none pt-3 ${errors.message ? inputError : inputValid}`}
                  />
                </div>
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.message}</p>
                )}
              </motion.div>

              {errors.submit && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center">{errors.submit}</p>
              )}

              <motion.div variants={staggerItem}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-full py-4 rounded-xl font-semibold text-sm tracking-[0.2em] uppercase
                  bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed
                  text-white border border-indigo-400/70
                  shadow-[0_16px_40px_rgba(99,102,241,0.25)] hover:shadow-[0_18px_48px_rgba(99,102,241,0.35)]
                  focus:ring-2 focus:ring-indigo-500/60 focus:outline-none
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                    <span>กำลังส่ง...</span>
                  </>
                ) : (
                  'ส่งข้อความ'
                )}
              </motion.button>
              </motion.div>

              <motion.p variants={staggerItem} className="theme-muted text-center text-xs pt-2">
                หรือ{' '}
                <a
                  href={FACEBOOK_INBOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-link underline underline-offset-2"
                >
                  ถ้าไม่สะดวก ส่งข้อความมาที่ Facebook ได้เลย
                </a>
              </motion.p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

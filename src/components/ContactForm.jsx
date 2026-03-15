import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { User, Mail, MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const FACEBOOK_INBOX_URL = 'https://www.facebook.com/messages';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
  const [toast, setToast] = useState(null);

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

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);
    setToast(null);

    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error('Email service is not configured yet.');
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTouched({});
      setToast({
        type: 'success',
        title: 'Success!',
        message: 'Message sent successfully!',
      });
    } catch (err) {
      const fallbackMessage = 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือทักหาผมทาง Facebook ได้เลย';
      setErrors({ submit: fallbackMessage });
      setToast({
        type: 'error',
        title: 'ส่งข้อความไม่สำเร็จ',
        message: err.message || fallbackMessage,
      });
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
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`theme-panel mb-6 rounded-2xl px-4 py-3 flex items-start gap-3 ${
                toast.type === 'success'
                  ? 'border-emerald-400/40 dark:border-emerald-400/30'
                  : 'border-red-400/40 dark:border-red-400/30'
              }`}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-red-500/15 text-red-500'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
                ) : (
                  <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{toast.title}</p>
                <p className="theme-muted text-sm">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="theme-link text-xs uppercase tracking-[0.18em]"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold uppercase italic tracking-tight text-neutral-900 dark:text-white mb-3">
            Get in Touch
          </h2>
          <p className="theme-kicker text-sm tracking-wide">
            มีโปรเจกต์ในใจ? ส่งข้อความมาคุยกันได้เลย
          </p>
        </div>

        <motion.form
          onSubmit={sendEmail}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
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
                    required
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
                    required
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
                    required
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
                  <span>Sending...</span>
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
      </div>
    </motion.section>
  );
}

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { User, Mail, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';

const FORMSPREE_ID = 'YOUR_FORM_ID'; // Replace with your Formspree form ID from formspree.io
const DIRECT_INBOX_URL = 'https://www.facebook.com/messages'; // Replace with your Facebook/IM link

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
      // Option 1: Formspree (replace FORMSPREE_ID)
      if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORM_ID') {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });
        if (!res.ok) throw new Error('ส่งไม่สำเร็จ');
      } else {
        // Option 2: mailto fallback
        await new Promise((r) => setTimeout(r, 1500));
        const subject = encodeURIComponent(`[Portfolio] ${formData.name}`);
        const body = encodeURIComponent(
          `ชื่อ: ${formData.name}\nอีเมล: ${formData.email}\n\nรายละเอียด:\n${formData.message}`
        );
        window.location.href = `mailto:muhaiminsatae2555@gmail.com?subject=${subject}&body=${body}`;
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (err) {
      setErrors({ submit: 'ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 dark:bg-white/[0.03] ' +
    'border transition-all duration-200 text-neutral-800 dark:text-white/90 ' +
    'placeholder-neutral-500 dark:placeholder-white/30 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/50 ' +
    'focus:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]';

  const inputError = 'border-red-500/60 dark:border-red-500/50 focus:ring-red-500/40';
  const inputValid = 'border-neutral-300/60 dark:border-white/10';

  return (
    <motion.section
      ref={ref}
      id="connect"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, duration: 0.5 }}
      className="px-6 md:px-10 py-32 md:py-40"
    >
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold uppercase italic tracking-tight text-neutral-900 dark:text-white mb-3">
            Get in Touch
          </h2>
          <p className="text-sm text-neutral-500 dark:text-white/40 tracking-wide">
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
              className="bg-white/50 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/[0.08]
                rounded-2xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30
                  flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">Thank you!</h3>
              <p className="text-neutral-500 dark:text-white/50 text-sm mb-6">
                ได้รับข้อความของคุณแล้ว จะติดต่อกลับโดยเร็วที่สุดครับ
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
              >
                ส่งข้อความอีกครั้ง
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl
                border border-neutral-200/60 dark:border-white/[0.06]
                rounded-2xl p-8 md:p-10 shadow-xl space-y-6"
            >
              {/* Name */}
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-neutral-500 dark:text-white/50 mb-2">
                  ชื่อ
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-white/30" />
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
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-neutral-500 dark:text-white/50 mb-2">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-white/30" />
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
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-neutral-500 dark:text-white/50 mb-2">
                  รายละเอียด
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-neutral-400 dark:text-white/30" />
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
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center">{errors.submit}</p>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-full py-4 rounded-xl font-semibold text-sm tracking-[0.2em] uppercase
                  bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed
                  text-white border border-indigo-500/50
                  shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                  focus:ring-2 focus:ring-indigo-500/60 focus:outline-none
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  'ส่งข้อความ'
                )}
              </motion.button>

              <p className="text-center text-xs text-neutral-500 dark:text-white/40 pt-2">
                หรือ{' '}
                <a
                  href={DIRECT_INBOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  ส่งข้อความตรงที่ Facebook
                </a>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

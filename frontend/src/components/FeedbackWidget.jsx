import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const FeedbackWidget = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("bug");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const widgetRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    // Fake API call
    setTimeout(() => {
      toast.success(t("feedback.success"));
      setIsSubmitting(false);
      setIsOpen(false);
      setMessage("");
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={widgetRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-[340px] bg-primary border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-accent to-pink-500 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> {t("feedback.title")}
              </h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t("feedback.type")}</label>
                <div className="flex bg-secondary p-1 rounded-lg border border-border">
                  {[
                    { id: "bug", label: t("feedback.types.bug") },
                    { id: "feature", label: t("feedback.types.feature") },
                    { id: "question", label: t("feedback.types.question") }
                  ].map(tObj => (
                    <button
                      key={tObj.id}
                      type="button"
                      onClick={() => setType(tObj.id)}
                      className={`flex-1 text-[10px] sm:text-xs font-medium py-1.5 rounded-md transition-all ${type === tObj.id ? "bg-primary shadow-sm border border-border text-primary" : "text-secondary hover:text-primary"}`}
                    >
                      {tObj.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t("feedback.message")}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("feedback.messagePh")}
                  rows="4"
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => toast.success(t("feedback.attach_clicked") || "Attachment dialog opened")} className="text-xs text-secondary hover:text-accent flex items-center gap-1 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" /> {t("feedback.attach")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-accent/20"
                >
                  {isSubmitting ? "Sending..." : <><Send className="w-3.5 h-3.5" /> {t("feedback.submit")}</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-accent text-white shadow-lg shadow-accent/30 flex items-center justify-center hover:bg-accent-hover transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default FeedbackWidget;

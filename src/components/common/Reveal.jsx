import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 0.6,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

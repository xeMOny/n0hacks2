import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 32 }}
    >
      <h1>CRM · Malta Campus</h1>
      <p>Panel interno. Pendiente: definir KPIs y widgets del dashboard con el usuario.</p>
    </motion.main>
  );
}

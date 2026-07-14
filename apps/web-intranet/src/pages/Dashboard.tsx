import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 32 }}
    >
      <h1>Intranet · Malta Campus</h1>
      <p>Portal interno. Pendiente: definir roles y permisos exactos con el usuario.</p>
    </motion.main>
  );
}

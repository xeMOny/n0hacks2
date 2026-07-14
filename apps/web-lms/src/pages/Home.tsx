import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

export default function Home() {
  const courses = [
    { id: 1, title: 'Desarrollo Web', desc: 'React, TypeScript, Full Stack', price: '€299' },
    { id: 2, title: 'Gestión de Proyectos', desc: 'Metodologías ágiles y SCRUM', price: '€199' },
    { id: 3, title: 'Marketing Digital', desc: 'SEO, SEM, Analytics', price: '€249' },
  ];

  const features = [
    { icon: BookOpen, title: 'Cursos Online', desc: 'Acceso 24/7 a contenido actualizado' },
    { icon: Users, title: 'Comunidad', desc: 'Red de profesionales y tutores' },
    { icon: Award, title: 'Certificados', desc: 'Reconocidos en el sector' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur z-50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold">
            🎓 Universidad Malta
          </motion.div>
          <nav className="flex gap-6 text-sm">
            <a href="#cursos" className="hover:text-blue-400 transition">Cursos</a>
            <a href="#contacto" className="hover:text-blue-400 transition">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Formación Online de Calidad
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
        >
          Desarrolla tus habilidades con cursos prácticos diseñados para profesionales como tú.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          href="#cursos"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          Ver cursos <ArrowRight size={20} />
        </motion.a>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition"
            >
              <f.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Nuestros Cursos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition"
            >
              <h3 className="text-2xl font-bold mb-3">{course.title}</h3>
              <p className="text-slate-400 mb-6">{course.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-blue-400">{course.price}</span>
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition">
                  Matricularse
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900/30 border-t border-slate-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para empezar?</h2>
          <p className="text-slate-300 mb-8">Únete a cientos de estudiantes que ya están creciendo profesionalmente.</p>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg font-bold text-lg transition"
          >
            Solicita información
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-slate-950 border-t border-slate-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Universidad Malta</h3>
              <p className="text-slate-400">Formación online de calidad para profesionales.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <p className="text-slate-400">
                📧 info@uclcampus.com<br />
                📱 +34 XXX XXX XXX
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 Universidad Malta. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

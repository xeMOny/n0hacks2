import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    apiFetch("/lms/courses").then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <h2>Catálogo de cursos</h2>
      {courses.length === 0 && <p>Sin cursos publicados todavía.</p>}
      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            <strong>{c.title}</strong> — {c.price} €
          </li>
        ))}
      </ul>
    </main>
  );
}

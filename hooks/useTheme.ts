"use client";

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [dark, setDark] = useState<boolean>(false); // Siempre empieza en claro para SSR

  useEffect(() => {
    // Solo ejecutado en el cliente al montar
    const saved = localStorage.getItem("rally-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (!saved) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggle = () => {
    setDark((prevDark) => {
      const nextDark = !prevDark;
      document.documentElement.classList.toggle("dark", nextDark);
      localStorage.setItem("rally-theme", nextDark ? "dark" : "light");
      return nextDark;
    });
  };

  return { dark, toggle };
};

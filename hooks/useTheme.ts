"use client";

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    // Solo ejecutado en el cliente al montar
    const savedTheme = localStorage.getItem("rally-theme");
    const isDark = savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const isDark = !dark;
    setDark(isDark);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.setItem("rally-theme", isDark ? "dark" : "light");
  };

  return { dark, toggle };
};

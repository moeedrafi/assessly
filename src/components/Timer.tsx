"use client";

import { useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "@/lib/utils";

export const Timer = ({ duration }: { duration: number }) => {
  const [startTime] = useState<number | null>(() => {
    let storedStart = loadFromStorage("quizStartTime");

    if (!storedStart) {
      storedStart = Date.now();
      saveToStorage("quizStartTime", storedStart);
    }

    return storedStart;
  });

  const [timer, setTimer] = useState<number>(() =>
    Math.max(0, Math.ceil((startTime! + duration * 1000 - Date.now()) / 1000))
  );

  useEffect(() => {
    if (!startTime) return;

    const totalQuizDuration = startTime + duration * 1000;

    const intervalId = setInterval(() => {
      const remaining = totalQuizDuration - Date.now();
      if (remaining <= 0) {
        clearInterval(intervalId);
        // TODO: Submit Quiz
        setTimer(0);
        return;
      }
      setTimer(Math.ceil(remaining / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration, startTime]);

  const [mounted] = useState(typeof window !== "undefined");
  if (!mounted) return null;

  return <span className="text-xl text-primary">{timer}</span>;
};

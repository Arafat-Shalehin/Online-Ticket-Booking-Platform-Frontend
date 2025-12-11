import { useEffect, useState } from "react";

const getTimeRemaining = (target) => {
  const now = new Date().getTime();
  const targetTime = new Date(target).getTime();
  const total = targetTime - now;

  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    targetDate ? getTimeRemaining(targetDate) : null
  );

  useEffect(() => {
    if (!targetDate) return;

    setTimeLeft(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

export default useCountdown;

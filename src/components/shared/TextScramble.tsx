'use client';
import { useCallback, useEffect, useState } from 'react';
import { motion, MotionProps } from 'framer-motion';

const MotionP = motion.p;
const MotionSpan = motion.span;
const MotionDiv = motion.div;

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const text = children;

  const scramble = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  }, [characterSet, duration, isAnimating, onScrambleComplete, speed, text]);

  useEffect(() => {
    if (!trigger) return;

    const timer = window.setTimeout(() => {
      scramble();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [trigger, scramble]);

  if (Component === 'span') {
    return (
      <MotionSpan className={className} {...props}>
        {displayText}
      </MotionSpan>
    );
  }

  if (Component === 'div') {
    return (
      <MotionDiv className={className} {...props}>
        {displayText}
      </MotionDiv>
    );
  }

  return (
    <MotionP className={className} {...props}>
      {displayText}
    </MotionP>
  );
}

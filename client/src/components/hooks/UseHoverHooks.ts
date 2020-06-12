import { useState, useEffect, useRef } from 'react';

export const useHover = () => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const hoverRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = () => setIsMouseOver(true);
  const handleMouseOut = () => setIsMouseOver(false);

  useEffect(
    () => {
      const node = hoverRef.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [hoverRef.current] // Recall only if ref changes
  );

  return { hoverRef, isMouseOver };
};

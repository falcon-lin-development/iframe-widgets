import React, { useState, useEffect } from 'react';

interface CountUpAnimationProps {
  targetNumber: number;
  incrementSpeed?: number; // Time in milliseconds for each increment
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  targetNumber,
  incrementSpeed = 10, // Default to 10 milliseconds per increment if not specified
}) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const increment = 1; // Each step increases count by 1

    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + increment;
        // Stop the interval if the next count is greater than the target number
        if (nextCount >= targetNumber) {
          clearInterval(intervalId);
          return targetNumber; // Ensure the final number does not exceed the target
        }
        return nextCount;
      });
    }, incrementSpeed); // Set interval to update based on the incrementSpeed

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [targetNumber, incrementSpeed]);

  return (
    <>{Math.floor(count)}</> // Floor the count to avoid decimal points
  );
};

export default CountUpAnimation;

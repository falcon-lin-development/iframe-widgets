import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { styled } from '@mui/system';

const facts = [
  'Napoleon was once attacked by a horde of bunnies.',
  'Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramid.',
  'Albert Einstein never wore socks.',
  'Wombat poop is cube-shaped!',
  'There was a ten-gallon hat that could actually only hold 3/4 of a gallon of liquid.',
  'Charlie Chaplin once lost a Charlie Chaplin look-alike contest.',
  'Betty White is older than sliced bread.',
  'Isaac Newton invented the cat door.',
  "Kangaroos can't walk backwards.",
  'Thomas Edison was afraid of the dark.',
  "A group of flamingos is called a 'flamboyance.'",
  'George Washington grew marijuana in his garden.',
  "A group of porcupines is called a 'prickle.'",
  "Neil Armstrong's astronaut application was a week late.",
  "Marie Curie's notebooks are still radioactive.",
  'Winston Churchill was hit by a car and nearly killed in New York City.',
  'The shortest war lasted only 38 minutes.',
  'Alexander the Great was buried alive—accidentally. He was in a coma.',
  "Albert Einstein's brain was stolen after his death.",
  'Beethoven continued to compose music even after he went completely deaf.',

  'In Switzerland, it is illegal to own just one guinea pig.',
  'The color orange was actually named after oranges.',
  'Snakes can predict earthquakes.',
  'Crows often hold grudges against specific people.',
  "May 29 is officially 'Put a Pillow on Your Fridge Day.'",
  'Cherophobia is the irrational fear of fun or happiness.',
  'American flags left on the moon will eventually get bleached white by the sun.',
  'While they are hibernating, bears do not urinate. Their bodies convert waste into protein.',
  "White-faced capuchin monkeys greet each other by sticking their fingers up each others' noses.",
  "Gummy bears were originally called 'dancing bears.'",
  'New Zealand has more cats per person than any other country in the world.',
  'The hagfish is the only animal that has a skull but no spine.',
  'People weigh less if they stand at the equator than if they stand at the North or South poles.',
  'At their closest points, the U.S and the Soviet Union are over 2 miles (3km) apart.',
  'The yo-yo was originally a weapon used in the Philippine jungle.',
  "Victor Hugo's novel 'Les Miserables' contains a sentence that is 823 words long.",
  'Alexander the Great was the first person to be pictured on a coin.',
  "FDR's portrait was on the dime because of his association with the March of Dimes charity.",
  'The sun weighs 2,000 million million million million tons.',
];

const AmusingFacts: React.FC = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
        setFadeIn(true);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={fadeIn} timeout={1000}>
      <Typography variant="bodyMedium" align="center">
        {facts[currentFactIndex]}
      </Typography>
    </Fade>
  );
};

export default AmusingFacts;

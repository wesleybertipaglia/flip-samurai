import type { Collection } from './types';

export const initialCollections: Collection[] = [
  {
    id: '854756e8',
    name: 'World History 101',
    description: 'Key events and figures in world history.',
    tags: ['history', 'world'],
    source: 'created',
    cards: [
      { id: 'h1', front: 'What year did the Titanic sink?', back: '1912' },
      { id: 'h2', front: 'Who was the first person to step on the moon?', back: 'Neil Armstrong' },
      { id: 'h3', front: 'In which country did the Renaissance begin?', back: 'Italy' },
      { id: 'h4', front: 'Who was the first President of the United States?', back: 'George Washington' },
      { id: 'h5', front: 'What wall fell in 1989, symbolizing the end of the Cold War?', back: 'The Berlin Wall' },
    ],
  },
  {
    id: '4eb4cd1d',
    name: 'Science Basics',
    description: 'Fundamental concepts in biology, chemistry, and physics.',
    tags: ['science'],
    source: 'created',
    cards: [
      { id: 's1', front: 'What is the chemical symbol for water?', back: 'H2O' },
      { id: 's2', front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
      { id: 's3', front: "What is Newton's first law of motion?", back: 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.' },
      { id: 's4', front: 'What planet is known as the Red Planet?', back: 'Mars' },
      { id: 's5', front: 'What gas do plants absorb from the atmosphere?', back: 'Carbon dioxide (CO₂)' },
    ],
  },
  {
    id: '9ecbf0e7',
    name: 'English Vocabulary',
    description: 'Common English words and their definitions.',
    tags: ['english', 'vocabulary', 'language'],
    source: 'created',
    cards: [
      { id: 'e1', front: 'Define: ubiquitous', back: 'Present, appearing, or found everywhere.' },
      { id: 'e2', front: 'Define: benevolent', back: 'Well-meaning and kindly.' },
      { id: 'e3', front: 'Define: meticulous', back: 'Showing great attention to detail; very careful and precise.' },
      { id: 'e4', front: 'Define: ambiguous', back: 'Open to more than one interpretation; not having one obvious meaning.' },
      { id: 'e5', front: 'Define: exacerbate', back: 'To make a problem or bad situation worse.' },
    ],
  },
  {
    id: 'd56f5e66',
    name: 'Geography Essentials',
    description: 'Capitals, countries, and geographic features.',
    tags: ['geography', 'world'],
    source: 'created',
    cards: [
      { id: 'g1', front: 'What is the capital of Japan?', back: 'Tokyo' },
      { id: 'g2', front: 'Which river is the longest in the world?', back: 'The Nile River' },
      { id: 'g3', front: 'Mount Everest is located in which mountain range?', back: 'The Himalayas' },
      { id: 'g4', front: 'Which continent has the most countries?', back: 'Africa' },
      { id: 'g5', front: 'What is the largest desert in the world?', back: 'The Antarctic Desert' },
    ],
  },
  {
    id: '4070c6ed',
    name: 'Math Fundamentals',
    description: 'Basic math facts and concepts for all ages.',
    tags: ['math', 'numbers', 'education'],
    source: 'created',
    cards: [
      { id: 'm1', front: 'What is 7 × 8?', back: '56' },
      { id: 'm2', front: 'What is the square root of 81?', back: '9' },
      { id: 'm3', front: 'What is the value of Pi (π) up to 2 decimal places?', back: '3.14' },
      { id: 'm4', front: 'What is 15% of 200?', back: '30' },
      { id: 'm5', front: 'What is the formula for the area of a circle?', back: 'A = πr²' },
    ],
  },
];

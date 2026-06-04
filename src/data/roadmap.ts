import { RoadmapNode } from '../types';

export const dsaRoadmap: RoadmapNode[] = [
  {
    id: 'arrays',
    name: 'Arrays & Strings',
    difficulty: 'Easy',
    estimatedStudyTime: '3-4 Hours',
    prerequisites: [],
    x: 10,
    y: 10
  },
  {
    id: 'hashing',
    name: 'Hashing',
    difficulty: 'Easy',
    estimatedStudyTime: '2-3 Hours',
    prerequisites: ['arrays'],
    x: 30,
    y: 15
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    difficulty: 'Easy',
    estimatedStudyTime: '3-4 Hours',
    prerequisites: ['arrays'],
    x: 50,
    y: 20
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    difficulty: 'Medium',
    estimatedStudyTime: '4-5 Hours',
    prerequisites: ['two-pointers'],
    x: 70,
    y: 30
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    difficulty: 'Medium',
    estimatedStudyTime: '4-5 Hours',
    prerequisites: ['arrays'],
    x: 90,
    y: 40
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    difficulty: 'Easy',
    estimatedStudyTime: '3-4 Hours',
    prerequisites: ['arrays'],
    x: 70,
    y: 55
  },
  {
    id: 'trees',
    name: 'Trees & BST',
    difficulty: 'Medium',
    estimatedStudyTime: '6-8 Hours',
    prerequisites: ['linked-lists'],
    x: 50,
    y: 65
  },
  {
    id: 'heaps',
    name: 'Heaps / Priority Queue',
    difficulty: 'Medium',
    estimatedStudyTime: '4-5 Hours',
    prerequisites: ['trees'],
    x: 30,
    y: 75
  },
  {
    id: 'graphs',
    name: 'Graphs (BFS / DFS)',
    difficulty: 'Hard',
    estimatedStudyTime: '8-10 Hours',
    prerequisites: ['trees'],
    x: 10,
    y: 85
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    difficulty: 'Hard',
    estimatedStudyTime: '12-15 Hours',
    prerequisites: ['trees', 'arrays'],
    x: 30,
    y: 95
  },
  {
    id: 'lru-cache',
    name: 'LRU Cache',
    difficulty: 'Medium',
    estimatedStudyTime: '2-3 Hours',
    prerequisites: ['linked-lists', 'hashing'],
    x: 50,
    y: 110
  },
  {
    id: 'trie',
    name: 'Trie',
    difficulty: 'Medium',
    estimatedStudyTime: '3-4 Hours',
    prerequisites: ['trees'],
    x: 70,
    y: 120
  },
  {
    id: 'union-find',
    name: 'Union Find (Disjoint Set)',
    difficulty: 'Medium',
    estimatedStudyTime: '3-4 Hours',
    prerequisites: ['graphs'],
    x: 90,
    y: 130
  }
];

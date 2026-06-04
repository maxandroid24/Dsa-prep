import { SDEPlan } from '../types';

export interface RevisionGuide {
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    points: string[];
    highlight?: string;
  }[];
}

export const revisionGuides: { [key: string]: RevisionGuide } = {
  short15m: {
    title: "15 Minute Revision Notes",
    subtitle: "Ultra-short high-yield checkpoints for the final wait room",
    sections: [
      {
        heading: "🧠 Instant Pattern Matchers",
        points: [
          "Subarray sum with exact constraints or positive elements only -> Sliding Window.",
          "Subarray sum equaling target with negative numbers -> Prefix Sums + HashMap.",
          "Searching inside contiguous spaces with sorting property -> Binary Search.",
          "Shortest path in unweighted arrays/grids -> Breadth-First Search (BFS).",
          "Balanced tree, depth computation, parsing permutations -> Recursion DFS.",
          "Kth largest / smallest elements query -> Min Heap or Max Heap of size K."
        ]
      },
      {
        heading: "⚡ High-Speed Big-O Checkups",
        points: [
          "A single nested loop doing linear reductions -> O(N).",
          "Halving search boundary steps -> O(log N).",
          "Dynamic arrays index lookup -> O(1). Node deletion from doubly-linked list -> O(1).",
          "Iterating over matrix grid of R rows and C columns -> O(R * C)."
        ]
      },
      {
        heading: "⚠️ Bug Prevention Checklist",
        points: [
          "Are my base cases fully structured? Check array sizes of 0, 1, or 2.",
          "Will my binary search standard code trigger infinite iterations? Verify bounds (low <= high).",
          "Did I reset state variables correctly across loops?",
          "Are my dynamic pointers safely updated before dereferencing?"
        ]
      }
    ]
  },
  hour1: {
    title: "1 Hour Revision Guide",
    subtitle: "Comprehensive review of the structural foundations on interview morning",
    sections: [
      {
        heading: "📊 Big-O Complexity Matrix",
        points: [
          "Arrays: Random access is O(1). Searching is O(N) or O(log N) if sorted.",
          "HashMaps: O(1) average lookup/insertion. Keep in mind worst case is O(N) in high collision rates.",
          "LinkedLists: Quick O(1) bounds insertion/deletion, but slow O(N) traversal retrieval.",
          "Heaps: Reading peak is O(1), extraction/heaps updates take O(log N).",
          "Trees & BST: Balanced BST is O(log N) for height path exploration. Skewed degrade to O(N)."
        ]
      },
      {
        heading: "🧱 The Big 3 DP Transitions",
        points: [
          "Fibonacci style: DP[i] = DP[i-1] + DP[i-2] (only 2 variables needed).",
          "0/1 Knapsack: DP[w] = max(DP[w], DP[w - weight[i]] + value[i]) -> Process loops backwards.",
          "LCS Grid: Match -> DP[i][j] = 1 + DP[i-1][j-1]. Mismatch -> max(DP[i-1][j], DP[i][j-1])."
        ]
      },
      {
        heading: "🤝 Critical Design Templates",
        points: [
          "LRU Cache: HashMap + Doubly LinkedList is the absolute classic.",
          "Trie (Prefix): Each node contains standard array pointers (Node[26]) and standard boolean indicators.",
          "Union-Find: Do not forget path compression recursion inside 'find()', and weight ranks checking on 'union()'."
        ]
      },
      {
        heading: "📢 Behavior Interview STAR Framework",
        points: [
          "Situation: Standard background context.",
          "Task: What specific challenge required immediate resolution?",
          "Action: Your specific strategic action utilizing clear software methodologies.",
          "Result: Quantified success indicators (e.g. reduced load times by 20%, improved coverage to 95%)."
        ]
      }
    ]
  },
  lastNight: {
    title: "Last Night Before Interview",
    subtitle: "High-yield conceptual revision and resting preparation",
    sections: [
      {
        heading: "🛌 Mindset and Rest Strategy",
        points: [
          "Stop writing mock code at least 3 hours before bed to let your subconscious consolidate structures.",
          "Focus on standard system design boundaries rather than drilling unfamiliar edge cases.",
          "Get a solid 7-8 hours of sleep. Optimal neural cognition beats cramming a final hard problem."
        ]
      },
      {
        heading: "📝 Technical Strategy Formulation",
        points: [
          "1. Listen carefully: Don't write code immediately. Ask clarifying questions on constraints (size bounds, negative variables, output sorting).",
          "2. State a brute-force approach first. Acknowledge its complexity (e.g., O(N^2) or O(2^N)) and explain exactly why optimization is needed.",
          "3. Think out loud. Speak about your pointers, maps, and space trade-offs clearly as you design.",
          "4. Trace with simple test cases manually on the board/editor before submitting or claiming success."
        ]
      },
      {
        heading: "💎 Top Five High-Frequency Tricks",
        points: [
          " XOR of matching numbers resolves to 0. XOR with 0 resolves to the number itself. (Excellent for Single Number problems).",
          " Floyd's Tortoise and Hare pointers will consistently detect cycles in Linked List structures.",
          " If elements are within a limited range, you can use index markers (negating standard elements) to achieve O(1) auxiliary space.",
          " Reversing a range in an array is equivalent to opposite pointers swapping until they meet.",
          " BST trees can be verified by checking nodes values boundaries leftMax < current < rightMin during DFS."
        ]
      }
    ]
  }
};

export const sdePlans: SDEPlan[] = [
  {
    id: "30-day",
    name: "30-Day SDE Interview Plan",
    durationDays: 30,
    description: "Deep-dive comprehensive revision layout for SWE-1 and SWE-2 roles, covering foundational theory and 2 questions daily.",
    schedule: [
      { day: 1, title: "Arrays & String Basics", topicId: "arrays", tasks: ["Review prefix sums", "Solve Two Sum", "Solve Best stock timing"] },
      { day: 2, title: "String Manipulation Problems", topicId: "arrays", tasks: ["Verify String Palindromes", "Review Reverse Words in place"] },
      { day: 3, title: "Hashing foundations", topicId: "hashing", tasks: ["Solve Contains Duplicate", "Understand hash collisions chaining"] },
      { day: 4, title: "Advanced Hashing Combinations", topicId: "hashing", tasks: ["Solve Group Anagrams", "Review HashMap resize mechanisms"] },
      { day: 5, title: "Two Pointers Basics", topicId: "two-pointers", tasks: ["Reverse string in-place", "Solve Valid Palindrome with non-alphanumeric chars"] },
      { day: 6, title: "Two Pointers Opposites", topicId: "two-pointers", tasks: ["Solve 3Sum", "Solve Container with most water"] },
      { day: 7, title: "Fixed Sliding Window", topicId: "sliding-window", tasks: ["Review Max Average Sum K size", "Solve sliding window maximum constraints"] },
      { day: 8, title: "Variable Sliding Window", topicId: "sliding-window", tasks: ["Solve Longest unique substring", "Refactor map update markers"] },
      { day: 9, title: "Binary Search Basics", topicId: "binary-search", tasks: ["Solve Binary Search basic iteration", "Locate search pivots"] },
      { day: 10, title: "Search on Answer patterns", topicId: "binary-search", tasks: ["Solve Koko eating bananas", "Analyze monotonic functions limits"] },
      { day: 11, title: "Linked List foundations", topicId: "linked-lists", tasks: ["Review reference nodes values", "Reverse LinkedList in-place"] },
      { day: 12, title: "Cycle detection inside lists", topicId: "linked-lists", tasks: ["Solve detect linkedlist cycle", "Understand runner slow-fast pointers equality"] },
      { day: 13, title: "Trees & DFS", topicId: "trees", tasks: ["Review Inorder, Preorder trajectories", "Invert Binary Tree helper"] },
      { day: 14, title: "Trees & BFS Level loops", topicId: "trees", tasks: ["Solve Level order BFS returning lists of lists", "Determine queue borders"] },
      { day: 15, title: "Balanced Trees & BST properties", topicId: "trees", tasks: ["Validate BST nodes bounds", "Deep path checks recursive functions"] },
      { day: 16, title: "Heaps operations basic", topicId: "heaps", tasks: ["Understand PriorityQueue comparisons", "Assemble K size largest trackers"] },
      { day: 17, title: "PriorityQueue Streams solutions", topicId: "heaps", tasks: ["Solve median from data stream", "Maintain min/max balanced heaps"] },
      { day: 18, title: "Graph Adjacency Structures", topicId: "graphs", tasks: ["Implement adjacency lists", "Execute standard queue BFS graphs"] },
      { day: 19, title: "Graphs DFS searches", topicId: "graphs", tasks: ["Solve Number of Islands grid", "Traverse flood fill algorithms"] },
      { day: 20, title: "Topological Sorting schemas", topicId: "graphs", tasks: ["Solve Course Schedule classes", "Kahn's algorithm using indegree arrays"] },
      { day: 21, title: "Weighted graph pathfinding", topicId: "graphs", tasks: ["Understand Dijkstra templates", "Evaluate log complexity overheads"] },
      { day: 22, title: "Dynamic Programming introduction", topicId: "dp", tasks: ["Review Fibonacci 1D space optimizations", "Solve Climbing Stairs sum"] },
      { day: 23, title: "Dynamic Programming Grid matching", topicId: "dp", tasks: ["Solve Longest Common Subsequence", "Assemble base dimensions DP matrix"] },
      { day: 24, title: "Dynamic Programming Knapsack", topicId: "dp", tasks: ["Solve Knapsack 01 arrays", "Review backward capacity loop indexes"] },
      { day: 25, title: "Unified System Cache Design", topicId: "lru-cache", tasks: ["Review LRU Cache put/get complexity", "Synchronize node swaps"] },
      { day: 26, title: "Trie Tree implementation", topicId: "trie", tasks: ["Create Trie Class", "Test character letter increments paths"] },
      { day: 27, title: "Disjoint Set algorithms", topicId: "union-find", tasks: ["Assemble Union-Find with path compression", "Calculate components networks"] },
      { day: 28, title: "System Mock tests simulations", topicId: "arrays", tasks: ["Run random selection arrays and trees questions", "Practice speaking out loud"] },
      { day: 29, title: "Complete Revision Guide", topicId: "hashing", tasks: ["Review 1 Hour Guide", "Check time complexities of all data structures"] },
      { day: 30, title: "Rest and Preparation Mode", topicId: "arrays", tasks: ["Read Last Night guides", "Prepare workspace, ensure high confidence"] }
    ]
  },
  {
    id: "14-day",
    name: "14-Day Fast-Track Revision Plan",
    durationDays: 14,
    description: "Accelerated DSA study track tailored for upcoming interviews in two weeks.",
    schedule: [
      { day: 1, title: "Arrays & Hashing basics", topicId: "arrays", tasks: ["Group Anagrams solution", "Product of Array except self"] },
      { day: 2, title: "Two Pointers Checkpoints", topicId: "two-pointers", tasks: ["Valid Palindromes", "3Sum sorted opposite checkups"] },
      { day: 3, title: "Sliding Windows segments", topicId: "sliding-window", tasks: ["Longest unique substring", "Max floating window K elements"] },
      { day: 4, title: "Binary Search boundaries", topicId: "binary-search", tasks: ["Search in rotated sorted array", "Koko eating speed parameters"] },
      { day: 5, title: "Linked Lists algorithms", topicId: "linked-lists", tasks: ["In-place list reversing", "Floyd cycle pointers tracking"] },
      { day: 6, title: "Binary Trees traversal", topicId: "trees", tasks: ["Level Order traversal", "Invert Binary Tree DFS"] },
      { day: 7, title: "Binary Search Trees checks", topicId: "trees", tasks: ["Validate BST", "Binary Tree max path sums"] },
      { day: 8, title: "Heaps and priority limits", topicId: "heaps", tasks: ["Kth largest element", "Median streams calculations"] },
      { day: 9, title: "Graph BFS / DFS", topicId: "graphs", tasks: ["Number of islands Grid", "Flood fill recursive templates"] },
      { day: 10, title: "Graph Topological Sorting", topicId: "graphs", tasks: ["Course Schedule", "Indegree arrays tracking"] },
      { day: 11, title: "Dynamic Programming 1D & 2D", topicId: "dp", tasks: ["Climbing stairs", "Longest common subsequence"] },
      { day: 12, title: "Advanced Cache structures", topicId: "lru-cache", tasks: ["Complete LRU Cache put & get template design"] },
      { day: 13, title: "Tries & Union-Find components", topicId: "trie", tasks: ["Prefix tree word search", "Union-Find path compression cycle checks"] },
      { day: 14, title: "Final Board Revision", topicId: "graphs", tasks: ["1 Hour Guide review", "Prepare STAR behavior interview instances"] }
    ]
  },
  {
    id: "7-day",
    name: "7-Day Emergency Preparation Plan",
    durationDays: 7,
    description: "Extreme, ultra-focused, highest-return patterns to review 7 days before the interview in crunch time.",
    schedule: [
      { day: 1, title: "Arrays & Sliding Windows", topicId: "arrays", tasks: ["Product of Array Except Self", "Longest Unique Substring"] },
      { day: 2, title: "Two Pointers & Binary Search", topicId: "two-pointers", tasks: ["3Sum triplets", "Search in Rotated Sorted Array"] },
      { day: 3, title: "Linked List Cycles & Trees", topicId: "linked-lists", tasks: ["Reverse Linked List", "Binary Tree Level order traversal"] },
      { day: 4, title: "Heaps & Dijkstra graph pathways", topicId: "heaps", tasks: ["Kth Largest Element", "Dijkstra template checklist"] },
      { day: 5, title: "Core Dynamic Programming structures", topicId: "dp", tasks: ["Climbing Stairs", "Longest Common Subsequence"] },
      { day: 6, title: "High speed Cache and Tries", topicId: "lru-cache", tasks: ["LRU Cache key swap map template", "Trie Prefix Tree inserts"] },
      { day: 7, title: "Final Wait-room check", topicId: "arrays", tasks: ["15 Minute waitroom checks", "STAR template reviews"] }
    ]
  }
];

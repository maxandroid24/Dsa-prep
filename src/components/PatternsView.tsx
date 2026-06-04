import { useState } from 'react';
import { Check, Clipboard, ShieldAlert, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface PatternData {
  id: string;
  name: string;
  concept: string;
  template: {
    java: string;
    python: string;
  };
  questions: { title: string; link: string }[];
  pitfalls: string[];
}

export default function PatternsView() {
  const [activePatternId, setActivePatternId] = useState<string>('sliding-window');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'java' | 'python'>('java');

  const patterns: { [id: string]: PatternData } = {
    'sliding-window': {
      id: 'sliding-window',
      name: "Sliding Window Pattern",
      concept: "Used to solve problems over sequential subarrays or contiguous sub-segments. Maintaining a floating window defined by two boundaries [left, right] allows updates in linear O(N) time instead of costly O(N^2) quadratic checks.",
      template: {
        java: `public int findLength(int[] arr, int target) {\n    int left = 0, maxLength = 0, runningSum = 0;\n    for (int right = 0; right < arr.length; right++) {\n        runningSum += arr[right]; // Expand window\n\n        while (runningSum > target) {\n            runningSum -= arr[left]; // Shrink window from left\n            left++;\n        }\n        maxLength = Math.max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}`,
        python: `def find_length(arr, target):\n    left = 0\n    max_length = 0\n    running_sum = 0\n    for right in range(len(arr)):\n        running_sum += arr[right]\n        \n        while running_sum > target:\n            running_sum -= arr[left]\n            left += 1\n            \n        max_length = max(max_length, right - left + 1)\n    return max_length`
      },
      questions: [
        { title: "Longest Substring Without Repeating Chars", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Minimum Window Substring", link: "https://leetcode.com/problems/minimum-window-substring/" },
        { title: "Sliding Window Maximum", link: "https://leetcode.com/problems/sliding-window-maximum/" }
      ],
      pitfalls: [
        "Incomplete frequency mapping updates when moving the left boundary.",
        "Infinite loops due to improper boundaries updates.",
        "Attempting to apply sliding window on arrays with negative values without adjusting conditions."
      ]
    },
    'two-pointers': {
      id: 'two-pointers',
      name: "Two Pointers Pattern",
      concept: "Iteratively traverses sorted collections by shifting left (0) and right (end) pointers inward to find target pairs, or tracking relative speed using slow and fast pointers to identify linked list nodes.",
      template: {
        java: `public boolean hasTargetSum(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        if (sum == target) return true;\n        if (sum < target) left++;\n        else right--;\n    }\n    return false;\n}`,
        python: `def has_target_sum(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        curr_sum = arr[left] + arr[right]\n        if curr_sum == target:\n            return True\n        elif curr_sum < target:\n            left += 1\n            \n        else:\n            right -= 1\n    return False`
      },
      questions: [
        { title: "Two Sum II (Sorted)", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { title: "3Sum Triplet Finder", link: "https://leetcode.com/problems/3sum/" },
        { title: "Container With Most Water", link: "https://leetcode.com/problems/container-with-most-water/" }
      ],
      pitfalls: [
        "Index out-of-bounds due to missing bounds verification (left < right).",
        "Failure to sort the collection first (the outward opposite pointer strategy strictly requires sorted inputs).",
        "Not skipping duplicate values (results in duplicate triplets in 3Sum)."
      ]
    },
    'binary-search': {
      id: 'binary-search',
      name: "Binary Search Patterns",
      concept: "A highly optimized method of searching a sorted collection by consistently dividing the search range in half, achieving O(log N) depth iterations.",
      template: {
        java: `public int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2; // Prevent overflow\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
        python: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`
      },
      questions: [
        { title: "Search in Rotated Sorted Array", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { title: "First & Last Position of Element", link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
        { title: "Koko Eating Bananas (Search on Answer)", link: "https://leetcode.com/problems/koko-eating-bananas/" }
      ],
      pitfalls: [
        "Integer addition overflow when calculating middle using `(low + high) / 2`.",
        "Incorrect termination conditions like using `while (low < high)` when lookups require `<=` bounds.",
        "Improperly updating boundary variables on mismatch (e.g. `low = mid` directly, which can cause infinite loops)."
      ]
    },
    'dfs': {
      id: 'dfs',
      name: "DFS (Depth-First Search) Pattern",
      concept: "Explores all possible branches as deep as possible before backtracking. Backed recursively by the execution call stack or explicitly by a Stack structure.",
      template: {
        java: `public void dfs(TreeNode root) {\n    if (root == null) return;\n    System.out.println(root.val);\n    dfs(root.left);\n    dfs(root.right);\n}`,
        python: `def dfs(root):\n    if not root:\n        return\n    print(root.val)\n    dfs(root.left)\n    dfs(root.right)`
      },
      questions: [
        { title: "Invert Binary Tree", link: "https://leetcode.com/problems/invert-binary-tree/" },
        { title: "Path Sum Evaluation", link: "https://leetcode.com/problems/path-sum/" },
        { title: "Number of Islands Flood-fill", link: "https://leetcode.com/problems/number-of-islands/" }
      ],
      pitfalls: [
        "Missing base cases or termination conditions to stop recursive depth, leading to StackOverflowError.",
        "Failing to track previously visited nodes in graphs, causing infinite recursion loops.",
        "Unnecessarily copying arrays or structures on each recursive call."
      ]
    },
    'bfs': {
      id: 'bfs',
      name: "BFS (Breadth-First Search) Pattern",
      concept: "Traverses tree or graph structures layer-by-layer. Highly trusted to identify shortest pathways inside adjacent, unweighted graph systems. Relies on an explicit Queue.",
      template: {
        java: `public void bfs(TreeNode root) {\n    if (root == null) return;\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.add(root);\n    while (!queue.isEmpty()) {\n        TreeNode curr = queue.poll();\n        System.out.println(curr.val);\n        if (curr.left != null) queue.add(curr.left);\n        if (curr.right != null) queue.add(curr.right);\n    }\n}`,
        python: `from collections import deque\ndef bfs(root):\n    if not root:\n        return\n    queue = deque([root])\n    while queue:\n        curr = queue.popleft()\n        print(curr.val)\n        if curr.left: queue.append(curr.left)\n        if curr.right: queue.append(curr.right)`
      },
      questions: [
        { title: "Binary Tree Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { title: "Rotting Oranges", link: "https://leetcode.com/problems/rotting-oranges/" },
        { title: "Word Ladder shortest path", link: "https://leetcode.com/problems/word-ladder/" }
      ],
      pitfalls: [
        "Extremely slow poll times due to selecting standard ArrayList structures as queues instead of optimal LinkedList/Deque classes.",
        "Not measuring current queue boundaries before commencing current level iteration loops.",
        "Memory footprint exhaustion caused by putting numerous items into queue before tracking visited sets."
      ]
    },
    'dynamic-programming': {
      id: 'dynamic-programming',
      name: "Dynamic Programming Template",
      concept: "Addresses complex calculations by splitting structures into memoized substates loops (1D tabulation, grid coordinate values grids) or recursion cash flows caches.",
      template: {
        java: `public int solveLIS(int[] arr) {\n    int[] dp = new int[arr.length];\n    java.util.Arrays.fill(dp, 1);\n    int overallMax = 1;\n    for (int i = 1; i < arr.length; i++) {\n        for (int j = 0; j < i; j++) {\n            if (arr[i] > arr[j]) {\n                dp[i] = Math.max(dp[i], dp[j] + 1);\n            }\n        }\n        overallMax = Math.max(overallMax, dp[i]);\n    }\n    return overallMax;\n}`,
        python: `def solve_lis(arr):\n    dp = [1] * len(arr)\n    for i in range(1, len(arr)):\n        for j in range(i):\n            if arr[i] > arr[j]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)`
      },
      questions: [
        { title: "Climbing Stairs Fibonacci", link: "https://leetcode.com/problems/climbing-stairs/" },
        { title: "Longest Increasing Subsequence LIS", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
        { title: "Coin Change Problem", link: "https://leetcode.com/problems/coin-change/" }
      ],
      pitfalls: [
        "Unclear base cases initializing DP array (always double-check `dp[0]` and `dp[1]`).",
        "Over-allocating memory matrices sizes of [N][M] when calculations only depend on previous 1D indices.",
        "Defining suboptimal state transition formulas."
      ]
    },
    'graph-patterns': {
      id: 'graph-patterns',
      name: "Graph Patterns",
      concept: "Focuses on representing adjacent adjacency vector networks and running edge traversals (Kahn's topo sorts, shortest path weightings via DijkstraHeaps).",
      template: {
        java: `public boolean hasCycleBFS(int V, List<List<Integer>> adj) {\n    int[] indegree = new int[V];\n    for (int i = 0; i < V; i++) {\n        for (int node : adj.get(i)) indegree[node]++;\n    }\n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < V; i++) {\n        if (indegree[i] == 0) q.add(i);\n    }\n    int count = 0;\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        count++;\n        for (int v : adj.get(u)) {\n            if (--indegree[v] == 0) q.add(v);\n        }\n    }\n    return count != V; // true if cyclic (not DAG)\n}`,
        python: `from collections import deque\ndef has_cycle_bfs(V, adj):\n    indegree = [0] * V\n    for u in range(V):\n        for v in adj[u]:\n            indegree[v] += 1\n    q = deque([i for i in range(V) if indegree[i] == 0])\n    count = 0\n    while q:\n        u = q.popleft()\n        count += 1\n        for v in adj[u]:\n            indegree[v] -= 1\n            if indegree[v] == 0: q.append(v)\n    return count != V`
      },
      questions: [
        { title: "Course Schedule dependency check", link: "https://leetcode.com/problems/course-schedule/" },
        { title: "Number of Provinces", link: "https://leetcode.com/problems/number-of-provinces/" },
        { title: "Network Delay Time (Dijkstra)", link: "https://leetcode.com/problems/network-delay-time/" }
      ],
      pitfalls: [
        "Neglecting back-edges/multi-edges inside undirected graphs in cycle detection.",
        "Using simple DFS without cycle tracking, leading to compiler timeouts.",
        "Forgetting to check if vertices disconnected components are fully explored."
      ]
    },
    'heap-patterns': {
      id: 'heap-patterns',
      name: "Heap / Stream Patterns",
      concept: "Uses heap queues (Min/Max heaps) to continuously track dynamically sorted boundaries over real-time continuous input streams.",
      template: {
        java: `import java.util.PriorityQueue;\npublic int findKthSmallest(int[] nums, int k) {\n    PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);\n    for (int x : nums) {\n        maxHeap.add(x);\n        if (maxHeap.size() > k) maxHeap.poll();\n    }\n    return maxHeap.peek();\n}`,
        python: `import heapq\ndef find_kth_smallest(nums, k):\n    # Python heapq values support minimal sorting, negate values for MaxHeap\n    max_heap = []\n    for x in nums:\n        heapq.heappush(max_heap, -x)\n        if len(max_heap) > k:\n            heapq.heappop(max_heap)\n    return -max_heap[0]`
      },
      questions: [
        { title: "Kth Largest Element inside an Array", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
        { title: "Find Median from continuous Stream", link: "https://leetcode.com/problems/find-median-from-data-stream/" },
        { title: "Merge K Sorted lists", link: "https://leetcode.com/problems/merge-k-sorted-lists/" }
      ],
      pitfalls: [
        "In Java, priority queues are Min-Heaps by default. Instantiating standard lists directly leaves values sorted incorrectly for Max queries.",
        "Adding too many items to the heap: keep sizes constrained at K to limit heap update complexities to O(log K) rather than O(log N).",
        "Inefficient inserts inside streaming systems."
      ]
    }
  };

  const currentPattern = patterns[activePatternId];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Pattern list selectors */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-805 rounded-xl p-4 h-fit space-y-1 select-none">
        <h3 className="text-xs font-mono font-bold text-slate-500 uppercase px-3 pb-2.5 border-b border-slate-805 mb-2 tracking-wider">
          DSA PATTERN BANK
        </h3>
        
        {Object.values(patterns).map((p) => (
          <button 
            key={p.id}
            onClick={() => { setActivePatternId(p.id); setActiveLang('java'); }}
            className={`w-full text-left px-3 py-2.5 rounded text-xs transition font-mono ${
              activePatternId === p.id 
                ? 'bg-indigo-950/60 border border-indigo-900 text-indigo-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {p.name.replace(' Pattern', '')}
          </button>
        ))}
      </div>

      {/* Main Pattern Detail Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-slate-900 border border-slate-805 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-indigo-400">
              Interactive Pattern Resource
            </span>
            <h2 className="text-xl md:text-2xl font-sans font-bold text-slate-100">{currentPattern.name}</h2>
          </div>

          <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans border-t border-slate-800 pt-4">
            {currentPattern.concept}
          </p>
        </div>

        {/* Template Code with dynamic toggles */}
        <div className="bg-slate-900 border border-slate-805 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-wrap gap-2">
            <span className="text-xs font-mono text-slate-330 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Pattern Boilerplate Template
            </span>

            <div className="flex gap-2 items-center font-mono select-none">
              <button 
                onClick={() => setActiveLang('java')}
                className={`py-1 px-3 text-[10px] font-bold rounded ${activeLang === 'java' ? 'bg-indigo-950 border border-indigo-900 text-indigo-400' : 'text-slate-505'}`}
              >
                Java
              </button>
              <button 
                onClick={() => setActiveLang('python')}
                className={`py-1 px-3 text-[10px] font-bold rounded ${activeLang === 'python' ? 'bg-indigo-950 border border-indigo-900 text-indigo-400' : 'text-slate-505'}`}
              >
                Python3
              </button>

              <button 
                onClick={() => handleCopy(currentPattern.template[activeLang], currentPattern.id)}
                className="text-slate-500 hover:text-indigo-400 transition text-[10px] bg-slate-950 border border-slate-850 py-1 px-2.5 rounded font-bold"
              >
                {copiedId === currentPattern.id ? 'Copied code!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <pre className="overflow-x-auto bg-slate-950 border border-slate-850 p-4 rounded-lg text-xs font-mono text-slate-300 leading-relaxed">
            {currentPattern.template[activeLang]}
          </pre>
        </div>

        {/* Pitfalls & Questions row split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Classic Questions */}
          <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-sans font-bold text-slate-200">Recommended Practice Problems</h3>
            <div className="space-y-2.5">
              {currentPattern.questions.map((q, idx) => (
                <a 
                  key={idx}
                  href={q.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-slate-950 p-3 rounded-lg border border-slate-850/60 hover:border-indigo-500/40 hover:bg-slate-850/20 transition flex justify-between items-center text-xs font-sans text-slate-300"
                  referrerPolicy="no-referrer"
                >
                  <span className="font-semibold">{q.title}</span>
                  <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 font-bold">LeetCode ↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* High Yield Pitfalls */}
          <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-sans font-bold text-slate-205 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Watch Out! Common Pitfalls
            </h3>
            <div className="space-y-2.5">
              {currentPattern.pitfalls.map((pit, idx) => (
                <div key={idx} className="bg-slate-955 p-3 rounded-lg border border-slate-850/60 flex gap-2 text-xs text-slate-400 leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 text-coral-405 shrink-0 mt-0.5" />
                  <span>{pit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

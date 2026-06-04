import { Topic } from '../types';

export const dsaTopics: Topic[] = [
  {
    id: 'arrays',
    name: 'Arrays & Strings',
    difficulty: 'Easy',
    studyTime: '3-4 Hours',
    prerequisites: [],
    overview: 'Arrays are contiguous blocks of memory holding elements of the same type. Strings are essentially character arrays with distinct immutability profiles depending on the programming language chosen.',
    theory: {
      coreConcepts: [
        'Contiguous memory allocation allowing O(1) random index access.',
        'Immutability: In Java/Python, Strings are immutable, creating a new string on concatenation.',
        'Resizing: Dynamic arrays (ArrayList, vector, list) double in size when full, bringing amortized O(1) appends.',
        'Bubble Sort (Inversions): Swaps adjacent out-of-order elements in O(n^2). The number of swaps equals the number of inversions: pairs (i, j) where i < j and A[i] > A[j].',
        'Merge Sort (Divide & Conquer): Recursively halves indices, sorts subsets, and merges them back in O(n log n). Excellent for counting global array inversions in O(n log n).',
        'Counting Sort (Distributional Sort): Solves sorting in optimized linear O(n + g) time when elements are positive integers bounded by a small limit g.'
      ],
      visualExplanation: '[Element 0] -> [Element 1] -> [Element 2] -> [Element 3] (Contiguous Memory Locations with dynamic double capacity limits)',
      timeComplexity: {
        'Access (Index)': 'O(1)',
        'Unsorted Search': 'O(N)',
        'Sorted Binary Search': 'O(log N)',
        'Insertion / Deletion (At End)': 'O(1) amortized',
        'Insertion / Deletion (Start/Middle)': 'O(N)',
        'Merge Sort / C++ std::sort': 'O(N log N)'
      },
      spaceComplexity: {
        'Static Allocation': 'O(N)',
        'In-place Bubble Sort': 'O(1) auxiliary',
        'Merge Sort Aux Buffers': 'O(N)'
      }
    },
    cheatSheet: {
      title: 'Array & Sorting Checklist',
      points: [
        'Validate empty domains, index bounds, and memory duplication penalties when appending to collections.',
        'Use native string conversion tools (e.g. StringBuilder in Java or lists in Python) instead of simple concatenation loops (+).',
        'Sorting is often a powerful preprocessing step! Sort elements first to unlock O(n) two-pointer scans or O(log n) binary divisions.',
        'Counting Sort is a cheat code: use it when array values fall within a tight numerical bound.'
      ]
    },
    patterns: [
      {
        name: 'Prefix Sum',
        description: 'Precomputing prefix sums allows you to retrieve the sum of elements within any range [L, R] in O(1) time instead of O(N) traversal.',
        templates: {
          java: `public class PrefixSum {\n    public int[] makePrefixArray(int[] arr) {\n        int[] prefix = new int[arr.length];\n        prefix[0] = arr[0];\n        for (int i = 1; i < arr.length; i++) {\n            prefix[i] = prefix[i - 1] + arr[i];\n        }\n        return prefix;\n    }\n}`,
          kotlin: `class PrefixSum {\n    fun makePrefixArray(arr: IntArray): IntArray {\n        val prefix = IntArray(arr.size)\n        prefix[0] = arr[0]\n        for (i in 1 until arr.size) {\n            prefix[i] = prefix[i - 1] + arr[i]\n        }\n        return prefix\n    }\n}`,
          python: `def make_prefix_array(arr):\n    prefix = [0] * len(arr)\n    prefix[0] = arr[0]\n    for i in range(1, len(arr)):\n        prefix[i] = prefix[i - 1] + arr[i]\n    return prefix`,
          cpp: `std::vector<int> makePrefixArray(const std::vector<int>& arr) {\n    std::vector<int> prefix(arr.size());\n    prefix[0] = arr[0];\n    for (size_t i = 1; i < arr.size(); ++i) {\n        prefix[i] = prefix[i - 1] + arr[i];\n    }\n    return prefix;\n}`
        }
      },
      {
        name: 'Kadane\'s Algorithm',
        description: 'Iteratively updates the maximum subarray sum ending at each position, resetting to zero or starting fresh if a running subarray becomes negative.',
        templates: {
          java: `public class Kadane {\n    public int maxSubArraySum(int[] arr) {\n        int maxSoFar = arr[0], currentMax = arr[0];\n        for (int i = 1; i < arr.length; i++) {\n            currentMax = Math.max(arr[i], currentMax + arr[i]);\n            maxSoFar = Math.max(maxSoFar, currentMax);\n        }\n        return maxSoFar;\n    }\n}`,
          kotlin: `fun maxSubArraySum(arr: IntArray): Int {\n    var maxSoFar = arr[0]\n    var currentMax = arr[0]\n    for (i in 1 until arr.size) {\n        currentMax = maxOf(arr[i], currentMax + arr[i])\n        maxSoFar = maxOf(maxSoFar, currentMax)\n    }\n    return maxSoFar\n}`,
          python: `def max_sub_array_sum(arr):\n    max_so_far = current_max = arr[0]\n    for i in range(1, len(arr)):\n        current_max = max(arr[i], current_max + arr[i])\n        max_so_far = max(max_so_far, current_max)\n    return max_so_far`,
          cpp: `int maxSubArraySum(const std::vector<int>& arr) {\n    int maxSoFar = arr[0], currentMax = arr[0];\n    for (size_t i = 1; i < arr.size(); ++i) {\n        currentMax = std::max(arr[i], currentMax + arr[i]);\n        maxSoFar = std::max(maxSoFar, currentMax);\n    }\n    return maxSubArraySum;\n}`
        }
      }
    ]
  },
  {
    id: 'hashing',
    name: 'Hashing',
    difficulty: 'Easy',
    studyTime: '2-3 Hours',
    prerequisites: ['arrays'],
    overview: 'Hashing is mapping key-value associations through arithmetic hash functions, enabling near-instant queries, checks, and categorization metrics.',
    theory: {
      coreConcepts: [
        'Collision resolution: Chaining (using linked structures) vs Open addressing (probing).',
        'Load factor threshold triggers resizing of underlying buckets array.',
        'Average operations resolve in O(1) time amortized.'
      ],
      visualExplanation: 'Key -> [Hash Function] -> Array Index Bucket -> Linked Node Chain',
      timeComplexity: {
        'Get / Put (Average)': 'O(1)',
        'Get / Put (Worst Case)': 'O(N) during high collision index clustering',
        'Key Deletions': 'O(1)'
      },
      spaceComplexity: {
        'Storage footprint': 'O(N) equivalent to elements loaded'
      }
    },
    cheatSheet: {
      title: 'Hashing Quick Hacks',
      points: [
        'Always check if object reference overrides equals() and hashCode() custom methods!',
        'Use standard Prime multipliers to minimize hash collisions.',
        'A HashSet is internally backed by a HashMap where values are dummy pointers.'
      ]
    },
    patterns: [
      {
        name: 'Frequency Counting',
        description: 'Track repetitions of items cleanly using map associations, solving anagram validation, elements majorities, or uniqueness.',
        templates: {
          java: `public class FrequencyCounter {\n    public java.util.Map<Integer, Integer> countFreq(int[] arr) {\n        java.util.Map<Integer, Integer> counts = new java.util.HashMap<>();\n        for (int x : arr) {\n            counts.put(x, counts.getOrDefault(x, 0) + 1);\n        }\n        return counts;\n    }\n}`,
          kotlin: `fun countFreq(arr: IntArray): Map<Int, Int> {\n    val counts = hashMapOf<Int, Int>()\n    for (x in arr) {\n        counts[x] = counts.getOrDefault(x, 0) + 1\n    }\n    return counts\n}`,
          python: `from collections import Counter\ndef count_freq(arr):\n    return dict(Counter(arr))`,
          cpp: `std::unordered_map<int, int> countFreq(const std::vector<int>& arr) {\n    std::unordered_map<int, int> counts;\n    for (int x : arr) {\n        counts[x]++;\n    }\n    return counts;\n}`
        }
      }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    difficulty: 'Easy',
    studyTime: '3-4 Hours',
    prerequisites: ['arrays'],
    overview: 'Utilizes two index variables to head toward/away from each other. Useful for finding pairs in sorted arrays, checking palindromes, and reversing in-place.',
    theory: {
      coreConcepts: [
        'Pointers can start at extremes (opposite pointers) or increment relative to each other (fast & slow).',
        'Saves auxiliary memory by managing search borders iteratively instead of generating arrays.'
      ],
      visualExplanation: '[P1 ->] . . . . . . . [<- P2] (Working towards the center)',
      timeComplexity: {
        'Sorted Array Search': 'O(N)',
        'In-place reversing/swapping': 'O(N)'
      },
      spaceComplexity: {
        'Auxiliary Space': 'O(1)'
      }
    },
    cheatSheet: {
      title: 'Two Pointers Guide',
      points: [
        'Often requires ordering or sorting before pointer logic fits.',
        'Use fast & slow pointer variables to detect linked lists loop nodes cycles.',
        'Ensure the boundaries check (right >= left) is strictly bounded to prevent infinite indexing loops.'
      ]
    },
    patterns: [
      {
        name: 'Opposite Direction',
        description: 'Start one pointer left (0) and another right (end), moving inward depending on inequality comparisons.',
        templates: {
          java: `public class TwoPointers {\n    public boolean isPalindrome(String s) {\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            if (s.charAt(left) != s.charAt(right)) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n}`,
          kotlin: `fun isPalindrome(s: String): Boolean {\n    var left = 0\n    var right = s.length - 1\n    while (left < right) {\n        if (s[left] != s[right]) return false\n        left++\n        right--\n    }\n    return true\n}`,
          python: `def is_palindrome(s: str) -> bool:\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True`,
          cpp: `bool isPalindrome(const std::string& s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        if (s[left] != s[right]) return false;\n        left++;\n        right--;\n    }\n    return true;\n}`
        }
      }
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    difficulty: 'Medium',
    studyTime: '4-5 Hours',
    prerequisites: ['two-pointers'],
    overview: 'Maintains a sub-segment window over a larger collection, efficiently updating metrics as the window shifts relative to elements.',
    theory: {
      coreConcepts: [
        'Avoids redundant calculation over overlapping spans.',
        'Two types: Fixed Window size (e.g., length matches K) vs Variable Window size (increases right boundary, and shrinks left when state is violated).'
      ],
      visualExplanation: 'Array: [ 1  3  -1 ] -3  5  3  6   ->  1 [ 3  -1  -3 ] 5  3  6 (Sliding range K=3)',
      timeComplexity: {
        'Amortized Search Operations': 'O(N)'
      },
      spaceComplexity: {
        'Auxiliary Track State': 'O(1) up to O(K) when monitoring elements inside the active span'
      }
    },
    cheatSheet: {
      title: 'Sliding Window Tips',
      points: [
        'Maintain a dynamic frequency map to record occurrences inside the active bounds.',
        'The outer loop moves the `right` pointer. The inner dynamic loop moves `left` to restore invariants.',
        'Keep tracking global properties (e.g., maxLength = maxOf(maxLength, right - left + 1)).'
      ]
    },
    patterns: [
      {
        name: 'Fixed Window',
        description: 'Summing index intervals or finding max elements over window spans of continuous size K.',
        templates: {
          java: `public class FixedWindow {\n    public int maxAvgSum(int[] nums, int k) {\n        int sum = 0;\n        for (int i = 0; i < k; i++) sum += nums[i];\n        int maxVal = sum;\n        for (int i = k; i < nums.length; i++) {\n            sum += nums[i] - nums[i - k];\n            maxVal = Math.max(maxVal, sum);\n        }\n        return maxVal;\n    }\n}`,
          kotlin: `fun maxAvgSum(nums: IntArray, k: Int): Int {\n    var sum = 0\n    for (i in 0 until k) sum += nums[i]\n    var maxVal = sum\n    for (i in k until nums.size) {\n        sum += nums[i] - nums[i - k]\n        maxVal = maxOf(maxVal, sum)\n    }\n    return maxVal\n}`,
          python: `def max_avg_sum(nums, k):\n    current_sum = sum(nums[:k])\n    max_val = current_sum\n    for i in range(k, len(nums)):\n        current_sum += nums[i] - nums[i - k]\n        max_val = max(max_val, current_sum)\n    return max_val`,
          cpp: `int maxAvgSum(const std::vector<int>& nums, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += nums[i];\n    int maxVal = sum;\n    for (size_t i = k; i < nums.size(); ++i) {\n        sum += nums[i] - nums[i - k];\n        maxVal = std::max(maxVal, sum);\n    }\n    return maxVal;\n}`
        }
      }
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    difficulty: 'Medium',
    studyTime: '4-5 Hours',
    prerequisites: ['arrays'],
    overview: 'Divide-and-conquer strategy operating on sorted arrays. It cuts the search space in half with each iteration, achieving highly performant O(log N) searches.',
    theory: {
      coreConcepts: [
        'Pre-requisite: Container elements must be strictly sorted.',
        'Method 1 (Interval Halving): Continually reduces the active lookup region half-by-half via low/high pointers bounds.',
        'Method 2 (Power-of-Two Jumps): Start with an initial jump length of n/2 and half it recursively (n/4, n/8, etc.) to jump through the array from left to right as long as indices remain valid and values are <= target.',
        'Finding Smallest Solutions: Search for the transition index k where a monotonic helper function ok(x) changes from false to true.',
        'Finding Maximum Values (Bitonic Peaks): Locate the peak element in a function that is first strictly increasing and then strictly decreasing using binary comparative slopes.'
      ],
      visualExplanation: 'Method 2 Jumps: 32 -> 16 -> 8 -> 4 -> 2 -> 1 (Logarithmic decaying jumps matching bit configurations)',
      timeComplexity: {
        'Standard / Jump Search': 'O(log N)',
        'ok(x) Bound Decision Search': 'O(log N * cost of ok(x))',
        'Pre-sorting cost': 'O(N log N)'
      },
      spaceComplexity: {
        'Iterative Jumps / Search': 'O(1)',
        'Recursive Slices Stack': 'O(log N)'
      }
    },
    cheatSheet: {
      title: 'Monotonic Binary Search Cheat Card',
      points: [
        'To calculate mid-points safely, use: mid = low + (high - low) / 2 to avoid addition numeric overflows.',
        'For finding the lower bound (first element >= x) in C++, prefer std::lower_bound or equal_range.',
        'When dealing with floating point domains, iterate a fixed number of times (e.g. 100 loops) instead of checking epsilons for maximum absolute precision.'
      ]
    },
    patterns: [
      {
        name: 'Lower Bound Solution',
        description: 'Identify the exact index position where bounds start corresponding to target elements.',
        templates: {
          java: `public class BinarySearch {\n    public int findIndex(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n}`,
          kotlin: `fun findIndex(arr: IntArray, target: Int): Int {\n    var low = 0\n    var high = arr.size - 1\n    while (low <= high) {\n        val mid = low + (high - low) / 2\n        if (arr[mid] == target) return mid\n        if (arr[mid] < target) low = mid + 1\n        else high = mid - 1\n    }\n    return -1\n}`,
          python: `def find_index(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
          cpp: `int findIndex(const std::vector<int>& arr, int target) { // Method 2: Jump Search from CP Handbook\n    int k = 0;\n    int n = arr.size();\n    for (int b = n / 2; b >= 1; b /= 2) {\n        while (k + b < n && arr[k + b] <= target) k += b;\n    }\n    if (arr[k] == target) return k;\n    return -1;\n}`
        }
      }
    ]
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    difficulty: 'Easy',
    studyTime: '3-4 Hours',
    prerequisites: ['arrays'],
    overview: 'Elements represented by self-contained Nodes containing values linked dynamically through pointers. Prevents preallocation capacity resizing penalties.',
    theory: {
      coreConcepts: [
        'Dynamic sizing: Fast node updates without shifting neighboring cells.',
        'Singly-linked (forward pointers only) vs Doubly-linked structural nodes (forward and backward links).',
        'Dummy root nodes are highly useful boundary buffers in list merges or deletions.'
      ],
      visualExplanation: '[Head Node] -> [Value: 10, Next: *] -> [Value: 20, Next: null]',
      timeComplexity: {
        'Insertion / Deletion at bounds': 'O(1)',
        'Node Traversal Indexing': 'O(N)'
      },
      spaceComplexity: {
        'Structure nodes allocation': 'O(N)',
        'Pointers swaps auxiliary': 'O(1)'
      }
    },
    cheatSheet: {
      title: 'Linked List Tips',
      points: [
        'Always check for `node != null` and `node.next != null` to avoid NullPointerExceptions.',
        'Use standard double pointers (slow and fast) to identify the middle of the list in O(N).',
        'When removing nodes, remember to de-reference nodes cleanly to let GC do its garbage collection.'
      ]
    },
    patterns: [
      {
        name: 'In-place Pointer Rotation',
        description: 'Change routing linkages between list blocks iteratively.',
        templates: {
          java: `public class ListNode {\n    int val; ListNode next;\n    ListNode(int val) { this.val = val; }\n}\npublic class ReverseList {\n    public ListNode reverse(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode nextNode = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextNode;\n        }\n        return prev;\n    }\n}`,
          kotlin: `class ListNode(var val: Int) {\n    var next: ListNode? = null\n}\nfun reverse(head: ListNode?): ListNode? {\n    var prev: ListNode? = null\n    var curr = head\n    while (curr != null) {\n        val nextNode = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nextNode\n    }\n    return prev\n}`,
          python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef reverse_list(head: ListNode) -> ListNode:\n    prev, curr = None, head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
          cpp: `struct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\nListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr != nullptr) {\n        ListNode* nextNode = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}`
        }
      }
    ]
  },
  {
    id: 'trees',
    name: 'Trees & BST',
    difficulty: 'Medium',
    studyTime: '6-8 Hours',
    prerequisites: ['linked-lists'],
    overview: 'Hierarchical node network linked starting from a root node. Binary Search Trees enforce order: left children are strictly smaller than parent, right children are strictly greater.',
    theory: {
      coreConcepts: [
        'Depth First Search (DFS): Preorder (Root-L-R), Inorder (L-Root-R - yields sorted BST values), Postorder (L-R-Root).',
        'Breadth First Search (BFS): Level-by-level queue traversal traversal path.',
        'Height balanced trees (AVL, Red-Black) maintain strict O(log N) depth operations.'
      ],
      visualExplanation: '       [Root Node] \n         /     \\ \n     [Left]   [Right]',
      timeComplexity: {
        'Search / Insert (Balanced)': 'O(log N)',
        'Traversal Sweep': 'O(N)',
        'Worst Case BST (Skewed)': 'O(N)'
      },
      spaceComplexity: {
        'Recursive Call stack bounds': 'O(H) where H represents the structural height of the tree'
      }
    },
    cheatSheet: {
      title: 'BST Study Card',
      points: [
        'DFS uses a recursive call stack, while BFS uses an explicit Queue data structure.',
        'Inorder traversal of a BST yields elements in sorted, ascending order.',
        'Avoid stack overflows on skewed trees by validating tree height bounds.'
      ]
    },
    patterns: [
      {
        name: 'Recursive Preorder DFS',
        description: 'Visit parent nodes first, then descend down left and right child subtrees.',
        templates: {
          java: `class TreeNode {\n    int val; TreeNode left; TreeNode right;\n    TreeNode(int val) { this.val = val; }\n}\npublic class PreOrder {\n    public void dfs(TreeNode root) {\n        if (root == null) return;\n        System.out.println(root.val);\n        dfs(root.left);\n        dfs(root.right);\n    }\n}`,
          kotlin: `class TreeNode(var val: Int) {\n    var left: TreeNode? = null\n    var right: TreeNode? = null\n}\nfun dfs(root: TreeNode?) {\n    if (root == null) return\n    println(root.val)\n    dfs(root.left)\n    dfs(root.right)\n}`,
          python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\ndef pre_order(root):\n    if not root:\n        return\n    print(root.val)\n    pre_order(root.left)\n    pre_order(root.right)`,
          cpp: `struct TreeNode {\n    int val;\n    TreeNode *left; TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\nvoid preOrder(TreeNode* root) {\n    if (root == nullptr) return;\n    std::cout << root->val << std::endl;\n    preOrder(root->left);\n    preOrder(root->right);\n}`
        }
      }
    ]
  },
  {
    id: 'heaps',
    name: 'Heaps / Priority Queue',
    difficulty: 'Medium',
    studyTime: '4-5 Hours',
    prerequisites: ['trees'],
    overview: 'A specialized tree-based structure that maintains the heap invariant: in a Min-Heap, the root element is always the minimum of the tree. Useful for priority queues.',
    theory: {
      coreConcepts: [
        'Implemented using normal arrays to save memory pointers. Parent(i) index corresponds to: `(i - 1) / 2`.',
        'Max Heaps: Peak elements consistently represent maximum values. Min Heaps represent minimum values.',
        'Heapify process balances tree invariants dynamically after insertions or extractions.'
      ],
      visualExplanation: 'Heap Array: [10, 20, 15, 30, 40] representing contiguous packed root-tree paths.',
      timeComplexity: {
        'Insert Element / Extract Min': 'O(log N)',
        'Read Minimum/Peak': 'O(1)',
        'Build Heap (Min-Heapify)': 'O(N)'
      },
      spaceComplexity: {
        'Auxiliary Array Memory Layout': 'O(N)'
      }
    },
    cheatSheet: {
      title: 'PQ / Heap Checklist',
      points: [
        'In Java, PriorityQueue is Min-Heap by default. Use Collections.reverseOrder() for a Max-Heap.',
        'Heaps do not enforce complete sorting; elements are sorted just enough to maintain the heap invariant at nodes.',
        'Use size K Heaps to solve Top-K query problems in O(N log K) instead of sorting.'
      ]
    },
    patterns: [
      {
        name: 'Min Heap Operations',
        description: 'Tracking and extracting the smallest items inside stream collections.',
        templates: {
          java: `import java.util.PriorityQueue;\npublic class TopK {\n    public int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int x : nums) {\n            pq.add(x);\n            if (pq.size() > k) pq.poll();\n        }\n        return pq.peek();\n    }\n}`,
          kotlin: `import java.util.PriorityQueue\nfun findKthLargest(nums: IntArray, k: Int): Int {\n    val pq = PriorityQueue<Int>()\n    for (x in nums) {\n        pq.add(x)\n        if (pq.size > k) pq.poll()\n    }\n    return pq.peek()\n}`,
          python: `import heapq\ndef find_kth_largest(nums, k):\n    return heapq.nlargest(k, nums)[-1]`,
          cpp: `#include <queue>\nint findKthLargest(const std::vector<int>& nums, int k) {\n    std::priority_queue<int, std::vector<int>, std::greater<int>> pq;\n    for (int x : nums) {\n        pq.push(x);\n        if (pq.size() > k) pq.pop();\n    }\n    return pq.top();\n}`
        }
      }
    ]
  },
  {
    id: 'graphs',
    name: 'Graphs (BFS / DFS)',
    difficulty: 'Hard',
    studyTime: '8-10 Hours',
    prerequisites: ['trees'],
    overview: 'Networks of vertices (nodes) linked together by edges. Can be directed vs undirected, weighted vs unweighted. Solved via BFS (shortest paths) or DFS.',
    theory: {
      coreConcepts: [
        'Representations: Adjacency List (dynamic vector arrays) vs Adjacency Matrix (static density grid).',
        'BFS: Traverses level-by-level queue style, guaranteed to identify shortest path in unweighted networks.',
        'DFS: Explores maximum tree depths recursively before backtracking, resolving cycles, connected structures, and topological markings.',
        'Dijkstra\'s algorithm: Solves single-source shortest paths on weighted networks in O(V + E log V). WARNING: Fails on lists containing negative weight edges.',
        'Bellman-Ford algorithm: Relaxes all edges V-1 times in O(V * E) to calculate paths even with negative edge weights. Can flag negative runtime loops.',
        'SPFA (Shortest Path Faster Algorithm): Evaluates Bellman-Ford paths dynamically using an explicit active relaxation queue.',
        'Floyd-Warshall algorithm: Solves all-pairs shortest paths in a tidy, simple triple loop layout taking O(V^3) time.',
        'Kruskal\'s MST: Identifies the Minimum Spanning Tree of a graph by sorting edges by weight and union-joining them using Union-Find to avoid loops.'
      ],
      visualExplanation: 'Relaxation: dist[v] = min(dist[v], dist[u] + weight). Shortest distances settle down row-by-row.',
      timeComplexity: {
        'BFS / DFS Traversal': 'O(V + E)',
        'Dijkstra Weighted Path': 'O((V + E) log V)',
        'Bellman-Ford Paths / SPFA': 'O(V * E)',
        'Floyd-Warshall All-Pairs': 'O(V^3)'
      },
      spaceComplexity: {
        'Adjacency lists structure': 'O(V + E)',
        'Floyd Matrix Storage': 'O(V^2)',
        'Visited node indicators': 'O(V)'
      }
    },
    cheatSheet: {
      title: 'Graph Study Reference',
      points: [
        'Dijkstra\'s algorithm is greedy! Do not use it if edges can have negative weights; implement Bellman-Ford instead to avoid infinite routing traps.',
        'Use the directions vector trick: `int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}}` to search cell neighbors on matrix grids without duplicating conditional branches.',
        'Always check for cycle presence in undirected graphs by validating if a newly encountered node is already visited and is not the direct parent.'
      ]
    },
    patterns: [
      {
        name: 'Dijkstra Template',
        description: 'Single-source shortest path template for weighted graphs.',
        templates: {
          java: `import java.util.*;\npublic class Dijkstra {\n    public int[] getShortestPaths(int src, List<List<int[]>> adj, int V) {\n        int[] dist = new int[V];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[src] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n        pq.add(new int[]{src, 0});\n        while(!pq.isEmpty()) {\n            int[] curr = pq.poll();\n            int u = curr[0], d = curr[1];\n            if (d > dist[u]) continue;\n            for (int[] edge : adj.get(u)) {\n                int v = edge[0], weight = edge[1];\n                if (dist[u] + weight < dist[v]) {\n                    dist[v] = dist[u] + weight;\n                    pq.add(new int[]{v, dist[v]});\n                }\n            }\n        }\n        return dist;\n    }\n}`,
          kotlin: `import java.util.PriorityQueue\nfun getShortestPaths(src: Int, adj: List<List<IntArray>>, V: Int): IntArray {\n    val dist = IntArray(V) { Int.MAX_VALUE }\n    dist[src] = 0\n    val pq = PriorityQueue<IntArray>(compareBy { it[1] })\n    pq.add(intArrayOf(src, 0))\n    while (!pq.isEmpty()) {\n        val curr = pq.poll()\n        val u = curr[0]; val d = curr[1]\n        if (d > dist[u]) continue\n        for (edge in adj[u]) {\n            val v = edge[0]; val weight = edge[1]\n            if (dist[u] + weight < dist[v]) {\n                dist[v] = dist[u] + weight\n                pq.add(intArrayOf(v, dist[v]))\n            }\n        }\n    }\n    return dist\n}`,
          python: `import heapq\ndef dijkstra(src, adj, V):\n    dist = [float('inf')] * V\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]:\n            continue\n        for v, weight in adj[u]:\n            if dist[u] + weight < dist[v]:\n                dist[v] = dist[u] + weight\n                heapq.heappush(pq, (dist[v], v))\n    return dist`,
          cpp: `#include <queue>\n#include <vector>\nstd::vector<int> dijkstra(int src, const std::vector<std::vector<std::pair<int, int>>>& adj, int V) {\n    std::vector<int> dist(V, 1e9);\n    dist[src] = 0;\n    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<std::pair<int, int>>> pq;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto& edge : adj[u]) {\n            int v = edge.first, weight = edge.second;\n            if (dist[u] + weight < dist[v]) {\n                dist[v] = dist[u] + weight;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}`
        }
      }
    ]
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    difficulty: 'Hard',
    studyTime: '12-15 Hours',
    prerequisites: ['trees', 'arrays'],
    overview: 'Algorithmic technique that solves complex problems by breaking them down into simpler sub-problems and caching their results to avoid redundant calculations.',
    theory: {
      coreConcepts: [
        'Optimal Substructure: The global optimal solution can be constructed from optimal sub-problem solutions.',
        'Overlapping Subproblems: Recursion visits the exact same sub-problem states repeatedly.',
        'Coin Problem (Min coins): Formula is solve(x) = min_{c in coins} (solve(x - c) + 1), choosing base cases solve(0)=0 and solve(x<0)=infinity.',
        'Counting Solutions (Coin Ways): Formula is count(x) = sum_{c in coins} count(x - c), tracking solutions sum modulo prime partitions.',
        'Paths in a Grid: Maximize gold collected walking from top-left to bottom-right using sum[y][x] = max(sum[y][x-1], sum[y-1][x]) + value[y][x].',
        'Longest Increasing Subsequence (LIS): Find length of longest ascending subarray sequence in O(N^2) via dynamic subsets or O(N log N) utilizing active binary search bounds.',
        'Edit Distance (Levenshtein): Compute minimal character insert/delete/substitute costs using DP state coordinates.',
        'Counting Tilings: Profile DP computing ways to paint an n x m grid with 1x2 and 2x1 tiles using binary bitmasks representation.'
      ],
      visualExplanation: 'Coin State: sum(10) -> choice {1,3,4} -> branches down to sum(9), sum(7), sum(6). Tabulation replaces recursive states in linear order.',
      timeComplexity: {
        'Coin Minimization Tabulation': 'O(N * C) where C is the number of coins',
        'Paths in a Grid DP': 'O(N * M) grid cells',
        'Longest Increasing Subsequence': 'O(N^2) dynamic or O(N log N) jump arrays',
        'Brute Force (No Cache)': 'O(2^N) or O(3^N) exponents'
      },
      spaceComplexity: {
        'Cache Memory Matrix': 'O(N * M) or O(N) states space',
        'Space Optimized Tabulation': 'O(N) row-buffers'
      }
    },
    cheatSheet: {
      title: 'Dynamic Programming Recipes',
      points: [
        'Base cases are fundamental: Initialize DP[0] = 0 or 1, and map invalid states to safely bounded values (e.g., Integer.MAX_VALUE - 1) to prevent math overflows.',
        'If the state transition DP[i] only looks back DP[i - 1], transition arrays can be flattened to a single sliding vector of size O(1) or O(W).',
        'Solve DP recursively with memoization if states are sparse; choose iteration bottom-up arrays if almost all nodes are visited for cache-friendly lookups.'
      ]
    },
    patterns: [
      {
        name: 'Coin Change Minimization',
        description: 'Compute the minimum coins required to form a target sum S using a given coin set relative to the Handbook.',
        templates: {
          java: `import java.util.Arrays;\npublic class CoinChange {\n    public int minCoins(int[] coins, int sum) {\n        int[] dp = new int[sum + 1];\n        Arrays.fill(dp, 1000000000); // Represent infinity safely\n        dp[0] = 0;\n        for (int i = 1; i <= sum; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) {\n                    dp[i] = Math.min(dp[i], dp[i - c] + 1);\n                }\n            }\n        }\n        return dp[sum] >= 1000000000 ? -1 : dp[sum];\n    }\n}`,
          kotlin: `fun minCoins(coins: IntArray, sum: Int): Int {\n    val dp = IntArray(sum + 1) { 1000000000 }\n    dp[0] = 0\n    for (i in 1..sum) {\n        for (c in coins) {\n            if (i - c >= 0) {\n                dp[i] = minOf(dp[i], dp[i - c] + 1)\n            }\n        }\n    }\n    return if (dp[sum] >= 1000000000) -1 else dp[sum]\n}`,
          python: `def min_coins(coins, sum_val):\n    dp = [float('inf')] * (sum_val + 1)\n    dp[0] = 0\n    for i in range(1, sum_val + 1):\n        for c in coins:\n            if i - c >= 0:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return -1 if dp[sum_val] == float('inf') else dp[sum_val]`,
          cpp: `#include <vector>\n#include <algorithm>\nint minCoins(const std::vector<int>& coins, int sum) { // Handbook Chapter 7.1 Coin Problem\n    std::vector<int> dp(sum + 1, 1e9);\n    dp[0] = 0;\n    for (int i = 1; i <= sum; i++) {\n        for (int c : coins) {\n            if (i - c >= 0) {\n                dp[i] = std::min(dp[i], dp[i - c] + 1);\n            }\n        }\n    }\n    return dp[sum] >= 1e9 ? -1 : dp[sum];\n}`
        }
      }
    ]
  },
  {
    id: 'lru-cache',
    name: 'LRU Cache',
    difficulty: 'Medium',
    studyTime: '2-3 Hours',
    prerequisites: ['linked-lists', 'hashing'],
    overview: 'Design a self-contained data container that evicts the oldest elements when capacity is exceeded.',
    theory: {
      coreConcepts: [
        'Leverages a Hash Map for O(1) key-node lookups.',
        'Uses a Doubly Linked List to maintain access order. Newly accessed items are moved to the head, and items at the tail are evicted when full.'
      ],
      visualExplanation: '[HashMap Lookups] ---> Node (Doubly Linked) <-> Node (Doubly Linked) <-> Least Recently Used',
      timeComplexity: {
        'Get cached key': 'O(1)',
        'Put key-value': 'O(1)'
      },
      spaceComplexity: {
        'Cache size limit allocation': 'O(Capacity)'
      }
    },
    cheatSheet: {
      title: 'LRU Design Notes',
      points: [
        'Pointers must be carefully swapped. Maintain helper functions like `removeNode()` and `addToHead()`.',
        'When putting an existing key, remember to update its value and move its node to the head of the list.',
        'Confirm cache capacity boundary cases, specifically size 1 collections.'
      ]
    },
    patterns: [
      {
        name: 'LRU Cache Template',
        description: 'Complete O(1) implementation using Hashmap and custom Doubly Linked List nodes.',
        templates: {
          java: `import java.util.HashMap;\npublic class LRUCache {\n    class Node { int key, value; Node prev, next; }\n    private final int capacity;\n    private final HashMap<Integer, Node> map = new HashMap<>();\n    private Node head, tail;\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        head = new Node(); tail = new Node();\n        head.next = tail; tail.prev = head;\n    }\n\n    public int get(int key) {\n        Node node = map.get(key);\n        if (node == null) return -1;\n        moveToHead(node);\n        return node.value;\n    }\n\n    public void put(int key, int value) {\n        Node node = map.get(key);\n        if (node != null) {\n            node.value = value;\n            moveToHead(node);\n        } else {\n            if (map.size() >= capacity) {\n                map.remove(tail.prev.key);\n                removeNode(tail.prev);\n            }\n            Node newNode = new Node();\n            newNode.key = key; newNode.value = value;\n            map.put(key, newNode);\n            addNode(newNode);\n        }\n    }\n    private void addNode(Node node) {\n        node.next = head.next; node.prev = head;\n        head.next.prev = node; head.next = node;\n    }\n    private void removeNode(Node node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n    private void moveToHead(Node node) { removeNode(node); addNode(node); }\n}`,
          kotlin: `import java.util.HashMap\nclass LRUCache(private val capacity: Int) {\n    class Node(var key: Int = 0, var value: Int = 0) {\n        var prev: Node? = null\n        var next: Node? = null\n    }\n    private val map = HashMap<Int, Node>()\n    private val head = Node(); private val tail = Node()\n    init {\n        head.next = tail; tail.prev = head\n    }\n    fun get(key: Int): Int {\n        val node = map[key] ?: return -1\n        moveToHead(node)\n        return node.value\n    }\n    fun put(key: Int, value: Int) {\n        val node = map[key]\n        if (node != null) {\n            node.value = value\n            moveToHead(node)\n        } else {\n            if (map.size >= capacity) {\n                map.remove(tail.prev!!.key)\n                removeNode(tail.prev!!)\n            }\n            val newNode = Node(key, value)\n            map[key] = newNode\n            addNode(newNode)\n        }\n    }\n    private fun addNode(node: Node) {\n        node.next = head.next\n        node.prev = head\n        head.next!!.prev = node\n        head.next = node\n    }\n    private fun removeNode(node: Node) {\n        node.prev!!.next = node.next\n        node.next!!.prev = node.prev\n    }\n    private fun moveToHead(node: Node) { removeNode(node); addNode(node) }\n}`,
          python: `class Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.map = {}\n        self.head = Node()\n        self.tail = Node()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def get(self, key: int) -> int:\n        if key in self.map:\n            node = self.map[key]\n            self._remove(node)\n            self._add(node)\n            return node.val\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.map:\n            self._remove(self.map[key])\n        node = Node(key, value)\n        self._add(node)\n        self.map[key] = node\n        if len(self.map) > self.capacity:\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.map[lru.key]\n\n    def _remove(self, node):\n        p = node.prev\n        n = node.next\n        p.next = n\n        n.prev = p\n\n    def _add(self, node):\n        h = self.head.next\n        self.head.next = node\n        node.prev = self.head\n        node.next = h\n        h.prev = node`,
          cpp: `#include <unordered_map>\nclass LRUCache {\n    struct Node {\n        int key, val;\n        Node *prev, *next;\n        Node(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}\n    };\n    int cap;\n    std::unordered_map<int, Node*> map;\n    Node *head, *tail;\npublic:\n    LRUCache(int capacity) : cap(capacity) {\n        head = new Node(-1, -1); tail = new Node(-1, -1);\n        head->next = tail; tail->prev = head;\n    }\n    int get(int key) {\n        if (map.find(key) == map.end()) return -1;\n        Node* n = map[key];\n        remove(n); add(n);\n        return n->val;\n    }\n    void put(int key, int value) {\n        if (map.find(key) != map.end()) {\n            remove(map[key]);\n        }\n        Node* n = new Node(key, value);\n        add(n); map[key] = n;\n        if (map.size() > cap) {\n            Node* lru = tail->prev;\n            remove(lru);\n            map.erase(lru->key);\n            delete lru;\n        }\n    }\nprivate:\n    void remove(Node* n) {\n        n->prev->next = n->next;\n        n->next->prev = n->prev;\n    }\n    void add(Node* n) {\n        Node* h = head->next;\n        head->next = n;\n        n->prev = head;\n        n->next = h;\n        h->prev = n;\n    }\n};`
        }
      }
    ]
  },
  {
    id: 'trie',
    name: 'Trie',
    difficulty: 'Medium',
    studyTime: '3-4 Hours',
    prerequisites: ['trees'],
    overview: 'An advanced search tree (Prefix Tree) optimized for matching and resolving continuous alphabet arrays.',
    theory: {
      coreConcepts: [
        'Used for autocompletion, spell check, and searching strings in large dictionaries.',
        'Each node has up to 26 pointers, one for each English letter, and a boolean flag indicating if the node marks the end of a valid word.',
        'Highly efficient: query times depend on the prefix size, not on the total number of words in the dictionary.'
      ],
      visualExplanation: ' Root \n  /  \\ \n [a]  [b] ---> [a] ---> [t] (Marks "bat" as a valid word)',
      timeComplexity: {
        'Insert word of length K': 'O(K)',
        'Check prefix word': 'O(K)'
      },
      spaceComplexity: {
        'Worse Node allocation complexity': 'O(Words * Alphabet Size)'
      }
    },
    cheatSheet: {
      title: 'Trie Cheat Card',
      points: [
        'Convert characters instantly to indices using: `char - \'a\'`.',
        'Can be optimized using dynamic Hash Maps inside Nodes instead of static arrays for sparse dictionaries.',
        'A Trie can also be searched backwards (Suffix Tree) to solve wildcard suffix problems.'
      ]
    },
    patterns: [
      {
        name: 'Trie Word Verification',
        description: 'Standard tree insertion, word matching, and prefix query templates.',
        templates: {
          java: `public class Trie {\n    class TrieNode {\n        TrieNode[] children = new TrieNode[26];\n        boolean isEndOfWord = false;\n    }\n    private final TrieNode root = new TrieNode();\n\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();\n            curr = curr.children[idx];\n        }\n        curr.isEndOfWord = true;\n    }\n\n    public boolean search(String word) {\n        TrieNode node = find(word);\n        return node != null && node.isEndOfWord;\n    }\n\n    public boolean startsWith(String prefix) {\n        return find(prefix) != null;\n    }\n\n    private TrieNode find(String s) {\n        TrieNode curr = root;\n        for (char c : s.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) return null;\n            curr = curr.children[idx];\n        }\n        return curr;\n    }\n}`,
          kotlin: `class Trie {\n    class TrieNode {\n        val children = arrayOfNulls<TrieNode>(26)\n        var isEndOfWord = false\n    }\n    private val root = TrieNode()\n    fun insert(word: String) {\n        var curr = root\n        for (c in word) {\n            val idx = c - 'a'\n            if (curr.children[idx] == null) curr.children[idx] = TrieNode()\n            curr = curr.children[idx]!!\n        }\n        curr.isEndOfWord = true\n    }\n    fun search(word: String): Boolean {\n        val node = find(word)\n        return node != null && node.isEndOfWord\n    }\n    fun startsWith(prefix: String): Boolean {\n        return find(prefix) != null\n    }\n    private fun find(s: String): TrieNode? {\n        var curr = root\n        for (c in s) {\n            val idx = c - 'a'\n            curr = curr.children[idx] ?: return null\n        }\n        return curr\n    }\n}`,
          python: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str):\n        curr = self.root\n        for c in word:\n            if c not in curr.children:\n                curr.children[c] = TrieNode()\n            curr = curr.children[c]\n        curr.is_word = True\n\n    def search(self, word: str) -> bool:\n        curr = self.root\n        for c in word:\n            if c not in curr.children: return False\n            curr = curr.children[c]\n        return curr.is_word`,
          cpp: `#include <string>\nclass Trie {\n    struct TrieNode {\n        TrieNode* children[26] = {nullptr};\n        bool isWord = false;\n    };\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n    void insert(std::string word) {\n        TrieNode* curr = root;\n        for (char c : word) {\n            int idx = c - 'a';\n            if (!curr->children[idx]) curr->children[idx] = new TrieNode();\n            curr = curr->children[idx];\n        }\n        curr->isWord = true;\n    }\n    bool search(std::string word) {\n        TrieNode* curr = root;\n        for (char c : word) {\n            int idx = c - 'a';\n            if (!curr->children[idx]) return false;\n            curr = curr->children[idx];\n        }\n        return curr && curr->isWord;\n    }\n};`
        }
      }
    ]
  },
  {
    id: 'union-find',
    name: 'Union Find (Disjoint Set)',
    difficulty: 'Medium',
    studyTime: '3-4 Hours',
    prerequisites: ['graphs'],
    overview: 'Allows checking connection connectivity across dynamic sets of nodes efficiently. Implemented using path compression and union by rank.',
    theory: {
      coreConcepts: [
        'Useful for cycle detection, finding connected components, and Kruskal\'s MST algorithm.',
        'Path Compression: Point child nodes directly to root parents during search queries to flatten tree depth.',
        'Union by Rank: Align lower rank root trees under larger rank root structures to maintain balance.'
      ],
      visualExplanation: '[Parent A] <--- [Node B] <--- [Node C]   ====Flattening union path===>   [Parent A] <=== [Node C]',
      timeComplexity: {
        'Find Representative Set': 'O(alpha(N)) near constant time',
        'Union sets representative': 'O(alpha(N)) near constant time'
      },
      spaceComplexity: {
        'Parent index tracking array': 'O(N)'
      }
    },
    cheatSheet: {
      title: 'Disjoint Set Study Guide',
      points: [
        'alpha(N) represents the Inverse Ackermann function—it grows so slowly it stays below 5 for all practical inputs.',
        'Without path compression and union by rank, operations degrade to linear O(N) search.',
        'Useful for checking cycles in undirected graphs as you process edges one by one.'
      ]
    },
    patterns: [
      {
        name: 'Union Find Template',
        description: 'Complete union find template with union by rank and path compression.',
        templates: {
          java: `public class UnionFind {\n    private final int[] parent;\n    private final int[] rank;\n\n    public UnionFind(int size) {\n        parent = new int[size];\n        rank = new int[size];\n        for (int i = 0; i < size; i++) {\n            parent[i] = i;\n            rank[i] = 0;\n        }\n    }\n\n    public int find(int i) {\n        if (parent[i] == i) return i;\n        return parent[i] = find(parent[i]); // Path compression\n    }\n\n    public boolean union(int i, int j) {\n        int rootI = find(i);\n        int rootJ = find(j);\n        if (rootI != rootJ) {\n            if (rank[rootI] < rank[rootJ]) {\n                parent[rootI] = rootJ;\n            } else if (rank[rootI] > rank[rootJ]) {\n                parent[rootJ] = rootI;\n            } else {\n                parent[rootJ] = rootI;\n                rank[rootI]++;\n            }\n            return true;\n        }\n        return false; // Already in same set (indicates cycle if they were unconnected)\n    }\n}`,
          kotlin: `class UnionFind(size: Int) {\n    private val parent = IntArray(size) { it }\n    private val rank = IntArray(size) { 0 }\n    fun find(i: Int): Int {\n        if (parent[i] == i) return i\n        parent[i] = find(parent[i]) // Path compression\n        return parent[i]\n    }\n    fun union(i: Int, j: Int): Boolean {\n        val rootI = find(i)\n        val rootJ = find(j)\n        if (rootI != rootJ) {\n            if (rank[rootI] < rank[rootJ]) {\n                parent[rootI] = rootJ\n            } else if (rank[rootI] > rank[rootJ]) {\n                parent[rootJ] = rootI\n            } else {\n                parent[rootJ] = rootI\n                rank[rootI]++\n            }\n            return true\n        }\n        return false\n    }\n}`,
          python: `class UnionFind:\n    def __init__(self, size):\n        self.parent = list(range(size))\n        self.rank = [0] * size\n\n    def find(self, i):\n        if self.parent[i] == i: return i\n        self.parent[i] = self.find(self.parent[i])\n        return self.parent[i]\n\n    def union(self, i, j):\n        root_i = self.find(i)\n        root_j = self.find(j)\n        if root_i != root_j:\n            if self.rank[root_i] < self.rank[root_j]:\n                self.parent[root_i] = root_j\n            elif self.rank[root_i] > self.rank[root_j]:\n                self.parent[root_j] = root_i\n            else:\n                self.parent[root_j] = root_i\n                self.rank[root_i] += 1\n            return True\n        return False`,
          cpp: `#include <vector>\nclass UnionFind {\n    std::vector<int> parent, rank;\npublic:\n    UnionFind(int size) {\n        parent.resize(size);\n        rank.assign(size, 0);\n        for (int i = 0; i < size; i++) parent[i] = i;\n    }\n    int find(int i) {\n        if (parent[i] == i) return i;\n        return parent[i] = find(parent[i]);\n    }\n    bool unionSet(int i, int j) {\n        int rootI = find(i);\n        int rootJ = find(j);\n        if (rootI != rootJ) {\n            if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;\n            else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;\n            else {\n                parent[rootJ] = rootI;\n                rank[rootI]++;\n            }\n            return true;\n        }\n        return false;\n    }\n};`
        }
      }
    ]
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    difficulty: 'Medium',
    studyTime: '4-5 Hours',
    prerequisites: ['arrays'],
    overview: 'Greedy algorithms construct solutions by making locally optimal choices at each step, with the expectation of finding a global optimum. They never backtrack.',
    theory: {
      coreConcepts: [
        'Greedy Choice Property: A global optimal solution can be reached by making local, immediate optimal choices.',
        'No Backtracking: Once a greedy choice is made, it is permanent and is never reversed.',
        'Common applications: Interval scheduling (sort by end times), Huffman coding, and Minimum Spanning Trees (Kruskal & Prim).'
      ],
      visualExplanation: 'Local Choice A -> Local Choice B -> Local Choice C (Builds Global Path)',
      timeComplexity: {
        'Activity Sorting (Typical)': 'O(N log N)',
        'Decision Traversal Step': 'O(N)',
        'Extremities Updates': 'O(1)'
      },
      spaceComplexity: {
        'In-place Sort Arrays': 'O(1) auxiliary',
        'Huffman Node Allocations': 'O(N)'
      }
    },
    cheatSheet: {
      title: 'Greedy Strategy Study Card',
      points: [
        'Always try grouping and ordering inputs to see if a sorting criterion (e.g. earliest end time, lowest weights ratio) satisfies global correctness.',
        'Beware: Greedy algorithms do not always work! For example, Euro coin systems resolve optimally using greedy choice, but {1, 3, 4} change for 6 fails.',
        'Proof techniques: Rely on "Greedy stays ahead" or "Exchange arguments" to mathematically justify why greedy choice preserves optimality.'
      ]
    },
    patterns: [
      {
        name: 'Interval Scheduling',
        description: 'Sort activities by their ending times. Keep a track pointer of the last chosen event expiration, greedily selecting next ones starting after that end.',
        templates: {
          java: `import java.util.*;\npublic class IntervalScheduling {\n    public int maxActivities(int[][] intervals) {\n        Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));\n        int count = 0, lastEnd = -1;\n        for (int[] interval : intervals) {\n            if (interval[0] >= lastEnd) {\n                count++;\n                lastEnd = interval[1];\n            }\n        }\n        return count;\n    }\n}`,
          kotlin: `import java.util.Arrays\nfun maxActivities(intervals: Array<IntArray>): Int {\n    intervals.sortBy { it[1] }\n    var count = 0\n    var lastEnd = -1\n    for (interval in intervals) {\n        if (interval[0] >= lastEnd) {\n            count++\n            lastEnd = interval[1]\n        }\n    }\n    return count\n}`,
          python: `def max_activities(intervals):\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    last_end = -1\n    for start, end in intervals:\n        if start >= last_end:\n            count += 1\n            last_end = end\n    return count`,
          cpp: `#include <vector>\n#include <algorithm>\nint maxActivities(std::vector<std::pair<int, int>>& intervals) {\n    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {\n        return a.second < b.second;\n    });\n    int count = 0, lastEnd = -1;\n    for (const auto& interval : intervals) {\n        if (interval.first >= lastEnd) {\n            count++;\n            lastEnd = interval.second;\n        }\n    }\n    return count;\n}`
        }
      }
    ]
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    difficulty: 'Medium',
    studyTime: '3-4 Hours',
    prerequisites: ['arrays'],
    overview: 'Operations at the binary word level. Integers are represented under Two\'s complement, and bit operators act directly in O(1) clock cycles to save memory masks.',
    theory: {
      coreConcepts: [
        'Operations: AND (&), OR (|), XOR (^), NOT (~), and bit shifts (<<, >>).',
        'XOR identities: x ^ x = 0, and x ^ 0 = x. Unique for tracking isolated duplicates.',
        'Lowest Set Bit: The logic expression x & (x - 1) clears the rightmost active 1 bit, checking powers of 2.'
      ],
      visualExplanation: 'Decimal 43 = 00101011 (Binary) -> Shift left 1 (43 << 1) = 01010110 (86)',
      timeComplexity: {
        'Bitwise AND / OR / XOR': 'O(1)',
        'Bit shifts (<< / >>)': 'O(1)',
        'Built-in popcount / clz': 'O(1)'
      },
      spaceComplexity: {
        'Auxiliary Integer Masks': 'O(1)',
        'State subsets storage': 'O(1) under compact bitmasks'
      }
    },
    cheatSheet: {
      title: 'Bit Manipulation Cheat Card',
      points: [
        'Verify power of two: (x > 0) && ((x & (x - 1)) == 0). It ensures exactly one bit is set.',
        'Accessing k-th bit: (x & (1 << k)) != 0. To set, use x | (1 << k). To clear, use x & ~(1 << k).',
        'A single integer bitmask can represent elements membership in subsets up to size 31/63 securely.'
      ]
    },
    patterns: [
      {
        name: 'Single Number Finder',
        description: 'Using XOR properties to spot non-duplicated single numbers over double arrays seamlessly in linear time with zero space.',
        templates: {
          java: `public class SingleNumber {\n    public int findSingle(int[] nums) {\n        int res = 0;\n        for (int x : nums) res ^= x;\n        return res;\n    }\n}`,
          kotlin: `fun findSingle(nums: IntArray): Int {\n    var res = 0\n    for (x in nums) res = res xor x\n    return res\n}`,
          python: `def find_single(nums):\n    res = 0\n    for x in nums:\n        res ^= x\n    return res`,
          cpp: `#include <vector>\nint findSingle(const std::vector<int>& nums) {\n    int res = 0;\n    for (int x : nums) res ^= x;\n    return res;\n}`
        }
      }
    ]
  },
  {
    id: 'number-theory',
    name: 'Number Theory',
    difficulty: 'Medium',
    studyTime: '4-5 Hours',
    prerequisites: ['arrays'],
    overview: 'Studies properties and algorithms of integers, specializing in prime factorization, modular arithmetic, greatest common divisors, and Fermat\'s Little Theorem.',
    theory: {
      coreConcepts: [
        'Primality Testing: Check non-primes up to sqrt(N) only, or compute primes up to N via Sieve of Eratosthenes.',
        'Euclid\'s GCD: Recursive modular algorithm resolving standard greatest common divisors in logarithmic O(log N).',
        'Modular Multiplicative Inverse: Calculate inverse ratios a / b mod m cleanly using base powers modpow matching Fermat\'s Little Theorem: b^(m-2) mod m.'
      ],
      visualExplanation: 'GCD(24, 30) = GCD(30, 24) = GCD(24, 6) = GCD(6, 0) => 6',
      timeComplexity: {
        'GCD / LCM queries': 'O(log(min(A, B)))',
        'Modular Power / Inverse': 'O(log N)',
        'Sieve precomputation': 'O(N log log N)'
      },
      spaceComplexity: {
        'GCD Stack Frames': 'O(log N)',
        'Sieve prime lookup array': 'O(N)'
      }
    },
    cheatSheet: {
      title: 'Integer Arithmetic Quick Hacks',
      points: [
        'Keep calculations safe from modulo overflows: (a * b) % m = ((a % m) * (b % m)) % m.',
        'To find least common multiples cleanly, multiply and divide by GCD: lcm(a, b) = (a / gcd(a, b)) * b.',
        'Division is NOT allowed directly inside modulo spaces! Convert division modulo m to multiplication by modular inverse.'
      ]
    },
    patterns: [
      {
        name: 'Modular Exponentiation',
        description: 'Binary Exponentiation performing logarithmic modulo powering to prevent common numeric variable limits overflow.',
        templates: {
          java: `public class ModPow {\n    public long power(long base, long exp, long mod) {\n        long res = 1;\n        base %= mod;\n        while (exp > 0) {\n            if (exp % 2 == 1) res = (res * base) % mod;\n            base = (base * base) % mod;\n            exp /= 2;\n        }\n        return res;\n    }\n}`,
          kotlin: `fun power(baseVal: Long, expVal: Long, mod: Long): Long {\n    var res = 1L\n    var base = baseVal % mod\n    var exp = expVal\n    while (exp > 0) {\n        if (exp % 2 == 1L) res = (res * base) % mod\n        base = (base * base) % mod\n        exp /= 2\n    }\n    return res\n}`,
          python: `def power(base, exp, mod):\n    res = 1\n    base %= mod\n    while exp > 0:\n        if exp % 2 == 1:\n            res = (res * base) % mod\n        base = (base * base) % mod\n        exp //= 2\n    return res`,
          cpp: `long long power(long long base, long long exp, long long mod) {\n    long long res = 1;\n    base %= mod;\n    while (exp > 0) {\n        if (exp % 2 == 1) res = (res * base) % mod;\n        base = (base * base) % mod;\n        exp /= 2;\n    }\n    return res;\n}`
        }
      }
    ]
  }
];

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, FastForward, Info, Terminal, Sparkles, CheckCircle } from 'lucide-react';

interface ExplainerStep {
  text: string;
  subtitle: string;
  visualData: any;
}

interface TopicExplainer {
  title: string;
  overview: string;
  useCases: string[];
  cppCode: string;
  steps: ExplainerStep[];
}

interface AnimatedVideoExplainerProps {
  topicId: string;
}

// Full video metadata & interactive steps for all 16 topics
const EXPLAINER_DATA: Record<string, TopicExplainer> = {
  arrays: {
    title: 'Arrays Contiguous Shift',
    overview: 'How insertion and element shifting works inside dynamic arrays in memory.',
    useCases: [
      'Sequential storage where fast index lookup O(1) is paramount.',
      'Storing dense matrix mappings and flat look-up tables.',
      'Low-level hardware buffers and stream processing.'
    ],
    cppCode: `#include <iostream>
#include <vector>

int main() {
    // 1. Initial contiguous vector
    std::vector<int> arr = {10, 20, 30, 40, 50};
    
    // 2. Inserting 99 at index 2 triggers shift
    // O(N) complexity due to backward shifting
    arr.insert(arr.begin() + 2, 99); 
    
    // Output: 10 20 99 30 40 50
    for(int x : arr) {
        std::cout << x << " ";
    }
    return 0;
}`,
    steps: [
      {
        text: 'Initial Array in memory. Memory is contiguous meaning slots are placed directly next to each other.',
        subtitle: 'Our array: [10, 20, 30, 40, 50]. Indices: 0 to 4.',
        visualData: { arr: [10, 20, 30, 40, 50], focusIndices: [], highlightText: 'Contiguous Memory Block', arrow: null }
      },
      {
        text: 'Goal: Insert 99 at Index 2. First, we need to shift the last element at index 4 (50) to the right.',
        subtitle: 'Index 4 is copied to Index 5 to make room.',
        visualData: { arr: [10, 20, 30, 40, 50, 50], focusIndices: [4, 5], highlightText: 'Shift 50 to Index 5', arrow: { from: 4, to: 5 } }
      },
      {
        text: 'Next, we shift the element at index 3 (40) to index 4.',
        subtitle: 'Freeing up index 3.',
        visualData: { arr: [10, 20, 30, 40, 40, 50], focusIndices: [3, 4], highlightText: 'Shift 40 to Index 4', arrow: { from: 3, to: 4 } }
      },
      {
        text: 'Now, we shift the element at index 2 (30) to index 3.',
        subtitle: 'Freeing up index 2.',
        visualData: { arr: [10, 20, 30, 30, 40, 50], focusIndices: [2, 3], highlightText: 'Shift 30 to Index 3', arrow: { from: 2, to: 3 } }
      },
      {
        text: 'Index 2 is now vacant! We overwrite it with our new value: 99.',
        subtitle: 'Insertion is now complete.',
        visualData: { arr: [10, 20, 99, 30, 40, 50], focusIndices: [2], highlightText: 'Write 99 at Index 2', arrow: null }
      },
      {
        text: 'Process Complete! The elements index 2 to 5 have successfully shifted. Complexity: O(N) because elements had to slide.',
        subtitle: 'C++ vector::insert behaves exactly like this under-the-hood!',
        visualData: { arr: [10, 20, 99, 30, 40, 50], focusIndices: [2], highlightText: 'Completed Array O(N)', arrow: null }
      }
    ]
  },
  hashing: {
    title: 'Hash Collisions & Chaining',
    overview: 'Understanding hash mapping, collisions, and resolution via separate linked list chaining.',
    useCases: [
      'Building ultra-fast memory registries.',
      'Caching mechanisms like Redis keys and sessions.',
      'Identifying duplicate resources in linear constant time.'
    ],
    cppCode: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    // std::unordered_map uses a hash table
    std::unordered_map<std::string, int> ages;
    
    // Average query time: O(1)
    ages["Mary"] = 25;
    ages["Bob"] = 32;
    
    std::cout << "Mary age: " << ages["Mary"] << "\\n";
    return 0;
}`,
    steps: [
      {
        text: 'We have an empty Hash Table with 5 buckets (Index 0 to 4). Let\'s insert ("Mary", 25).',
        subtitle: 'Hash table size = 5.',
        visualData: { buckets: [[], [], [], [], []], activeKey: '"Mary"', stepAction: 'init' }
      },
      {
        text: 'We calculate Index: hash("Mary") = 17. 17 % 5 = Index 2. Let\'s place "Mary" in bucket 2.',
        subtitle: 'Index = Hash % size = 17 % 5 = 2.',
        visualData: { buckets: [[], [], [{ k: 'Mary', v: 25 }], [], []], activeKey: '"Mary"', focusBucket: 2, stepAction: 'insert' }
      },
      {
        text: 'Now, let\'s insert ("Bob", 32). Running hash function: hash("Bob") = 12. 12 % 5 = Index 2.',
        subtitle: 'Indices are identical! A Hash Collision occurs at Index 2.',
        visualData: { buckets: [[], [], [{ k: 'Mary', v: 25 }], [], []], activeKey: '"Bob"', focusBucket: 2, stepAction: 'collision' }
      },
      {
        text: 'To resolve the collision, we use separate chaining. We append ("Bob", 32) as a linked node in bucket 2.',
        subtitle: 'Bucket 2 now forms a linked chain: Mary -> Bob.',
        visualData: { buckets: [[], [], [{ k: 'Mary', v: 25 }, { k: 'Bob', v: 32 }], [], []], activeKey: '"Bob"', focusBucket: 2, stepAction: 'chain' }
      },
      {
        text: 'Lookup query for "Bob" takes O(1) on average. Go directly to bucket 2 and check nodes in sequence.',
        subtitle: 'If buckets contain many nodes, lookup approaches O(N) worst case. C++ std::unordered_map handles resizing automatically.',
        visualData: { buckets: [[], [], [{ k: 'Mary', v: 25 }, { k: 'Bob', v: 32 }], [], []], activeKey: null, focusBucket: 2, stepAction: 'done' }
      }
    ]
  },
  'two-pointers': {
    title: 'Two Pointers Search',
    overview: 'Scanning sorted collection from ends to identify elements matching a criteria in linear time.',
    useCases: [
      'Finding pair values matching target sum in sorted collection.',
      'Fast in-place array reversing/swappings.',
      'Checking valid palindrome string conditions.'
    ],
    cppCode: `#include <iostream>
#include <vector>

bool hasTargetSum(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true; // Found!
        else if (sum < target) left++;  // Make sum bigger
        else right--;                   // Make sum smaller
    }
    return false;
}`,
    steps: [
      {
        text: 'We have a sorted array and target sum = 12. We initialize Left pointer at index 0 and Right pointer at end.',
        subtitle: 'Sorted array: [1, 2, 4, 6, 8, 9]. Target: 12.',
        visualData: { arr: [1, 2, 4, 6, 8, 9], left: 0, right: 5, sum: 10, matched: false }
      },
      {
        text: 'Calculate sum: arr[0] + arr[5] = 1 + 9 = 10. Since 10 is < 12, we must increase the sum.',
        subtitle: 'To increase the sum on a sorted array, we move the Left pointer forward.',
        visualData: { arr: [1, 2, 4, 6, 8, 9], left: 1, right: 5, sum: 11, matched: false, move: 'left' }
      },
      {
        text: 'Next sum: arr[1] + arr[5] = 2 + 9 = 11. Sum 11 is still < 12. Left pointer advances again.',
        subtitle: 'Left pointer advances to index 2.',
        visualData: { arr: [1, 2, 4, 6, 8, 9], left: 2, right: 5, sum: 13, matched: false, move: 'left' }
      },
      {
        text: 'Next sum: arr[2] + arr[5] = 4 + 9 = 13. Since 13 is > 12, the sum is too large. We need a smaller value.',
        subtitle: 'To decrease sum, we move the Right pointer backward.',
        visualData: { arr: [1, 2, 4, 6, 8, 9], left: 2, right: 4, sum: 12, matched: false, move: 'right' }
      },
      {
        text: 'Next sum: arr[2] + arr[4] = 4 + 8 = 12. Target found!',
        subtitle: 'Indices 2 and 4 provide target sum 12. Complexity: O(N) time, O(1) space!',
        visualData: { arr: [1, 2, 4, 6, 8, 9], left: 2, right: 4, sum: 12, matched: true, move: 'none' }
      }
    ]
  },
  'sliding-window': {
    title: 'Sliding Window',
    overview: 'Maintaining an active interval window over sequence to eliminate reduntant sums.',
    useCases: [
      'Tracking continuous maximum sum subarrays of size K.',
      'Calculating running network bandwidth averages.',
      'Locating substrings inside long documents.'
    ],
    cppCode: `#include <iostream>
#include <vector>
#include <algorithm>

int maxKSubarray(const std::vector<int>& arr, int k) {
    int window_sum = 0;
    // Calculate initial window sum
    for(int i = 0; i < k; ++i) window_sum += arr[i];
    
    int max_sum = window_sum;
    for(size_t i = k; i < arr.size(); ++i) {
        window_sum += arr[i] - arr[i - k]; // Slide
        max_sum = std::max(max_sum, window_sum);
    }
    return max_sum;
}`,
    steps: [
      {
        text: 'We want to find the maximum sum of K=3 contiguous elements in: [2, 1, 5, 1, 3, 2].',
        subtitle: 'We begin by computing the sum of the first window.',
        visualData: { arr: [2, 1, 5, 1, 3, 2], wStart: 0, wEnd: 2, sum: 8, max: 8 }
      },
      {
        text: 'To slide the window right, we subtract the exiting element (2, left) and add the entering element (1, right).',
        subtitle: 'Window sliding: New sum = 8 - 2 + 1 = 7.',
        visualData: { arr: [2, 1, 5, 1, 3, 2], wStart: 1, wEnd: 3, sum: 7, max: 8 }
      },
      {
        text: 'We slide the window right again. Subtract the exiting element (1) and add entering (3).',
        subtitle: 'New sum = 7 - 1 + 3 = 9. Since 9 > 8, max sum updates to 9!',
        visualData: { arr: [2, 1, 5, 1, 3, 2], wStart: 2, wEnd: 4, sum: 9, max: 9 }
      },
      {
        text: 'Slide window right again. Subtract exiting element (5) and add entering (2).',
        subtitle: 'New sum = 9 - 5 + 2 = 6. Max sum remains 9.',
        visualData: { arr: [2, 1, 5, 1, 3, 2], wStart: 3, wEnd: 5, sum: 6, max: 9 }
      },
      {
        text: 'All variables processed! The sliding window successfully computed max continuous sum = 9 in O(N).',
        subtitle: 'Sliding window avoids nested loops completely!',
        visualData: { arr: [2, 1, 5, 1, 3, 2], wStart: null, wEnd: null, sum: null, max: 9 }
      }
    ]
  },
  'binary-search': {
    title: 'Binary Search',
    overview: 'Divide-and-conquer strategy repeatedly cutting search boundaries half-by-half on sorted lists.',
    useCases: [
      'Instantly searching specific registers in massive tables.',
      'Checking if code builds are broken across histories (git bisect).',
      'Monotonic decision helper constraints optimizer.'
    ],
    cppCode: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}`,
    steps: [
      {
        text: 'Let\'s search for target 23 in sorted array. We initialize boundaries: Low at index 0, High at index 8.',
        subtitle: 'Array: [2, 5, 8, 12, 16, 23, 38, 56, 72]. Low = 0, High = 8.',
        visualData: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], low: 0, high: 8, mid: null, status: 'init' }
      },
      {
        text: 'Calculate Mid index: mid = (Low + High) / 2 = (0+8)/2 = Index 4. The midpoint value is 16.',
        subtitle: 'Compare: 16 < 23. This means 23 must reside in the right partition.',
        visualData: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], low: 0, high: 8, mid: 4, status: 'too_small' }
      },
      {
        text: 'We dismiss the left partition by setting Low = Mid + 1 = 5. High stays 8.',
        subtitle: 'Active search range resides between Index 5 and 8.',
        visualData: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], low: 5, high: 8, mid: null, status: 'shift_right' }
      },
      {
        text: 'Calculate new Mid index: (5+8)/2 = Index 6. Midpoint value is 38.',
        subtitle: 'Compare: 38 > 23. This means 23 must reside in the left partition.',
        visualData: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], low: 5, high: 8, mid: 6, status: 'too_big' }
      },
      {
        text: 'We dismiss the right partition by setting High = Mid - 1 = 5. Low stays 5.',
        subtitle: 'Focus search range is now narrowed strictly to Index 5.',
        visualData: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], low: 5, high: 5, mid: null, status: 'shift_left' }
      },
      {
        text: 'Calculate final Mid: (5+5)/2 = Index 5. Value is 23.',
        subtitle: 'Compare: 23 == 23. Target is found at Index 5 in just 3 steps!',
        visualData: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], low: 5, high: 5, mid: 5, status: 'found' }
      }
    ]
  },
  'linked-lists': {
    title: 'Linked List Reversal',
    overview: 'Reorienting edge pointer indicators linearly in single traversal scans without memory duplications.',
    useCases: [
      'Reorienting dynamic navigation streams dynamically.',
      'Reversing track histories and sequential playlists.',
      'Backwards traversals on forward-linked graph paths.'
    ],
    cppCode: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextNode = curr->next; // Cache
        curr->next = prev;               // Reverse
        prev = curr;                     // Move forward
        curr = nextNode;
    }
    return prev; // New head
}`,
    steps: [
      {
        text: 'We want to reverse a linked list: [A] -> [B] -> [C] -> null. Pointers are initialized with prev = null, curr = A.',
        subtitle: 'Head starts at A.',
        visualData: { nodes: ['A', 'B', 'C'], prev: null, curr: 0, links: [{ f: 0, t: 1 }, { f: 1, t: 2 }] }
      },
      {
        text: 'First step: We save curr\'s next node B in variable nextNode. Then we reverse A\'s pointer to point backward to prev (null).',
        subtitle: 'Now, we update our tracking variables: prev becomes A, curr becomes B.',
        visualData: { nodes: ['A', 'B', 'C'], prev: 0, curr: 1, links: [{ f: 0, t: null, isReversed: true }, { f: 1, t: 2 }] }
      },
      {
        text: 'Next, we temporarily save B\'s next node (C) in nextNode. We reverse B\'s pointer to point backward to prev (Node A).',
        subtitle: 'Updating trackers: prev becomes B, curr becomes C.',
        visualData: { nodes: ['A', 'B', 'C'], prev: 1, curr: 2, links: [{ f: 0, t: null, isReversed: true }, { f: 1, t: 0, isReversed: true }] }
      },
      {
        text: 'Now we save C\'s next node (null) in nextNode. We reverse C\'s pointer to point backward to prev (Node B).',
        subtitle: 'Updating trackers: prev becomes C, curr becomes null.',
        visualData: { nodes: ['A', 'B', 'C'], prev: 2, curr: null, links: [{ f: 0, t: null, isReversed: true }, { f: 1, t: 0, isReversed: true }, { f: 2, t: 1, isReversed: true }] }
      },
      {
        text: 'curr is now null. List traversal is complete! The head of our reversed linked list is prev (Node C).',
        subtitle: 'Visual layout reverted in O(N). No new nodes allocated!',
        visualData: { nodes: ['A', 'B', 'C'], prev: 2, curr: null, links: [{ f: 1, t: 0, isReversed: true }, { f: 2, t: 1, isReversed: true }] }
      }
    ]
  },
  trees: {
    title: 'BST Recursive Insertion',
    overview: 'Inserting nodes in target locations keeping smaller values to left and larger to right.',
    useCases: [
      'Indexing databases indices.',
      'Storing XML parsing frameworks dynamically.',
      'Highly optimized map dictionaries.'
    ],
    cppCode: `#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left = nullptr;
    TreeNode* right = nullptr;
    TreeNode(int x) : val(x) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) 
        root->left = insert(root->left, val);
    else 
        root->right = insert(root->right, val);
    return root;
}`,
    steps: [
      {
        text: 'Let\'s insert 12 into a Binary Search Tree (BST) containing elements: 15, 10, 20. We start comparative traverses at the root.',
        subtitle: 'Root: [15]. Target to insert: 12.',
        visualData: { root: 15, leftChild: { val: 10, left: null, right: null }, rightChild: { val: 20, left: null, right: null }, currentFocus: 'root', newlyAdded: null }
      },
      {
        text: 'Compare 12 with Root value (12 < 15). Since 12 is less, we navigate down to the left child [10].',
        subtitle: 'A BST routes smaller nodes exclusively leftward.',
        visualData: { root: 15, leftChild: { val: 10, left: null, right: null }, rightChild: { val: 20, left: null, right: null }, currentFocus: 'left', newlyAdded: null }
      },
      {
        text: 'Compare 12 with Left child value (12 > 10). Since 12 is greater, we navigate down to the right of node [10].',
        subtitle: 'A BST routes larger nodes exclusively rightward.',
        visualData: { root: 15, leftChild: { val: 10, left: null, right: null }, rightChild: { val: 20, left: null, right: null }, currentFocus: 'left_right', newlyAdded: null }
      },
      {
        text: 'The right child of node 10 is currently null! We create a new Node [12] and attach it there.',
        subtitle: 'Insertion is now complete.',
        visualData: { root: 15, leftChild: { val: 10, left: null, right: { val: 12, left: null, right: null } }, rightChild: { val: 20, left: null, right: null }, currentFocus: 'left_inserted', newlyAdded: 12 }
      },
      {
        text: 'Process Complete! The node 12 is placed preserving relative BST orders. Average height operations run in O(log N).',
        subtitle: 'Inorder traverse outputs: 10 -> 12 -> 15 -> 20 (strictly sorted).',
        visualData: { root: 15, leftChild: { val: 10, left: null, right: { val: 12, left: null, right: null } }, rightChild: { val: 20, left: null, right: null }, currentFocus: null, newlyAdded: null }
      }
    ]
  },
  heaps: {
    title: 'Min-Heap Bubble Up',
    overview: 'Restoring heap parent order structures by bubblings after adding elements to the bottom.',
    useCases: [
      'OS high-priority scheduler lines.',
      'Storing active graph shortest paths queues.',
      'Selecting top-k metrics stream registers.'
    ],
    cppCode: `#include <iostream>
#include <vector>
#include <queue> // std::priority_queue

int main() {
    // Min-heap in C++
    std::priority_queue<int, std::vector<int>, std::greater<int>> pq;
    
    pq.push(10);
    pq.push(20);
    pq.push(15);
    pq.push(5); // Swaps with parent 20, then parent 10
    
    std::cout << "Min element: " << pq.top() << "\\n"; // Prints 5
    return 0;
}`,
    steps: [
      {
        text: 'We have a Min-Heap tree [10] with children [20] and [15]. We insert 5 at the first open branch level leaf.',
        subtitle: 'Initially, 5 resides at bottom-left child index. Invariant violated: Parent [20] > Child [5].',
        visualData: { heap: [10, 20, 15, 5], activeIndices: [1, 3], state: 'init' }
      },
      {
        text: 'Because 5 is smaller than its parent 20, we swap them to restore heap property at that branch.',
        subtitle: 'Updating node positions: 5 moves up, 20 shifts down.',
        visualData: { heap: [10, 5, 15, 20], activeIndices: [1, 3], state: 'swapped_1' }
      },
      {
        text: 'Wait, 5 is still smaller than its new parent, the root [10] (5 < 10). We must bubble up again!',
        subtitle: 'Heap invariant violation check at root.',
        visualData: { heap: [10, 5, 15, 20], activeIndices: [0, 1], state: 'check_root' }
      },
      {
        text: 'We swap 5 and 10. Node 5 reaches the root of our Min-Heap tree!',
        subtitle: 'Root has been overwritten with 5.',
        visualData: { heap: [5, 10, 15, 20], activeIndices: [0, 1], state: 'swapped_root' }
      },
      {
        text: 'The structural heap invariants are successfully restored for all nodes! Time complexity: O(log N).',
        subtitle: 'Underlying array layout: [5, 10, 15, 20]. Min-Heap is ready.',
        visualData: { heap: [5, 10, 15, 20], activeIndices: [], state: 'done' }
      }
    ]
  },
  graphs: {
    title: 'Breadth-First Search (BFS)',
    overview: 'Expanding search frontier layer-by-layer level tracking shortest distances.',
    useCases: [
      'Calculating shortest route paths in road directions.',
      'Analyzing direct connections degrees on LinkedIn.',
      'Web-crawling indexing operations.'
    ],
    cppCode: `#include <iostream>
#include <vector>
#include <queue>

void bfs(int start, const std::vector<std::vector<int>>& adj) {
    std::vector<bool> visited(adj.size(), false);
    std::queue<int> q;
    
    q.push(start);
    visited[start] = true;
    
    while(!q.empty()) {
        int u = q.front(); q.pop();
        std::cout << u << " ";
        for(int v : adj[u]) {
            if(!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
    steps: [
      {
        text: 'We will search our Graph starting from Node A. The queue begins empty and no nodes are marked visited.',
        subtitle: 'Nodes connected: A <-> B, A <-> C, B <-> D. Start Node: A.',
        visualData: { visited: [], queue: [], current: null }
      },
      {
        text: 'We enqueue A and mark it as visited. Queue: [A]. Visited set: {A}.',
        subtitle: 'Start node is completely loaded.',
        visualData: { visited: ['A'], queue: ['A'], current: null }
      },
      {
        text: 'We dequeue active node A. We check its unvisited adjacent neighbors: B and C.',
        subtitle: 'Neighbors B and C are discovered.',
        visualData: { visited: ['A'], queue: [], current: 'A' }
      },
      {
        text: 'We enqueue neighbors B and C, and mark them as visited. Queue: [B, C]. Visited: {A, B, C}.',
        subtitle: 'Layer 1 traversal is completely active.',
        visualData: { visited: ['A', 'B', 'C'], queue: ['B', 'C'], current: 'A' }
      },
      {
        text: 'We dequeue the next node from queue: B. We check its unvisited neighbors, which is D.',
        subtitle: 'B is processed, discovering neighbor D.',
        visualData: { visited: ['A', 'B', 'C'], queue: ['C'], current: 'B' }
      },
      {
        text: 'We enqueue D, and mark D visited. Queue: [C, D]. Visited set: {A, B, C, D}.',
        subtitle: 'Neighbors of B are loaded.',
        visualData: { visited: ['A', 'B', 'C', 'D'], queue: ['C', 'D'], current: 'B' }
      },
      {
        text: 'We dequeue C. Neighbors of C are already visited. Queue: [D].',
        subtitle: 'No new node discovery from C.',
        visualData: { visited: ['A', 'B', 'C', 'D'], queue: ['D'], current: 'C' }
      },
      {
        text: 'Finally, we dequeue D. Queue is now completely empty. The layer search is concluded.',
        subtitle: 'BFS is done! Shortest levels are mapped in O(V + E) time.',
        visualData: { visited: ['A', 'B', 'C', 'D'], queue: [], current: 'D' }
      }
    ]
  },
  dp: {
    title: 'Coin Change Tabulation',
    overview: 'Solving complex dynamic calculations by caching calculations iteratively bottom-up.',
    useCases: [
      'Retrieving editing similarity costs between words.',
      'Maximum financial asset distributions.',
      'Optimal physical inventory dimensions partitions.'
    ],
    cppCode: `#include <iostream>
#include <vector>
#include <algorithm>

int minCoins(const std::vector<int>& coins, int target) {
    // 1e9 safely represents math infinity
    std::vector<int> dp(target + 1, 1e9); 
    dp[0] = 0; // Base case
    
    for (int i = 1; i <= target; ++i) {
        for (int c : coins) {
            if (i - c >= 0) {
                dp[i] = std::min(dp[i], dp[i - c] + 1);
            }
        }
    }
    return dp[target] >= 1e9 ? -1 : dp[target];
}`,
    steps: [
      {
        text: 'We want to find the minimum number of coins to form Sum = 4 using coin set [1, 2].',
        subtitle: 'We initialize dp[0..4] array to infinity (represented as INF), except dp[0] = 0.',
        visualData: { dp: [0, 'INF', 'INF', 'INF', 'INF'], currentFocus: 0, coins: [1, 2] }
      },
      {
        text: 'Calculate dp[1]: Using coin 1, we can form 1 from value 1-1=0. Cost = dp[0] + 1 = 0 + 1 = 1.',
        subtitle: 'Update: dp[1] = 1.',
        visualData: { dp: [0, 1, 'INF', 'INF', 'INF'], currentFocus: 1, coins: [1, 2] }
      },
      {
        text: 'Calculate dp[2]: We check all coins. Using coin 1: dp[2-1]+1 = dp[1]+1 = 2. Using coin 2: dp[2-2]+1 = dp[0]+1 = 1.',
        subtitle: 'Choose minimum: min(2, 1) = 1. Update: dp[2] = 1.',
        visualData: { dp: [0, 1, 1, 'INF', 'INF'], currentFocus: 2, coins: [1, 2] }
      },
      {
        text: 'Calculate dp[3]: Using coin 1: dp[3-1]+1 = dp[2]+1 = 2. Using coin 2: dp[3-2]+1 = dp[1]+1 = 2.',
        subtitle: 'Choose minimum: min(2, 2) = 2. Update: dp[3] = 2.',
        visualData: { dp: [0, 1, 1, 2, 'INF'], currentFocus: 3, coins: [1, 2] }
      },
      {
        text: 'Calculate dp[4]: Using coin 1: dp[4-1]+1 = dp[3]+1 = 3. Using coin 2: dp[4-2]+1 = dp[2]+1 = 2.',
        subtitle: 'Choose minimum: min(3, 2) = 2. Update dp[4] = 2.',
        visualData: { dp: [0, 1, 1, 2, 2], currentFocus: 4, coins: [1, 2] }
      },
      {
        text: 'Tabulation Complete! Bottom-up array tells us dp[4] = 2 is the absolute minimum coins needed.',
        subtitle: 'DP eliminates redundant calculations, running in O(Sum * Coins) instead of O(2^N).',
        visualData: { dp: [0, 1, 1, 2, 2], currentFocus: null, coins: [1, 2] }
      }
    ]
  },
  'lru-cache': {
    title: 'LRU Cache mechanics',
    overview: 'Double-link indexes synced with quick table indexes to discard oldest records.',
    useCases: [
      'Caching HTTP contents safely.',
      'Low levels OS memory buffering.',
      'CDN static caches.'
    ],
    cppCode: `#include <iostream>
#include <unordered_map>
#include <list> // Doubly Linked List

class LRUCache {
    int cap;
    std::list<int> dll; // Access keys
    std::unordered_map<int, std::pair<int, std::list<int>::iterator>> map;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    void put(int key, int val) {
        if(map.count(key)) {
            dll.erase(map[key].second);
        } else if(map.size() >= cap) {
            int lru = dll.back(); dll.pop_back();
            map.erase(lru);
        }
        dll.push_front(key);
        map[key] = {val, dll.begin()};
    }
};`,
    steps: [
      {
        text: 'Initial Cache is empty. Max Capacity = 2. We perform PUT(1, 10).',
        subtitle: 'Key 1 is inserted as head.',
        visualData: { map: {}, dll: [], lruEviction: null }
      },
      {
        text: 'We perform PUT(2, 20). Map has room. Key 2 is attached and goes to head. Storage: {2: 20, 1: 10}.',
        subtitle: 'Key access is: Head -> [2] <-> [1] -> Tail.',
        visualData: { map: { 1: 10, 2: 20 }, dll: [2, 1], lruEviction: null }
      },
      {
        text: 'Now, we call GET(1). Key 1 is fetched instantly in O(1) from map. We must shift Key 1 to head.',
        subtitle: 'Access layout: Head -> [1] <-> [2] -> Tail.',
        visualData: { map: { 1: 10, 2: 20 }, dll: [1, 2], lruEviction: null }
      },
      {
        text: 'Next, we PUT(3, 30). Cache limit of 2 is exceeded! We must evict the least recently used element.',
        subtitle: 'We check tail of DLL: Key 2 is least active.',
        visualData: { map: { 1: 10, 2: 20 }, dll: [1, 2], lruEviction: 2 }
      },
      {
        text: 'We evict Key 2 from map & DLL and write Key 3 to head. Cache: {3: 30, 1: 10}.',
        subtitle: 'Access layout: Head -> [3] <-> [1] -> Tail. LRU is completed!',
        visualData: { map: { 1: 10, 3: 30 }, dll: [3, 1], lruEviction: null }
      }
    ]
  },
  trie: {
    title: 'Trie Prefix Insertion',
    overview: 'Merging common root strings in alphabet node arrays for fast autocompletes.',
    useCases: [
      'Auto-complete text registries in keyboards.',
      'Checking valid strings in dictionaries.',
      'IP router addresses matches.'
    ],
    cppCode: `#include <iostream>
#include <string>

struct TrieNode {
    TrieNode* children[26] = {nullptr};
    bool isWord = false;
};

void insert(TrieNode* root, std::string word) {
    TrieNode* curr = root;
    for(char c : word) {
        int idx = c - 'a';
        if(!curr->children[idx]) {
            curr->children[idx] = new TrieNode();
        }
        curr = curr->children[idx];
    }
    curr->isWord = true;
}`,
    steps: [
      {
        text: 'We have an empty Trie structure containing just the Root node. Let\'s insert "CAT".',
        subtitle: 'Start path at Root.',
        visualData: { paths: [], activeChar: null, nodeHighlight: null }
      },
      {
        text: 'We look for branch \'C\'. It is missing, so we create node \'C\' under Root.',
        subtitle: 'Inserting C under Root.',
        visualData: { paths: ['C'], activeChar: 'C', nodeHighlight: 'C' }
      },
      {
        text: 'Now move to node \'C\'. Look for child \'A\'. Since it is missing, we create child Node \'A\'.',
        subtitle: 'Word pathway so far: C -> A.',
        visualData: { paths: ['C', 'C->A'], activeChar: 'A', nodeHighlight: 'A' }
      },
      {
        text: 'Now move to node \'A\'. Look for child \'T\'. We create node \'T\' under \'A\'.',
        subtitle: 'Word pathway so far: C -> A -> T.',
        visualData: { paths: ['C', 'C->A', 'A->T'], activeChar: 'T', nodeHighlight: 'T' }
      },
      {
        text: 'At Node \'T\', we set isWord = true, completing insertion. Searches for "CAT" will now resolve instantly.',
        subtitle: 'Lookup queries depend purely on string size, not dictionary sizes.',
        visualData: { paths: ['C', 'C->A', 'A->T (Word)'], activeChar: null, nodeHighlight: 'T' }
      }
    ]
  },
  'union-find': {
    title: 'Disjoint Set Union (DSU)',
    overview: 'Managing interconnected partitions quickly with paths compressions and pointers.',
    useCases: [
      'Locating cycles inside undirected graph blocks.',
      'Finding Connected Components in networks.',
      'Kruskal\'s Minimum Spanning Tree algorithms.'
    ],
    cppCode: `#include <iostream>
#include <vector>

class DSU {
    std::vector<int> parent;
public:
    DSU(int n) {
        parent.resize(n);
        for(int i = 0; i < n; i++) parent[i] = i;
    }
    
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    
    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) parent[root_j] = root_i;
    }
};`,
    steps: [
      {
        text: 'Suppose we have 4 disjoint items, each initially pointing to themselves as their parent set.',
        subtitle: 'parent: [0, 1, 2, 3]. Elements are unique cliques.',
        visualData: { parent: [0, 1, 2, 3], unioning: null }
      },
      {
        text: 'Let\'s run UNION(0, 1). Root of 0 is 0, Root of 1 is 1. We point parent of 1 to root 0.',
        subtitle: 'Set {0, 1} formed. parent: [0, 0, 2, 3].',
        visualData: { parent: [0, 0, 2, 3], unioning: [0, 1] }
      },
      {
        text: 'Let\'s run UNION(2, 3). Root of 2 is 2, Root of 3 is 3. We point parent of 3 to root 2.',
        subtitle: 'Sets formed: {0,1} and {2,3}. parent: [0, 0, 2, 2].',
        visualData: { parent: [0, 0, 2, 2], unioning: [2, 3] }
      },
      {
        text: 'Now let\'s UNION(1, 3). We first call Find(1) which yields Root 0, and Find(3) which yields Root 2.',
        subtitle: 'Roots 0 and 2 are different. We must union them.',
        visualData: { parent: [0, 0, 2, 2], unioning: [1, 3], pendingRoots: [0, 2] }
      },
      {
        text: 'We point parent of root 2 to root 0. Now all nodes reside in a single set with root 0.',
        subtitle: 'DSU runs in near-constant amortized O(alpha(N)) operations!',
        visualData: { parent: [0, 0, 0, 2], unioning: null }
      }
    ]
  },
  greedy: {
    title: 'Activity Selection Greedy Choice',
    overview: 'Making short-term optimal choices leading to global global resource optimization.',
    useCases: [
      'Interval schedules and calendar bookers.',
      'File compression algorithms (Huffman Coding).',
      'Minimizing resource loads and travel distances.'
    ],
    cppCode: `#include <iostream>
#include <vector>
#include <algorithm>

struct Activity {
    int start, end;
};

int maxActivities(std::vector<Activity>& acts) {
    // 1. Sort by earliest end times
    std::sort(acts.begin(), acts.end(), [](Activity a, Activity b) {
        return a.end < b.end;
    });
    
    int count = 0;
    int cur_end_time = -1;
    for (auto& act : acts) {
        if (act.start >= cur_end_time) {
            count++;
            cur_end_time = act.end; // Choose greedily
        }
    }
    return count;
}`,
    steps: [
      {
        text: 'We want to schedule the maximum number of overlapping meetings from: [1-4], [3-5], [0-6], [5-7].',
        subtitle: 'Initial unsorted intervals list.',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: false, selected: [], rejected: [], curEnd: null }
      },
      {
        text: 'First, we sort the intervals greedily by their end times to prioritize earliest freeing of resources.',
        subtitle: 'Sorted: [1-4], [3-5], [0-6], [5-7].',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: true, selected: [], rejected: [], curEnd: null }
      },
      {
        text: 'We inspect first sorted interval: [1-4]. Since it starts at 1, which is >= current end time (initialized to -1), we select it.',
        subtitle: 'Meeting selected! CurEnd limits updated to 4.',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: true, selected: [0], rejected: [], curEnd: 4 }
      },
      {
        text: 'We inspect next interval: [3-5]. Since start time 3 is < CurEnd (4), this meeting overlaps! We must discard it.',
        subtitle: 'Meeting overlaps with [1-4]. Reject.',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: true, selected: [0], rejected: [1], curEnd: 4 }
      },
      {
        text: 'We inspect [0-6]. Starts at 0 < CurEnd (4). Discard as it overlaps.',
        subtitle: 'Meeting overlaps. Reject.',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: true, selected: [0], rejected: [1, 2], curEnd: 4 }
      },
      {
        text: 'We inspect [5-7]. Start 5 >= CurEnd (4). No overlap! We select this meeting and update CurEnd to 7.',
        subtitle: 'Meeting selected! CurEnd updated to 7.',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: true, selected: [0, 3], rejected: [1, 2], curEnd: 7 }
      },
      {
        text: 'Conclusion: We successfully selected 2 maximum meetings using Greedy Selection. Time Complexity: O(N log N) sorting.',
        subtitle: 'A local greedy choice leads to the globally optimal schedule!',
        visualData: { intervals: [{ s: 1, e: 4 }, { s: 3, e: 5 }, { s: 0, e: 6 }, { s: 5, e: 7 }], sorted: true, selected: [0, 3], rejected: [1, 2], curEnd: 7 }
      }
    ]
  },
  'bit-manipulation': {
    title: 'Brian Kernighan Set Bits count',
    overview: 'Performing fast low-level bit operations at direct hardware speeds.',
    useCases: [
      'Calculating cryptographic hashes.',
      'Maintaining quick dense bit-masks registries.',
      'Checking odd/even status with single operations.'
    ],
    cppCode: `#include <iostream>

int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n = n & (n - 1); // Discards lowest set bit
        count++;
    }
    return count;
}

int main() {
    std::cout << countSetBits(13); // Prints 3
    return 0;
}`,
    steps: [
      {
        text: 'We want to count the number of set binary bits (value 1) in number 13.',
        subtitle: '13 in binary representation is: 1101. Tracker: count = 0.',
        visualData: { num: 13, binary: '1101', count: 0 }
      },
      {
        text: 'We run Brian Kernighan\'s formula: n = n & (n - 1). This clears the lowest set bit. n - 1 = 12 (1100).',
        subtitle: 'Result of: n & (n-1) = 1101 & 1100 = 1100 (12). count becomes 1.',
        visualData: { num: 12, binary: '1100', count: 1 }
      },
      {
        text: 'Next iteration. n = 12 (1100). n - 1 = 11 (1011). Run formula again.',
        subtitle: 'Result of: n & (n-1) = 1100 & 1011 = 1000 (8). count becomes 2.',
        visualData: { num: 8, binary: '1000', count: 2 }
      },
      {
        text: 'Next iteration. n = 8 (1000). n - 1 = 7 (0111). Run formula.',
        subtitle: 'Result of: n & (n-1) = 1000 & 0111 = 0000 (0). count becomes 3.',
        visualData: { num: 0, binary: '0000', count: 3 }
      },
      {
        text: 'n has reached zero. Loop terminates. We found exactly 3 set bits in number 13. High performance!',
        subtitle: 'Bitwise tricks operate in O(Set Bits) instead of O(Total Bits).',
        visualData: { num: 0, binary: '0000', count: 3 }
      }
    ]
  },
  'number-theory': {
    title: 'Euclidean GCD Algorithm',
    overview: 'Determining the Greatest Common Divisor of two values recursively in math ratios.',
    useCases: [
      'Simplifying mathematical ratios.',
      'RSA algorithm cryptographic keys configurations.',
      'Periodicity checking loops.'
    ],
    cppCode: `#include <iostream>

int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

int main() {
    std::cout << "GCD(48, 18): " << gcd(48, 18); // Prints 6
    return 0;
}`,
    steps: [
      {
        text: 'We want to calculate the Greatest Common Divisor (GCD) of a = 48 and b = 18 using the Euclidean Algorithm.',
        subtitle: 'Euclid Formula states: gcd(a, b) = gcd(b, a % b).',
        visualData: { a: 48, b: 18, mod: null }
      },
      {
        text: 'We calculate a % b: 48 % 18 = 12. We reduce the problem to gcd(18, 12).',
        subtitle: 'gcd(48, 18) becomes gcd(18, 12).',
        visualData: { a: 18, b: 12, mod: 12 }
      },
      {
        text: 'We calculate a % b again: 18 % 12 = 6. We reduce the problem to gcd(12, 6).',
        subtitle: 'gcd(18, 12) becomes gcd(12, 6).',
        visualData: { a: 12, b: 6, mod: 6 }
      },
      {
        text: 'Calculate a % b again: 12 % 6 = 0. We reduce the problem to gcd(6, 0).',
        subtitle: 'gcd(12, 6) becomes gcd(6, 0).',
        visualData: { a: 6, b: 0, mod: 0 }
      },
      {
        text: 'Since b is now 0, the Euclidean base case is hit. The GCD is the active value of a, which is 6!',
        subtitle: 'The algorithm terminates extremely fast in logarithmic time!',
        visualData: { a: 6, b: 0, mod: 0, finished: true }
      }
    ]
  }
};

function highlightCppCode(code: string): React.ReactNode {
  if (!code) return '';

  const lines = code.split('\n');
  return (
    <div className="font-mono text-[11px] leading-relaxed select-text text-left">
      {lines.map((line, lineIdx) => {
        let keyCounter = 0;
        const elements: React.ReactNode[] = [];

        // Match preprocessor directives first
        if (line.trim().startsWith('#')) {
          const matchInc = line.match(/^(#include)\s+((?:&lt;|<)[^&>]+(?:&gt;|>)|"[^"]+")/);
          if (matchInc) {
            elements.push(
              <span key="pre-dir" className="text-[#C586C0] font-bold">#include </span>,
              <span key="pre-lib" className="text-[#CE9178]">{matchInc[2]}</span>
            );
            return <div key={lineIdx} className="min-h-[1.2rem]">{elements}</div>;
          }
          elements.push(<span key="pre-all" className="text-[#C586C0] font-bold">{line}</span>);
          return <div key={lineIdx} className="min-h-[1.2rem]">{elements}</div>;
        }

        // Token regex to match comments, strings, constants, base types and flow keywords
        const tokenRegex = /(\/\/.*)|("(\\.|[^"])*")|('(\\.|[^'])*')|(\b\d+\b)|(\b(int|double|float|char|bool|void|auto|std|vector|unordered_map|unordered_set|map|set|stack|queue|string|cout|cin|endl)\b)|(\b(class|public|private|protected|struct|template|typename|using|namespace|return|while|for|if|else|const|new|delete)\b)|([a-zA-Z_]\w*)|([{}()\[\];<>+\-*=\/&|!%:,.]+)|(\s+)/g;

        let match;
        tokenRegex.lastIndex = 0;

        while ((match = tokenRegex.exec(line)) !== null) {
          const matchText = match[0];
          const [
            , 
            comment, 
            doubleQuoteStr, 
            , 
            , 
            singleQuoteStr, 
            , 
            number, 
            typeOrLib, 
            , 
            keyword, 
            , 
            identifier, 
            symbol,
            whitespace
          ] = match;

          const key = `${lineIdx}-${keyCounter++}`;

          if (comment) {
            elements.push(<span key={key} className="text-[#6A9955] italic">{matchText}</span>);
          } else if (doubleQuoteStr || singleQuoteStr) {
            elements.push(<span key={key} className="text-[#CE9178]">{matchText}</span>);
          } else if (number) {
            elements.push(<span key={key} className="text-[#B5CEA8]">{matchText}</span>);
          } else if (typeOrLib) {
            elements.push(<span key={key} className="text-[#4EC9B0] font-medium">{matchText}</span>);
          } else if (keyword) {
            elements.push(<span key={key} className="text-[#C586C0] font-medium">{matchText}</span>);
          } else if (symbol) {
            elements.push(<span key={key} className="text-[#D4D4D4]">{matchText}</span>);
          } else if (identifier) {
            // Function names or standard identifiers matched as light yellow/blue
            elements.push(<span key={key} className="text-[#9CDCFE]">{matchText}</span>);
          } else if (whitespace) {
            elements.push(<span key={key}>{matchText}</span>);
          } else {
            elements.push(<span key={key}>{matchText}</span>);
          }
        }

        return (
          <div key={lineIdx} className="min-h-[1.2rem] whitespace-pre-wrap">
            {elements.length > 0 ? elements : line}
          </div>
        );
      })}
    </div>
  );
}

export default function AnimatedVideoExplainer({ topicId }: AnimatedVideoExplainerProps) {
  // Load standard data fallback
  const explainer = EXPLAINER_DATA[topicId] || EXPLAINER_DATA.arrays;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x, 2x
  const [typedCode, setTypedCode] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  const timerRef = useRef<any>(null);

  // Reset steps on change topic
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setTypedCode('');
    setIsTypingDone(false);
  }, [topicId]);

  // Handle Autoplay timer loop
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPlaying) {
      const intervalDuration = 3200 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= explainer.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalDuration);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, explainer, topicId]);

  // C++ Code slow typing effect when video reaches the final step
  useEffect(() => {
    if (currentStep === explainer.steps.length - 1) {
      // Start typing C++ Code terminal
      setIsTypingDone(false);
      let i = 0;
      const fullText = explainer.cppCode;
      setTypedCode(fullText.substring(0, 5)); // seed initial string

      const typeTimer = setInterval(() => {
        i += 6; // quick typing batch jumps
        if (i >= fullText.length) {
          setTypedCode(fullText);
          setIsTypingDone(true);
          clearInterval(typeTimer);
        } else {
          setTypedCode(fullText.substring(0, i));
        }
      }, 15);

      return () => clearInterval(typeTimer);
    } else {
      setTypedCode('');
      setIsTypingDone(false);
    }
  }, [currentStep, explainer, topicId]);

  const handleNext = () => {
    if (currentStep < explainer.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const activeStep = explainer.steps[currentStep] || explainer.steps[0];
  const progressPercent = ((currentStep) / (explainer.steps.length - 1)) * 100;

  // Custom visual rendering helpers for various topics
  const renderVisualStage = () => {
    const vd = activeStep.visualData;
    if (!vd) return null;

    switch (topicId) {
      case 'arrays': {
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full p-2">
              {vd.arr.map((val: any, idx: number) => {
                const isFocus = vd.focusIndices.includes(idx);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold mb-1">[{idx}]</span>
                    <div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-extrabold border text-base shadow transition-all duration-300 ${
                        isFocus 
                          ? 'bg-[#4880FF]/25 border-[#4880FF] scale-110 animate-pulse text-[#4880FF]' 
                          : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-[#2C3148] text-slate-705 dark:text-[#7EE787]'
                      }`}
                    >
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
            {vd.arrow && (
              <div className="text-xs text-[#4880FF] font-mono flex items-center gap-1.5 animate-bounce bg-[#4880FF]/10 px-3 py-1 rounded-full border border-[#4880FF]/20">
                <span>Shifting elements: Index {vd.arrow.from} → Index {vd.arrow.to}</span>
              </div>
            )}
            <div className="text-[#00B69B] font-mono font-semibold text-xs tracking-wide bg-[#00B69B]/10 border border-[#00B69B]/20 px-3 py-1.5 rounded-lg">
              {vd.highlightText}
            </div>
          </div>
        );
      }

      case 'hashing': {
        const buckets = vd.buckets;
        return (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full p-4">
            {/* Input key */}
            {vd.activeKey && (
              <div className="flex flex-col items-center space-y-1 select-none animate-bounce">
                <span className="text-[9px] text-[#FFA800] uppercase font-bold tracking-wider">Input Key</span>
                <div className="bg-[#FFA800]/10 border border-[#FFA800]/30 text-[#FFA800] px-4 py-2.5 rounded-xl text-xs font-mono font-extrabold shadow">
                  {vd.activeKey}
                </div>
                {vd.stepAction === 'collision' && (
                  <div className="text-[10px] text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-900 animate-pulse mt-2">
                    Collision Triggered!
                  </div>
                )}
              </div>
            )}

            {/* Buckets */}
            <div className="flex flex-col space-y-2 w-full max-w-sm">
              {buckets.map((chain: any[], bIdx: number) => {
                const isFocus = vd.focusBucket === bIdx;
                return (
                  <div 
                    key={bIdx} 
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all duration-300 ${
                      isFocus 
                        ? 'bg-[#4880FF]/20 border-[#4880FF] scale-102 shadow-glow' 
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 shadow-sm'
                    }`}
                  >
                    <span className="text-[10px] text-slate-550 dark:text-slate-400 font-mono font-black border-r border-slate-200 dark:border-[#2C3148] pr-2.5">Bucket [{bIdx}]</span>
                    {chain.length === 0 ? (
                      <span className="text-slate-650 text-[10px] italic">empty</span>
                    ) : (
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {chain.map((item, nodeIdx) => (
                          <div key={nodeIdx} className="flex items-center">
                            <div className="bg-[#7EE787]/10 border border-[#7EE787]/30 px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#7EE787]">
                              {item.k}: {item.v}
                            </div>
                            {nodeIdx < chain.length - 1 && (
                              <span className="text-slate-500 font-bold px-1 text-[11px]">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'two-pointers': {
        const arr = vd.arr;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-2">
              {arr.map((val: number, idx: number) => {
                const isLeft = vd.left === idx;
                const isRight = vd.right === idx;
                return (
                  <div key={idx} className="flex flex-col items-center relative">
                    <div className="h-6 w-full flex items-center justify-center">
                      {isLeft && <span className="text-[#4880FF] font-black text-xs animate-bounce font-sans">L ▼</span>}
                      {isRight && <span className="text-[#FF3E3E] font-black text-xs animate-bounce font-sans">R ▼</span>}
                    </div>
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold border text-sm transition-all duration-300 ${
                        isLeft ? 'bg-[#4880FF]/15 border-[#4880FF] scale-105 text-[#4880FF]' :
                        isRight ? 'bg-[#FF3E3E]/15 border-[#FF3E3E] scale-105 text-[#FF3E3E]' :
                        'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-[#2C3148] text-slate-700 dark:text-slate-350 shadow-sm'
                      }`}
                    >
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#2C3148] px-4 py-2.5 rounded-xl text-xs font-mono shadow-sm text-slate-800 dark:text-slate-200">
              <span className="text-slate-400">Sum = arr[L] + arr[R]</span>
              <span className={`font-extrabold ${vd.matched ? 'text-[#00B69B] animate-pulse text-sm' : 'text-[#FFA800]'}`}>
                {vd.sum} (Target: 12)
              </span>
            </div>

            {vd.matched && (
              <div className="bg-[#00B69B]/15 border border-[#00B69B]/30 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#00B69B] animate-bounce">
                ✔ Match Achieved! Sum equals 12
              </div>
            )}
          </div>
        );
      }

      case 'sliding-window': {
        const arr = vd.arr;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-1 overflow-x-auto max-w-full p-2 relative">
              {arr.map((val: number, idx: number) => {
                const isInWindow = vd.wStart !== null && idx >= vd.wStart && idx <= vd.wEnd;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 font-mono mb-1">[{idx}]</span>
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border text-sm transition-all duration-300 ${
                        isInWindow 
                          ? 'bg-[#4880FF]/15 border-[#4880FF] text-[#4880FF] scale-102 font-extrabold shadow-sm' 
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 text-slate-450 dark:text-slate-500'
                      }`}
                    >
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {vd.sum !== null && (
              <div className="flex justify-around bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#2C3148] w-full max-w-sm rounded-xl p-3 text-xs font-mono text-slate-800 dark:text-slate-200 shadow-sm">
                <div className="flex flex-col items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Active Sum</span>
                  <span className="font-extrabold text-[#4880FF]">{vd.sum}</span>
                </div>
                <div className="border-r border-slate-200 dark:border-[#2C3148] h-full" />
                <div className="flex flex-col items-center">
                  <span className="text-slate-550 dark:text-slate-400 font-bold">Max Sum Overall</span>
                  <span className="font-extrabold text-[#00B69B]">{vd.max}</span>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'binary-search': {
        const arr = vd.arr;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-1 overflow-x-auto max-w-full p-2">
              {arr.map((val: number, idx: number) => {
                const isMid = vd.mid === idx;
                const isLow = vd.low === idx;
                const isHigh = vd.high === idx;
                const activeRange = idx >= vd.low && idx <= vd.high;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="h-6 w-full flex flex-col items-center justify-center text-[9px] font-mono leading-none font-bold">
                      {isLow && <span className="text-[#4880FF] mb-0.5">L</span>}
                      {isHigh && <span className="text-[#FF3E3E] mb-0.5">H</span>}
                      {isMid && <span className="text-[#00B69B]">M</span>}
                    </div>
                    <div 
                      className={`w-11 h-11 rounded-lg flex items-center justify-center font-black border text-xs transition-all duration-300 ${
                        isMid ? 'bg-[#00B69B]/20 border-[#00B69B] scale-110 text-[#00B69B]' :
                        activeRange ? 'bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-705 dark:text-slate-250 font-bold shadow-sm' :
                        'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-700'
                      }`}
                    >
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#2C3148] px-4 py-2 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 shadow-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-[#D19A66] font-semibold">
                {vd.status === 'init' && 'Boundaries initialized'}
                {vd.status === 'too_small' && 'Midval is < Target (23)'}
                {vd.status === 'too_big' && 'Midval is > Target (23)'}
                {vd.status === 'shift_right' && 'Search Right Half'}
                {vd.status === 'shift_left' && 'Search Left Half'}
                {vd.status === 'found' && 'Target Found!'}
              </span>
            </div>
          </div>
        );
      }

      case 'linked-lists': {
        const nodes = vd.nodes;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-3 overflow-x-auto max-w-full p-2">
              {nodes.map((node: string, idx: number) => {
                const isCurr = vd.curr === idx;
                const isPrev = vd.prev === idx;
                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-full flex items-center justify-center text-[9px] font-mono font-bold leading-none">
                        {isCurr && <span className="text-[#4880FF] mb-0.5">curr</span>}
                        {isPrev && <span className="text-[#00B69B]">prev</span>}
                      </div>

                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold border text-sm transition-all duration-300 ${
                          isCurr ? 'bg-[#4880FF]/15 border-[#4880FF] scale-102 text-[#4880FF]' :
                          isPrev ? 'bg-[#00B69B]/15 border-[#00B69B] text-[#00B69B]' :
                          'bg-white dark:bg-slate-900 border-slate-250 dark:border-[#2C3148] text-slate-700 dark:text-slate-350 shadow-sm'
                        }`}
                      >
                        {node}
                      </div>
                    </div>
                    {idx < nodes.length - 1 && (
                      <span className="text-[#FFA800] dark:text-[#D19A66] font-extrabold text-lg px-2">→</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-slate-605 dark:text-slate-400 font-mono text-[10px] bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              Reversing linkages in-place with memory O(1).
            </div>
          </div>
        );
      }

      case 'trees': {
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <div className="flex flex-col items-center w-full max-w-xs relative p-4 space-y-6 select-none leading-none">
              {/* Root */}
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-extrabold text-xs shadow-sm ${vd.currentFocus === 'root' ? 'bg-[#4880FF]/25 border-[#4880FF] scale-110 text-[#4880FF]' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-705 text-slate-700 dark:text-slate-300 shadow-sm'}`}>
                  {vd.root}
                </div>
                <span className="text-[8px] text-slate-500 font-bold mt-1">ROOT</span>
              </div>

              {/* Children Row */}
              <div className="flex justify-between w-full relative">
                {/* Left */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-extrabold text-xs shadow-sm ${vd.currentFocus === 'left' ? 'bg-[#4880FF]/25 border-[#4880FF] scale-110 text-[#4880FF]' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-705 text-slate-700 dark:text-slate-300 shadow-sm'}`}>
                    {vd.leftChild.val}
                  </div>
                  <span className="text-[8px] text-slate-550 font-bold mt-1">LEFT CH</span>
                  
                  {/* Left inserted node */}
                  {vd.leftChild.right && (
                    <div className="flex flex-col items-center mt-4">
                      <div className="text-[#00B69B] text-[9px] pr-1">▼</div>
                      <div className="w-9 h-9 rounded-xl border border-[#00B69B] bg-[#00B69B]/15 text-[#00B69B] flex items-center justify-center font-extrabold text-[11px] shadow animate-bounce">
                        {vd.leftChild.right.val}
                      </div>
                      <span className="text-[7.5px] text-[#00B69B] font-black mt-1">NEW</span>
                    </div>
                  )}

                  {vd.currentFocus === 'left_right' && (
                    <div className="flex flex-col items-center mt-4 border border-[#FFA800]/25 bg-[#FFA800]/10 p-1.5 rounded animate-pulse text-[8.5px] font-semibold text-[#FFA800]">
                      Comparing left child right pointer (null)
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs shadow-sm ${vd.currentFocus === 'right' ? 'bg-[#4880FF]/25 border-[#4880FF] scale-110 text-[#4880FF]' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-705 text-slate-700 dark:text-slate-300 shadow-sm'}`}>
                    {vd.rightChild.val}
                  </div>
                  <span className="text-[8px] text-slate-550 font-bold mt-1">RIGHT CH</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'heaps': {
        const heap = vd.heap;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Root */}
              <div className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-xs text-slate-700 dark:text-slate-200 font-extrabold shadow-sm">
                {heap[0]}
              </div>

              {/* Children */}
              <div className="flex gap-12">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                    vd.activeIndices.includes(1) 
                      ? 'bg-[#4880FF]/20 border-[#4880FF] scale-105 animate-pulse text-[#4880FF]' 
                      : 'border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 shadow-sm'
                  }`}>
                    {heap[1]}
                  </div>
                  <span className="text-[8px] text-slate-500 font-semibold mt-1">index 1</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-605 dark:text-slate-350 flex items-center justify-center text-xs font-bold shadow-sm">
                    {heap[2]}
                  </div>
                  <span className="text-[8px] text-slate-500 font-semibold mt-1">index 2</span>
                </div>
              </div>

              {/* Level 2 leaf */}
              {heap[3] !== undefined && (
                <div className="flex flex-col items-center">
                  <span className="text-slate-550 text-[10px]">▼</span>
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-black transition-all ${
                    vd.activeIndices.includes(3) 
                      ? 'bg-[#FF3E3E]/20 border-[#FF3E3E] scale-105 animate-pulse text-[#FF3E3E]' 
                      : 'border-slate-200 dark:border-slate-755 bg-white dark:bg-slate-955 text-slate-600 dark:text-slate-355 shadow-sm'
                  }`}>
                    {heap[3]}
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold mt-1">index 3 (added)</span>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-500 bg-white dark:bg-slate-950 px-3 py-1.5 rounded border border-slate-200 dark:border-[#2C3148] shadow-sm">
              Array Layout: [{heap.join(', ')}]
            </div>
          </div>
        );
      }

      case 'graphs': {
        const visitedSet = vd.visited;
        const qList = vd.queue;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="flex justify-around items-center w-full max-w-sm gap-4 p-2">
              {/* Node A */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs ${
                  vd.current === 'A' ? 'bg-[#FFA800]/20 border-[#FFA800] scale-110 text-[#FFA800]' :
                  visitedSet.includes('A') ? 'bg-[#00B69B]/15 border-[#00B69B] text-[#00B69B]' :
                  'bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}>A</div>
              </div>

              {/* Node B */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs ${
                  vd.current === 'B' ? 'bg-[#FFA800]/20 border-[#FFA800] scale-110 text-[#FFA800]' :
                  visitedSet.includes('B') ? 'bg-[#00B69B]/15 border-[#00B69B] text-[#00B69B]' :
                  'bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}>B</div>
              </div>

              {/* Node C */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs ${
                  vd.current === 'C' ? 'bg-[#FFA800]/20 border-[#FFA800] scale-110 text-[#FFA800]' :
                  visitedSet.includes('C') ? 'bg-[#00B69B]/15 border-[#00B69B] text-[#00B69B]' :
                  'bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}>C</div>
              </div>

              {/* Node D */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs ${
                  vd.current === 'D' ? 'bg-[#FFA800]/20 border-[#FFA800] scale-110 text-[#FFA800]' :
                  visitedSet.includes('D') ? 'bg-[#00B69B]/15 border-[#00B69B] text-[#00B69B]' :
                  'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}>D</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#2C3148] rounded-xl p-3 justify-between text-slate-850 dark:text-slate-200 shadow-sm">
              <div>
                <span className="text-slate-505 dark:text-slate-500 block text-[9px] uppercase font-bold">Queue</span>
                <span className="text-[#4880FF] font-black">[{qList.join(', ')}]</span>
              </div>
              <div className="border-r border-slate-200 dark:border-[#2C3148] h-full" />
              <div>
                <span className="text-slate-505 dark:text-slate-500 block text-[9px] uppercase font-bold">Visited Set</span>
                <span className="text-[#00B69B] font-bold">[{visitedSet.join(', ')}]</span>
              </div>
            </div>
          </div>
        );
      }

      case 'dp': {
        const dp = vd.dp;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tabulated 1D Cache Space</div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-2">
              {dp.map((val: any, idx: number) => {
                const isFocus = vd.currentFocus === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 font-mono mb-1">dp[{idx}]</span>
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border text-xs shadow-sm transition-all duration-300 ${
                        isFocus 
                          ? 'bg-[#4880FF]/20 border-[#4880FF] scale-110 text-[#4880FF]' 
                          : val === 'INF' ? 'bg-slate-100 dark:bg-slate-950/40 border-slate-205 dark:border-slate-905 text-slate-400 dark:text-slate-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-[#7EE787]'
                      }`}
                    >
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm">
              <span className="text-slate-500">Formulation:</span>
              <code className="text-[#FFA800] text-[11px] font-mono font-bold">dp[i] = min(dp[i - coin] + 1)</code>
            </div>
          </div>
        );
      }

      case 'lru-cache': {
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="flex flex-col text-xs font-mono space-y-2 w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#2C3148] rounded-xl p-3.5 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400 uppercase font-black text-[9px]">Map Key Match</span>
                <span className="text-slate-505 dark:text-slate-400 uppercase font-black text-[9px]">Value Record</span>
              </div>
              {Object.entries(vd.map).length === 0 ? (
                <div className="text-center text-slate-400 text-[10px] py-1.5 italic">map empty</div>
              ) : (
                Object.entries(vd.map).map(([k, v]: any) => (
                  <div key={k} className="flex justify-between items-center py-1">
                    <span className="text-[#4880FF] font-extrabold text-[12px]">Key {k}</span>
                    <span className="text-[#00B69B] dark:text-[#7EE787] font-bold">{v}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-xs max-w-sm">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Linked Access list:</span>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 shadow-sm">
                <span className="text-[9px] text-[#FFA800] font-black pr-1 font-sans">HEAD</span>
                {vd.dll.map((k: any, idx: number) => (
                  <div key={k} className="flex items-center font-bold">
                    <span className="text-slate-200">[{k}]</span>
                    {idx < vd.dll.length - 1 && <span className="text-slate-600 px-1">↔</span>}
                  </div>
                ))}
                {vd.dll.length > 0 && <span className="text-[9px] text-[#FF3E3E] font-black pl-1 font-sans">TAIL</span>}
              </div>
            </div>

            {vd.lruEviction && (
              <div className="text-[10px] text-red-400 font-bold bg-red-950/20 border border-red-900 px-3 py-1 rounded animate-pulse">
                Evicting Least Active Key {vd.lruEviction} from cache!
              </div>
            )}
          </div>
        );
      }

      default: {
        // Fallback or generic diagram representations
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-slate-350 font-bold text-center text-sm px-6 py-4 border border-dashed border-[#2C3148] rounded-2xl max-w-sm bg-slate-900/40">
              <Sparkles className="w-8 h-8 text-[#4880FF] mx-auto mb-2 animate-spin animate-duration-1000" />
              <span>Step {currentStep + 1} Visualization loading ...</span>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#111422] dark:border-[#2C3148] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col font-sans transition-all">
      {/* Video Header bar */}
      <div className="bg-slate-100 dark:bg-[#15192C] px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 select-none font-sans">
        <div className="flex items-center gap-3 font-sans">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse font-sans" />
          <div className="font-sans">
            <h3 className="text-sm font-sans font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1.5 font-sans">
              <span>{explainer.title}</span>
              <span className="bg-[#4880FF]/15 text-[#4880FF] text-[9px] px-2 py-0.5 rounded-full font-bold font-sans">
                Interactive Explainer
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-1 font-sans font-semibold font-sans">
              {explainer.overview}
            </p>
          </div>
        </div>

        {/* Speed button selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 font-sans">
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-1 text-[10px] font-sans font-black rounded cursor-pointer transition font-sans ${
                playbackSpeed === s 
                  ? 'bg-[#4880FF] text-white font-sans' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-sans'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Layout split screen */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[460px] max-w-full font-sans">
        {/* Left Video Render Screen */}
        <div className="lg:col-span-3 flex flex-col bg-slate-50 dark:bg-[#0E111F] relative border-r border-slate-200 dark:border-[#2C3148]/80 font-sans">
          {/* Animated Element Container */}
          <div className="flex-1 min-h-[295px] p-6 flex flex-col justify-center items-center font-sans">
            {renderVisualStage()}
          </div>

          {/* PLAYBACK CONTROLS PANEL directly below interactive nodes! */}
          <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800/85 bg-slate-100/50 dark:bg-[#111422]/60 flex flex-col space-y-3 shrink-0 select-none font-sans">
            {/* Timeline seeker */}
            <div className="flex items-center justify-between gap-4 font-sans">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-450 font-bold whitespace-nowrap">Frame {currentStep + 1}/{explainer.steps.length}</span>
              <div 
                className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 relative cursor-pointer font-sans" 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = clickX / rect.width;
                  const rawStep = Math.round(percentage * (explainer.steps.length - 1));
                  const boundedStep = Math.max(0, Math.min(explainer.steps.length - 1, rawStep));
                  setCurrentStep(boundedStep);
                }}
              >
                <div 
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-[#4880FF] rounded-full relative transition-all duration-300 font-sans"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-550 dark:text-slate-455 font-bold whitespace-nowrap">{Math.round(progressPercent)}% view</span>
            </div>

            {/* Controls panel: Back, Play/Pause, Next, Reset */}
            <div className="flex items-center justify-between font-sans">
              <div className="flex items-center gap-1.5 font-sans">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`p-2 rounded-xl transition font-sans ${currentStep === 0 ? 'text-slate-350 dark:text-slate-650 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-250 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer'}`}
                  title="Prev Frame font-sans"
                >
                  <ChevronLeft className="w-4.5 h-4.5 font-sans" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#4880FF] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:bg-[#3570F0] cursor-pointer transition transform hover:scale-105 active:scale-95 font-sans"
                  title={isPlaying ? 'Pause' : 'Play Video'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white stroke-none font-sans" /> : <Play className="w-5 h-5 fill-white stroke-none ml-0.5 font-sans" />}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === explainer.steps.length - 1}
                  className={`p-2 rounded-xl transition font-sans ${currentStep === explainer.steps.length - 1 ? 'text-slate-355 dark:text-slate-655 cursor-not-allowed animate-none' : 'text-slate-655 dark:text-slate-300 hover:bg-slate-250 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer'}`}
                  title="Next Frame font-sans"
                >
                  <ChevronRight className="w-4.5 h-4.5 font-sans" />
                </button>

                <button
                  onClick={handleRestart}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-250 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl cursor-pointer transition font-sans"
                  title="Reset Video"
                >
                  <RotateCcw className="w-4 h-4 font-sans" />
                </button>
              </div>

              <div className="text-[9px] font-sans font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase bg-slate-200/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-850 px-2.5 py-1 rounded font-sans">
                Interactive Player
              </div>
            </div>
          </div>

          {/* Dynamic subtitle/narration overlays */}
          <div className="bg-slate-50 dark:bg-[#111422]/90 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-[#2C3148] space-y-1 select-none min-h-[90px] flex flex-col justify-center font-sans">
            <p className="text-slate-800 dark:text-[#E2E8F0] font-sans text-xs font-bold leading-relaxed font-sans">
              {activeStep.text}
            </p>
            <p className="text-slate-500 dark:text-slate-405 font-mono text-[10px] leading-tight font-sans">
              {activeStep.subtitle}
            </p>
          </div>
        </div>

        {/* Right Info pane & C++ syntax terminal */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-[#141829] flex flex-col p-6 space-y-6 overflow-y-auto max-h-[500px]">
          {/* Real-world usage summary */}
          <div className="space-y-3 shrink-0">
            <h4 className="text-xs uppercase font-sans tracking-widest text-[#4880FF] font-extrabold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#4880FF]" />
              <span>Real-World Application</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-350 text-[11px] font-sans leading-relaxed">
              Where {explainer.title} is utilized in real software systems:
            </p>
            <ul className="space-y-2 font-sans select-none">
              {explainer.useCases.map((uc, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  <span className="text-[#4880FF] font-black">•</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic C++ syntax preview terminal */}
          <div className="flex-1 flex flex-col bg-slate-100 dark:bg-[#0B0D19] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[220px]">
            <div className="bg-slate-200 dark:bg-[#111422] px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2 font-bold">
                <Terminal className="w-3.5 h-3.5 text-[#FF3E3E]" />
                <span>C++ Implementation Syntax</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-[#FF3E3E]">
                C++ Standard
              </span>
            </div>
            
            <div className="p-4 overflow-auto flex-1 font-mono text-[11px] leading-relaxed bg-slate-950 dark:bg-[#0B0D19] text-slate-300">
              {currentStep === explainer.steps.length - 1 ? (
                <div className="space-y-2">
                  <div className="text-slate-300 font-semibold select-text whitespace-pre-wrap">
                    {highlightCppCode(typedCode)}
                  </div>
                  {isTypingDone && (
                    <div className="flex items-center gap-1.5 text-[#00B69B] text-[10px] bg-[#00B69B]/10 w-fit px-2.5 py-1 rounded-md mt-4 animate-fade-in font-sans">
                      <CheckCircle className="w-3 h-3 stroke-[2.5px]" />
                      <span>Syntax reference unlocked! Copy snaps from templates.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-405 dark:text-slate-550 py-6 text-center select-none font-sans">
                  <Terminal className="w-7 h-7 text-slate-400 dark:text-slate-705 mb-2" />
                  <p className="text-xs">C++ Syntax highlights will type out automatically when video playing reaches the end.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

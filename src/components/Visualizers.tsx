import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ArrowRight, Check, Search, Plus, Trash2, HelpCircle } from 'lucide-react';

interface VisualizerProps {
  type: 'linked-list' | 'tree' | 'heap' | 'graph' | 'trie' | 'union-find' | 'array' | 'hashing' | 'two-pointers' | 'sliding-window' | 'binary-search' | 'dp' | 'lru-cache';
}

export default function Visualizers({ type }: VisualizerProps) {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Visualizer header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-sm font-mono text-slate-300 capitalize font-semibold tracking-wide">
            Interactive Node Sandbox: {type.replace('-', ' ')}
          </h4>
        </div>
        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Interactive SVG Simulation
        </span>
      </div>

      {/* Visualizer Body */}
      <div className="p-6">
        {type === 'linked-list' && <LinkedListVisualizer />}
        {type === 'tree' && <BinaryTreeVisualizer />}
        {type === 'heap' && <HeapVisualizer />}
        {type === 'graph' && <GraphVisualizer />}
        {type === 'trie' && <TrieVisualizer />}
        {type === 'union-find' && <UnionFindVisualizer />}
        {type === 'array' && <ArrayVisualizer />}
        {type === 'hashing' && <HashingVisualizer />}
        {type === 'two-pointers' && <TwoPointersVisualizer />}
        {type === 'sliding-window' && <SlidingWindowVisualizer />}
        {type === 'binary-search' && <BinarySearchVisualizer />}
        {type === 'dp' && <DpVisualizer />}
        {type === 'lru-cache' && <LruCacheVisualizer />}
      </div>
    </div>
  );
}

// ==========================================
// 1. LINKED LIST VISUALIZER
// ==========================================
function LinkedListVisualizer() {
  const [list, setList] = useState<number[]>([12, 24, 48, 96]);
  const [newValue, setNewValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('Linked List is idle. Add node or run actions.');

  const handleAdd = () => {
    const val = parseInt(newValue);
    if (isNaN(val)) return;
    setList([...list, val]);
    setNewValue('');
    setStatusText(`Added node containing value ${val} at the tail.`);
  };

  const handleDelete = (index: number) => {
    const deletedVal = list[index];
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    setStatusText(`Evicted node containing value ${deletedVal}.`);
    setActiveIndex(null);
  };

  const handleReverse = async () => {
    setStatusText('Reversing pointer links iteratively... curr.next = prev');
    for (let i = 0; i < list.length; i++) {
      setActiveIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    setList([...list].reverse());
    setActiveIndex(null);
    setStatusText('Reverse completed! Heads and tails are swapped.');
  };

  const handleSearch = async () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    setStatusText(`Traversing list nodes to search for ${val}...`);
    let found = false;
    for (let i = 0; i < list.length; i++) {
      setActiveIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (list[i] === val) {
        setStatusText(`Match located! Found ${val} at index position ${i}.`);
        found = true;
        break;
      }
    }
    if (!found) {
      setStatusText(`End of list reached! Value ${val} is not present.`);
      setActiveIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Simulation Box */}
      <div className="w-full h-48 bg-slate-950 rounded-lg flex items-center justify-start px-6 gap-2 overflow-x-auto border border-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
        {list.length === 0 ? (
          <div className="text-slate-500 font-mono text-sm mx-auto text-center">
            List is empty. Insert elements below.
          </div>
        ) : (
          list.map((val, idx) => (
            <React.Fragment key={idx}>
              <div 
                className={`relative flex items-center justify-center w-16 h-16 rounded-lg border-2 font-mono text-lg font-bold transition-all duration-300 shrink-0 ${
                  activeIndex === idx 
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 scale-105 shadow-lg shadow-emerald-950' 
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                {val}
                <button 
                  onClick={() => handleDelete(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-red-650 hover:bg-red-650 text-white rounded-full p-0.5 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-150 shadow"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
                <div className="absolute -bottom-5 text-[10px] font-mono text-slate-500">
                  idx: {idx}
                </div>
              </div>
              
              {idx < list.length - 1 && (
                <div className="flex flex-col items-center shrink-0">
                  <ArrowRight className="w-6 h-6 text-slate-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-slate-600">next</span>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Controller Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Val" 
            value={newValue} 
            onChange={e => setNewValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-sm font-mono focus:border-emerald-500 focus:outline-none"
          />
          <button 
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Push
          </button>
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Search" 
            value={searchVal} 
            onChange={e => setSearchVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-sm font-mono focus:border-emerald-500 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <Search className="w-3.5 h-3.5" /> Locate
          </button>
        </div>

        <button 
          onClick={handleReverse}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reverse pointers
        </button>

        <button 
          onClick={() => { setList([5, 10, 15, 20]); setStatusText('Reset completed.'); setActiveIndex(null); }}
          className="border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset List
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-emerald-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 2. BINARY TREE VISUALIZER
// ==========================================
interface TreeNode {
  id: number;
  val: number;
  left?: number;
  right?: number;
}

function BinaryTreeVisualizer() {
  const [treeNodes, setTreeNodes] = useState<{ [id: number]: TreeNode }>({
    1: { id: 1, val: 50, left: 2, right: 3 },
    2: { id: 2, val: 30, left: 4, right: 5 },
    3: { id: 3, val: 70 },
    4: { id: 4, val: 15 },
    5: { id: 5, val: 40 }
  });
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('Tree is loaded. Play recursive traversal DFS or BFS.');

  const playTraversal = async (type: 'pre' | 'in' | 'post') => {
    setStatusText(`Starting ${type === 'pre' ? 'Preorder (Root-L-R)' : type === 'in' ? 'Inorder (L-Root-R)' : 'Postorder (L-R-Root)'} DFS Traversal...`);
    const path: number[] = [];

    const traverse = (nodeId: number | undefined) => {
      if (!nodeId || !treeNodes[nodeId]) return;
      const current = treeNodes[nodeId];
      
      if (type === 'pre') path.push(nodeId);
      traverse(current.left);
      if (type === 'in') path.push(nodeId);
      traverse(current.right);
      if (type === 'post') path.push(nodeId);
    };

    traverse(1); // root starts at 1

    for (const step of path) {
      setActiveNode(step);
      setStatusText(`Visiting Node value: ${treeNodes[step].val}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    setActiveNode(null);
    setStatusText(`Traversed complete path of visited nodes!`);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Frame */}
      <div className="w-full h-64 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full">
          {/* Edge links */}
          {/* Root(1) coordinates: (x: 50%, y: 15%) */}
          {/* Node 2 coordinates: (x: 25%, y: 45%) */}
          {/* Node 3 coordinates: (x: 75%, y: 45%) */}
          {/* Node 4 coordinates: (x: 12.5%, y: 75%) */}
          {/* Node 5 coordinates: (x: 37.5%, y: 75%) */}
          <line x1="50%" y1="20%" x2="25%" y2="50%" stroke="#475569" strokeWidth="2" />
          <line x1="50%" y1="20%" x2="75%" y2="50%" stroke="#475569" strokeWidth="2" />
          <line x1="25%" y1="50%" x2="12.5%" y2="80%" stroke="#475569" strokeWidth="2" />
          <line x1="25%" y1="50%" x2="37.5%" y2="80%" stroke="#475569" strokeWidth="2" />

          {/* Node 1 */}
          <circle 
            cx="50%" cy="20%" r="18" 
            className={`transition-all duration-300 ${activeNode === 1 ? 'fill-emerald-800 stroke-emerald-300 stroke-2' : 'fill-slate-900 stroke-slate-700'}`} 
          />
          <text x="50%" y="22%" textAnchor="middle" fill="#f8fafc" className="font-mono text-xs font-bold font-semibold">50</text>

          {/* Node 2 */}
          <circle 
            cx="25%" cy="50%" r="18" 
            className={`transition-all duration-300 ${activeNode === 2 ? 'fill-emerald-800 stroke-emerald-300 stroke-2' : 'fill-slate-900 stroke-slate-700'}`} 
          />
          <text x="25%" y="52%" textAnchor="middle" fill="#f8fafc" className="font-mono text-xs font-bold">30</text>

          {/* Node 3 */}
          <circle 
            cx="75%" cy="50%" r="18" 
            className={`transition-all duration-300 ${activeNode === 3 ? 'fill-emerald-800 stroke-emerald-300 stroke-2' : 'fill-slate-900 stroke-slate-700'}`} 
          />
          <text x="75%" y="52%" textAnchor="middle" fill="#f8fafc" className="font-mono text-xs font-bold">70</text>

          {/* Node 4 */}
          <circle 
            cx="12.5%" cy="80%" r="18" 
            className={`transition-all duration-300 ${activeNode === 4 ? 'fill-emerald-800 stroke-emerald-300 stroke-2' : 'fill-slate-900 stroke-slate-700'}`} 
          />
          <text x="12.5%" y="82%" textAnchor="middle" fill="#f8fafc" className="font-mono text-xs font-bold">15</text>

          {/* Node 5 */}
          <circle 
            cx="37.5%" cy="80%" r="18" 
            className={`transition-all duration-300 ${activeNode === 5 ? 'fill-emerald-800 stroke-emerald-300 stroke-2' : 'fill-slate-900 stroke-slate-700'}`} 
          />
          <text x="37.5%" y="82%" textAnchor="middle" fill="#f8fafc" className="font-mono text-xs font-bold">40</text>
        </svg>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button 
          onClick={() => playTraversal('pre')} 
          className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center justify-center gap-1"
        >
          <Play className="w-3.5 h-3.5" /> Preorder DFS
        </button>
        <button 
          onClick={() => playTraversal('in')} 
          className="bg-sky-650 hover:bg-sky-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center justify-center gap-1"
        >
          <Play className="w-3.5 h-3.5" /> Inorder DFS (Sorted)
        </button>
        <button 
          onClick={() => playTraversal('post')} 
          className="bg-emerald-650 hover:bg-emerald-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center justify-center gap-1"
        >
          <Play className="w-3.5 h-3.5" /> Postorder DFS
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-sky-300 border-none">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 3. HEAP VISUALIZER
// ==========================================
function HeapVisualizer() {
  const [heap, setHeap] = useState<number[]>([15, 20, 30, 45, 55, 60]);
  const [inputValue, setInputValue] = useState<string>('');
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [statusText, setStatusText] = useState<string>('Min Heap loaded. Swap or pop roots.');

  const handlePush = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setStatusText(`Inserting value ${val} at the end of the packed array.`);
    const newHeap = [...heap, val];
    setHeap(newHeap);
    setInputValue('');

    // Heapify Up Simulation
    let child = newHeap.length - 1;
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (newHeap[child] < newHeap[parent]) {
        setStatusText(`Invariance violated! swapped position child(${newHeap[child]}) with parent(${newHeap[parent]})`);
        setSwappingIndices([child, parent]);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Swap values
        const temp = newHeap[child];
        newHeap[child] = newHeap[parent];
        newHeap[parent] = temp;
        setHeap([...newHeap]);
        child = parent;
      } else {
        break;
      }
    }
    setSwappingIndices([]);
    setStatusText(`Heapify Up completed successfully! Min Heap invariant holds.`);
  };

  const handleExtractMin = async () => {
    if (heap.length === 0) return;
    setStatusText(`Extracting minimum value ${heap[0]} from root. Swap root with the last leaf element.`);
    setSwappingIndices([0, heap.length - 1]);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newHeap = [...heap];
    const poppedValue = newHeap[0];
    const lastValue = newHeap.pop();
    if (newHeap.length > 0 && lastValue !== undefined) {
      newHeap[0] = lastValue;
      setHeap([...newHeap]);
      setStatusText('Bubble down checking from the root...');
      
      let index = 0;
      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let smallest = index;

        if (left < newHeap.length && newHeap[left] < newHeap[smallest]) smallest = left;
        if (right < newHeap.length && newHeap[right] < newHeap[smallest]) smallest = right;

        if (smallest !== index) {
          setStatusText(`Heapify Down: Swapped index(${newHeap[index]}) with smallest child(${newHeap[smallest]})`);
          setSwappingIndices([index, smallest]);
          await new Promise(resolve => setTimeout(resolve, 850));

          const temp = newHeap[index];
          newHeap[index] = newHeap[smallest];
          newHeap[smallest] = temp;
          setHeap([...newHeap]);
          index = smallest;
        } else {
          break;
        }
      }
    } else {
      setHeap([]);
    }
    setSwappingIndices([]);
    setStatusText(`Minimum element ${poppedValue} extracted successfully from root.`);
  };

  return (
    <div className="space-y-4">
      {/* Vector Visualization Panel */}
      <div className="w-full h-36 bg-slate-950 rounded-lg flex flex-col items-center justify-center p-3 border border-slate-800">
        <span className="text-xs text-slate-500 font-mono mb-2">Backing Array Representation</span>
        <div className="flex gap-1.5 overflow-x-auto max-w-full">
          {heap.map((v, i) => (
            <div 
              key={i} 
              className={`w-12 h-12 rounded border flex flex-col items-center justify-center font-mono ${
                swappingIndices.includes(i) 
                  ? 'bg-amber-950 text-amber-300 border-amber-500 scale-105' 
                  : 'bg-slate-900 text-slate-100 border-slate-700'
              }`}
            >
              <span className="text-sm font-bold">{v}</span>
              <span className="text-[9px] text-slate-600">[{i}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Heap Val" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-sm font-mono focus:border-amber-500 focus:outline-none"
          />
          <button 
            onClick={handlePush}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1 rounded text-xs font-bold"
          >
            Insert
          </button>
        </div>

        <button 
          onClick={handleExtractMin}
          className="bg-red-700 hover:bg-red-650 text-white px-4 py-1.5 rounded text-xs font-bold"
        >
          Extract Min Root
        </button>

        <button 
          onClick={() => { setHeap([10, 20, 15, 30, 45, 40]); setStatusText('Reset completed.'); setSwappingIndices([]); }}
          className="border border-slate-750 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-bold"
        >
          Reset Heap Array
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-amber-400 border-none">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 4. GRAPH VISUALIZER
// ==========================================
function GraphVisualizer() {
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeEdge, setActiveEdge] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Graph vertices loaded. Trigger traversal.');

  // Render static coordinates of 5 connected circular nodes in graph network: A, B, C, D, E.
  const handleTraverse = async (mode: 'BFS' | 'DFS') => {
    setVisitedNodes([]);
    setActiveEdge(null);
    let order: string[] = [];
    
    if (mode === 'BFS') {
      order = ['A', 'B', 'C', 'D', 'E'];
      setStatusText('Running Breadth-First-Search (BFS) via Queue queue levels...');
    } else {
      order = ['A', 'C', 'E', 'B', 'D'];
      setStatusText('Running Depth-First-Search (DFS) via Call Stack pathways...');
    }

    for (let i = 0; i < order.length; i++) {
      const node = order[i];
      setActiveSearch(node);
      await new Promise(resolve => setTimeout(resolve, 800));
      setVisitedNodes(prev => [...prev, node]);
      setStatusText(`Visited vertex node: ${node}`);
    }
    setActiveSearch(null);
    setStatusText(`${mode} simulation completed successfully! Edge loops checked.`);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Frame */}
      <div className="w-full h-64 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full">
          {/* Edges */}
          <line x1="20%" y1="30%" x2="50%" y2="20%" stroke={visitedNodes.includes('A') && visitedNodes.includes('B') ? '#10b981' : '#475569'} strokeWidth="3" />
          <line x1="20%" y1="30%" x2="35%" y2="80%" stroke={visitedNodes.includes('A') && visitedNodes.includes('C') ? '#10b981' : '#475569'} strokeWidth="3" />
          <line x1="50%" y1="20%" x2="65%" y2="80%" stroke={visitedNodes.includes('B') && visitedNodes.includes('D') ? '#10b981' : '#475569'} strokeWidth="3" />
          <line x1="35%" y1="80%" x2="80%" y2="30%" stroke={visitedNodes.includes('C') && visitedNodes.includes('E') ? '#10b981' : '#475569'} strokeWidth="3" />
          <line x1="65%" y1="80%" x2="80%" y2="30%" stroke={visitedNodes.includes('D') && visitedNodes.includes('E') ? '#10b981' : '#475569'} strokeWidth="3" />

          {/* Vertex A (20%, 30%) */}
          <circle cx="20%" cy="30%" r="20" className={`transition-all duration-300 ${activeSearch === 'A' ? 'fill-emerald-700 stroke-emerald-300 stroke-2' : visitedNodes.includes('A') ? 'fill-emerald-900 stroke-emerald-600' : 'fill-slate-900 stroke-slate-700'}`} />
          <text x="20%" y="32%" textAnchor="middle" fill="#ffffff" className="font-mono text-xs font-bold">A</text>

          {/* Vertex B (50%, 20%) */}
          <circle cx="50%" cy="20%" r="20" className={`transition-all duration-300 ${activeSearch === 'B' ? 'fill-emerald-700 stroke-emerald-300 stroke-2' : visitedNodes.includes('B') ? 'fill-emerald-900 stroke-emerald-600' : 'fill-slate-900 stroke-slate-700'}`} />
          <text x="50%" y="22%" textAnchor="middle" fill="#ffffff" className="font-mono text-xs font-bold">B</text>

          {/* Vertex C (35%, 80%) */}
          <circle cx="35%" cy="80%" r="20" className={`transition-all duration-300 ${activeSearch === 'C' ? 'fill-emerald-700 stroke-emerald-300 stroke-2' : visitedNodes.includes('C') ? 'fill-emerald-900 stroke-emerald-600' : 'fill-slate-900 stroke-slate-700'}`} />
          <text x="35%" y="82%" textAnchor="middle" fill="#ffffff" className="font-mono text-xs font-bold">C</text>

          {/* Vertex D (65%, 80%) */}
          <circle cx="65%" cy="80%" r="20" className={`transition-all duration-300 ${activeSearch === 'D' ? 'fill-emerald-700 stroke-emerald-300 stroke-2' : visitedNodes.includes('D') ? 'fill-emerald-900 stroke-emerald-600' : 'fill-slate-900 stroke-slate-700'}`} />
          <text x="65%" y="82%" textAnchor="middle" fill="#ffffff" className="font-mono text-xs font-bold">D</text>

          {/* Vertex E (80%, 30%) */}
          <circle cx="80%" cy="30%" r="20" className={`transition-all duration-300 ${activeSearch === 'E' ? 'fill-emerald-700 stroke-emerald-300 stroke-2' : visitedNodes.includes('E') ? 'fill-emerald-900 stroke-emerald-600' : 'fill-slate-900 stroke-slate-700'}`} />
          <text x="80%" y="32%" textAnchor="middle" fill="#ffffff" className="font-mono text-xs font-bold">E</text>
        </svg>
      </div>

      {/* Buttons controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button 
          onClick={() => handleTraverse('BFS')}
          className="bg-emerald-650 hover:bg-emerald-600 text-white px-4 py-2 rounded text-xs font-bold"
        >
          Queue Breadth-First BFS
        </button>
        <button 
          onClick={() => handleTraverse('DFS')}
          className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold"
        >
          Stack Depth-First DFS
        </button>
        <button 
          onClick={() => { setVisitedNodes([]); setActiveSearch(null); setStatusText('Reset completed.'); }}
          className="border border-slate-750 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded text-xs font-bold"
        >
          Reset Visited States
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-emerald-400 border-none">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 5. TRIE VISUALIZER
// ==========================================
function TrieVisualizer() {
  const [words, setWords] = useState<string[]>(['cat', 'car', 'cab']);
  const [newWord, setNewWord] = useState<string>('');
  const [highWords, setHighWords] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Trie is preloaded containing "cat", "car", "cab".');

  const insertWord = () => {
    const w = newWord.trim().toLowerCase();
    if (!w || !/^[a-z]+$/.test(w)) {
      setStatusText('Please insert letters (a-z) only.');
      return;
    }
    if (words.includes(w)) {
      setStatusText(`Word "${w}" already exists inside Trie structure.`);
      return;
    }
    setWords([...words, w]);
    setNewWord('');
    setStatusText(`Added word "${w}" into prefix node branches.`);
  };

  return (
    <div className="space-y-4">
      {/* Simulation layout */}
      <div className="w-full h-56 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-center px-6 relative">
        <span className="text-xs text-slate-500 font-mono absolute top-2 left-2">Custom Prefix Tree Tree map nodes</span>
        
        <div className="space-y-3 pt-4">
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold font-mono self-center">Inserted Words:</span>
            {words.map((w, i) => (
              <span 
                key={i} 
                className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-xs font-mono"
              >
                {w}
              </span>
            ))}
          </div>

          {/* SVG representation tree */}
          <div className="w-full h-28 flex items-center justify-center">
            <svg className="w-full h-full">
              {/* Root */}
              <circle cx="50%" cy="15%" r="10" fill="#475569" />
              <text x="50%" y="18%" textAnchor="middle" fill="#fff" className="font-mono text-[8px]">ROOT</text>

              {/* level 1: "c" */}
              <line x1="50%" y1="15%" x2="50%" y2="45%" stroke="#334155" strokeWidth="1.5" />
              <circle cx="50%" cy="45%" r="12" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="50%" y="48%" textAnchor="middle" fill="#38bdf8" className="font-mono text-xs font-bold">c</text>

              {/* level 2: "a" */}
              <line x1="50%" y1="45%" x2="50%" y2="75%" stroke="#334155" strokeWidth="1.5" />
              <circle cx="50%" cy="75%" r="12" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="50%" y="78%" textAnchor="middle" fill="#38bdf8" className="font-mono text-xs font-bold">a</text>

              {/* level 3: letters "t", "r", "b" */}
              <line x1="50%" y1="75%" x2="35%" y2="105%" stroke="#334155" strokeWidth="1.5" />
              <line x1="50%" y1="75%" x2="50%" y2="105%" stroke="#334155" strokeWidth="1.5" />
              <line x1="50%" y1="75%" x2="65%" y2="105%" stroke="#334155" strokeWidth="1.5" />

              {/* "t" */}
              <circle cx="35%" cy="105%" r="10" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
              <text x="35%" y="108%" textAnchor="middle" fill="#4ade80" className="font-mono text-[10px]">t</text>

              {/* "r" */}
              <circle cx="50%" cy="105%" r="10" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
              <text x="50%" y="108%" textAnchor="middle" fill="#4ade80" className="font-mono text-[10px]">r</text>

              {/* "b" */}
              <circle cx="65%" cy="105%" r="10" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
              <text x="65%" y="108%" textAnchor="middle" fill="#4ade80" className="font-mono text-[10px]">b</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Input panel */}
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="New lower Word (a-z)" 
          value={newWord} 
          onChange={e => setNewWord(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 text-sm font-mono focus:border-sky-500 focus:outline-none"
        />
        <button 
          onClick={insertWord}
          className="bg-sky-655 hover:bg-sky-600 text-white px-5 py-1.5 rounded text-xs font-semibold shrink-0"
        >
          Insert Word
        </button>
        <button 
          onClick={() => { setWords(['cat', 'car', 'cab']); setStatusText('Reset completed.'); }}
          className="border border-slate-755 hover:bg-slate-800 text-slate-350 px-4 py-1.5 rounded text-xs font-semibold shrink-0"
        >
          Reset
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-sky-305 border-none">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 6. UNION FIND VISUALIZER
// ==========================================
function UnionFindVisualizer() {
  const [parents, setParents] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [ranks, setRanks] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [node1, setNode1] = useState<string>('');
  const [node2, setNode2] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('6 elements created pointing parents to themselves.');

  const handleUnion = () => {
    const u = parseInt(node1);
    const v = parseInt(node2);
    if (isNaN(u) || isNaN(v) || u < 0 || u > 5 || v < 0 || v > 5) {
      setStatusText('Insert index values between 0 and 5.');
      return;
    }

    const find = (node: number): number => {
      let root = node;
      while (root !== parents[root]) {
        root = parents[root];
      }
      return root;
    };

    const rootU = find(u);
    const rootV = find(v);

    if (rootU === rootV) {
      setStatusText(`Elements ${u} and ${v} are already connected in Disjoint Set! (Root: ${rootU})`);
      return;
    }

    const nextParents = [...parents];
    const nextRanks = [...ranks];

    if (ranks[rootU] < ranks[rootV]) {
      nextParents[rootU] = rootV;
      setStatusText(`Union: Pointed parent of root ${rootU} to root ${rootV} due to smaller rank.`);
    } else if (ranks[rootU] > ranks[rootV]) {
      nextParents[rootV] = rootU;
      setStatusText(`Union: Pointed parent of root ${rootV} to root ${rootU} due to larger rank.`);
    } else {
      nextParents[rootV] = rootU;
      nextRanks[rootU]++;
      setStatusText(`Union: Connected identical ranks! Pointed ${rootV} to ${rootU}. Rank of ${rootU} increased to ${nextRanks[rootU]}.`);
    }

    setParents(nextParents);
    setRanks(nextRanks);
    setNode1('');
    setNode2('');
  };

  return (
    <div className="space-y-4">
      {/* Simulation Grid */}
      <div className="w-full h-36 bg-slate-950 rounded-lg p-4 border border-slate-800 flex items-center justify-around flex-wrap gap-2">
        {parents.map((p, i) => (
          <div 
            key={i} 
            className="w-16 h-16 bg-slate-900 border border-slate-700 rounded flex flex-col items-center justify-center font-mono text-center p-1"
          >
            <span className="text-xs text-slate-500">Node</span>
            <span className="text-base font-bold text-slate-100">{i}</span>
            <span className="text-[9px] text-emerald-400 mt-0.5">Parent: {p}</span>
          </div>
        ))}
      </div>

      {/* Input row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input 
          type="number" 
          placeholder="Element 1 (0-5)" 
          value={node1} 
          onChange={e => setNode1(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 text-sm font-mono focus:border-emerald-500 focus:outline-none"
        />
        <input 
          type="number" 
          placeholder="Element 2 (0-5)" 
          value={node2} 
          onChange={e => setNode2(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 text-sm font-mono focus:border-emerald-500 focus:outline-none"
        />
        <button 
          onClick={handleUnion}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded text-xs font-semibold"
        >
          Union sets
        </button>
        <button 
          onClick={() => { setParents([0, 1, 2, 3, 4, 5]); setRanks([0, 0, 0, 0, 0, 0]); setStatusText('Reset completed.'); }}
          className="border border-slate-750 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset Elements
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-emerald-400 border-none">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 7. ARRAY VISUALIZER
// ==========================================
function ArrayVisualizer() {
  const [arr, setArr] = useState<number[]>([15, 32, 45, 9, 21, 88]);
  const [newValue, setNewValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('Static / Dynamic array initialized.');

  const handlePush = () => {
    const val = parseInt(newValue);
    if (isNaN(val)) return;
    if (arr.length >= 10) {
      setStatusText('Maximum capacity of 10 reached (to prevent horizontal layout overflows).');
      return;
    }
    setArr([...arr, val]);
    setNewValue('');
    setStatusText(`Appended element ${val} at index ${arr.length}.`);
  };

  const handleSearch = async () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    setStatusText(`Searching for ${val} via Linear Search O(N)...`);
    let found = false;
    for (let i = 0; i < arr.length; i++) {
      setActiveIndex(i);
      await new Promise(resolve => setTimeout(resolve, 400));
      if (arr[i] === val) {
        setStatusText(`Target ${val} located successfully at index [${i}]!`);
        found = true;
        break;
      }
    }
    if (!found) {
      setStatusText(`Search complete. Element ${val} is not present inside the array.`);
      setActiveIndex(null);
    }
  };

  const handleReverse = async () => {
    setStatusText('Reversing array elements in-place with opposite pointers swaps...');
    const temp = [...arr];
    let l = 0;
    let r = temp.length - 1;
    while (l < r) {
      setActiveIndex(l);
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveIndex(r);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const swap = temp[l];
      temp[l] = temp[r];
      temp[r] = swap;
      setArr([...temp]);
      l++;
      r--;
    }
    setActiveIndex(null);
    setStatusText('In-place reversing simulation completed!');
  };

  return (
    <div className="space-y-4">
      {/* Array Blocks */}
      <div className="w-full h-36 bg-slate-950 rounded-lg flex items-center justify-center p-4 border border-slate-800">
        <div className="flex gap-2 overflow-x-auto max-w-full">
          {arr.map((val, idx) => (
            <div 
              key={idx} 
              className={`w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-all duration-300 shrink-0 ${
                activeIndex === idx 
                  ? 'bg-indigo-950 border-indigo-400 text-indigo-300 scale-105 shadow-md shadow-indigo-950' 
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <span className="text-base font-bold">{val}</span>
              <span className="text-[9px] text-slate-500">[{idx}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Val" 
            value={newValue} 
            onChange={e => setNewValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-sm font-mono focus:border-indigo-500 focus:outline-none"
          />
          <button 
            onClick={handlePush}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Append
          </button>
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Search" 
            value={searchVal} 
            onChange={e => setSearchVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-sm font-mono focus:border-indigo-500 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="bg-sky-600 hover:bg-sky-505 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <Search className="w-3.5 h-3.5" /> Find
          </button>
        </div>

        <button 
          onClick={handleReverse}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reverse arr
        </button>

        <button 
          onClick={() => { setArr([15, 32, 45, 9, 21, 88]); setStatusText('Reset completed.'); setActiveIndex(null); }}
          className="border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset Array
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-indigo-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 8. HASHING VISUALIZER
// ==========================================
interface HashEntry {
  key: string;
  val: string;
}

function HashingVisualizer() {
  const [buckets, setBuckets] = useState<{ [hash: number]: HashEntry[] }>({
    0: [{ key: 'id', val: '101' }],
    1: [],
    2: [{ key: 'age', val: '24' }],
    3: [],
    4: [{ key: 'job', val: 'SDE' }]
  });
  const [insertKey, setInsertKey] = useState<string>('');
  const [insertVal, setInsertVal] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [activeBucketIdx, setActiveBucketIdx] = useState<number | null>(null);
  const [activeEntryIdx, setActiveEntryIdx] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('Hash Table (size=5) is loaded and supports chaining collision resolution.');

  const computeHash = (key: string): number => {
    let codeSum = 0;
    for (let i = 0; i < key.length; i++) {
        codeSum += key.charCodeAt(i);
    }
    return codeSum % 5;
  };

  const handlePut = () => {
    const k = insertKey.trim();
    const v = insertVal.trim();
    if (!k || !v) return;
    
    const hash = computeHash(k);
    const chain = buckets[hash] || [];
    
    // Check if key already exists, update in-place
    const keyIdx = chain.findIndex(e => e.key === k);
    let updatedChain = [...chain];
    if (keyIdx !== -1) {
      updatedChain[keyIdx] = { key: k, val: v };
      setStatusText(`Updated key "${k}" inside collision chain at bucket [${hash}].`);
    } else {
      updatedChain.push({ key: k, val: v });
      setStatusText(`Hashed key "${k}" to index hashSum % 5 = [${hash}]. Inserted Node in chain (Count: ${updatedChain.length}).`);
    }

    setBuckets({
      ...buckets,
      [hash]: updatedChain
    });
    setInsertKey('');
    setInsertVal('');
  };

  const handleSearch = async () => {
    const k = searchKey.trim();
    if (!k) return;
    const hash = computeHash(k);
    
    setStatusText(`Hashed "${k}" to bucket [${hash}]. Inspecting chain nodes...`);
    setActiveBucketIdx(hash);
    setActiveEntryIdx(null);
    await new Promise(resolve => setTimeout(resolve, 800));

    const chain = buckets[hash] || [];
    let locatedIdx = -1;
    for (let i = 0; i < chain.length; i++) {
      setActiveEntryIdx(i);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (chain[i].key === k) {
        locatedIdx = i;
        break;
      }
    }

    if (locatedIdx !== -1) {
      setStatusText(`Found key "${k}" with value "${chain[locatedIdx].val}" inside dynamic bucket [${hash}]!`);
    } else {
      setStatusText(`Complete checking. Key "${k}" does not exist inside bucket [${hash}] chain.`);
      setActiveBucketIdx(null);
      setActiveEntryIdx(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Buckets Grid Array */}
      <div className="bg-slate-950 rounded-lg p-5 border border-slate-800 space-y-3">
        <span className="text-xs text-slate-500 font-mono block">Chaining Method Lookup (hash = asciiSum % 5)</span>
        
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map(idx => {
            const chain = buckets[idx] || [];
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-2 rounded border transition-all duration-300 ${
                  activeBucketIdx === idx 
                    ? 'bg-indigo-950/45 border-indigo-500 shadow shadow-indigo-900/50' 
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {/* Bucket marker */}
                <div className="w-10 h-8 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-300 shrink-0">
                  [{idx}]
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                {/* Nodes chains list */}
                <div className="flex gap-2 items-center overflow-x-auto py-1 max-w-full">
                  {chain.length === 0 ? (
                    <span className="text-[10px] font-mono text-slate-600 italic">null</span>
                  ) : (
                    chain.map((entry, eIdx) => (
                      <React.Fragment key={eIdx}>
                        <div 
                          className={`px-2.5 py-1 rounded border font-mono text-xs text-slate-200 flex flex-col shrink-0 ${
                            activeBucketIdx === idx && activeEntryIdx === eIdx
                              ? 'bg-indigo-905 border-indigo-400 text-indigo-200 font-bold scale-105'
                              : 'bg-slate-950 border-slate-700'
                          }`}
                        >
                          <span className="text-slate-400 text-[10px]"><span className="text-indigo-400">key:</span> {entry.key}</span>
                          <span className="text-slate-202 mt-0.5 font-semibold"><span className="text-emerald-400">val:</span> {entry.val}</span>
                        </div>
                        {eIdx < chain.length - 1 && (
                          <span className="text-slate-650 font-mono text-xs shrink-0">·next→</span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Key" 
            value={insertKey} 
            onChange={e => setInsertKey(e.target.value)}
            className="w-1/2 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
          />
          <input 
            type="text" 
            placeholder="Value" 
            value={insertVal} 
            onChange={e => setInsertVal(e.target.value)}
            className="w-1/2 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
          />
          <button 
            onClick={handlePut}
            className="bg-indigo-650 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold shrink-0"
          >
            PUT Key
          </button>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Get key lookup" 
            value={searchKey} 
            onChange={e => setSearchKey(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs font-mono focus:border-indigo-505 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="bg-sky-600 hover:bg-sky-505 text-white px-3 py-1 rounded text-xs font-semibold shrink-0"
          >
            GET Key
          </button>
        </div>

        <button 
          onClick={() => { 
            setBuckets({
              0: [{ key: 'id', val: '101' }],
              1: [],
              2: [{ key: 'age', val: '24' }],
              3: [],
              4: [{ key: 'job', val: 'SDE' }]
            }); 
            setStatusText('Hash Table reset completed.'); 
            setActiveBucketIdx(null); 
            setActiveEntryIdx(null); 
          }}
          className="border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset Buckets
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-emerald-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 9. TWO POINTERS VISUALIZER
// ==========================================
function TwoPointersVisualizer() {
  const [nums, setNums] = useState<number[]>([2, 5, 8, 12, 16, 23, 29, 35]);
  const [targetSum, setTargetSum] = useState<number>(28);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(nums.length - 1);
  const [statusText, setStatusText] = useState<string>('Goal: Find pair elements adding up to target sum 28 using opposite pointers.');
  const [found, setFound] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const handleStep = () => {
    if (finished) return;
    
    const sum = nums[left] + nums[right];
    if (sum === targetSum) {
      setFound(true);
      setFinished(true);
      setStatusText(`Located Pair! elements nums[${left}] (${nums[left]}) + nums[${right}] (${nums[right]}) equals target value ${targetSum}.`);
    } else if (sum < targetSum) {
      setStatusText(`Sum is ${sum} < target ${targetSum}. Left pointer moves inward to index ${left + 1} to increase sum.`);
      setLeft(left + 1);
      if (left + 1 >= right) {
        setFinished(true);
        setStatusText(`Browsed complete array. Target sum ${targetSum} does not exist.`);
      }
    } else {
      setStatusText(`Sum is ${sum} > target ${targetSum}. Right pointer moves inward to index ${right - 1} to decrease sum.`);
      setRight(right - 1);
      if (left >= right - 1) {
        setFinished(true);
        setStatusText(`Browsed complete array. Target sum ${targetSum} does not exist.`);
      }
    }
  };

  const handleReset = () => {
    setLeft(0);
    setRight(nums.length - 1);
    setFound(false);
    setFinished(false);
    setStatusText('Pointers reset to outer extremes.');
  };

  return (
    <div className="space-y-4">
      {/* Simulation visual display */}
      <div className="w-full h-44 bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-3">
        <span className="text-xs text-indigo-400 font-mono mb-4 font-bold">Opposite Direction Searching (Target: {targetSum})</span>
        
        <div className="flex gap-2">
          {nums.map((v, i) => {
            const isLeft = left === i;
            const isRight = right === i;
            const isBothHighlight = found && (isLeft || isRight);
            
            return (
              <div 
                key={i} 
                className={`w-14 h-14 rounded-lg border-2 flex flex-col justify-between items-center p-1 font-mono transition-all duration-300 shrink-0 ${
                  isBothHighlight
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold scale-105 shadow-md shadow-emerald-950'
                    : isLeft 
                      ? 'bg-amber-950 border-amber-400 text-amber-300 font-bold'
                      : isRight 
                        ? 'bg-indigo-950 border-indigo-400 text-indigo-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {/* Pointer indicator labels top */}
                <div className="text-[9px] h-3 uppercase font-extrabold select-none">
                  {isLeft && isRight ? 'L & R' : isLeft ? 'L-ptr' : isRight ? 'R-ptr' : ''}
                </div>
                <span className="text-base font-bold">{v}</span>
                <span className="text-[8px] text-slate-505">[{i}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button 
          onClick={handleStep}
          disabled={finished}
          className={`px-4 py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 leading-none select-none ${
            finished 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Step Pointers
        </button>

        <button 
          onClick={handleReset}
          className="border border-slate-700 hover:bg-slate-800 text-slate-330 px-4 py-2 rounded text-xs font-bold"
        >
          Reset Pointers
        </button>

        <div className="flex items-center gap-2 bg-slate-950 p-1 border border-slate-800 rounded">
          <span className="text-[10px] text-slate-505 font-mono px-2 shrink-0">Set Target:</span>
          <input 
            type="number"
            value={targetSum}
            onChange={e => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                setTargetSum(val);
                setLeft(0);
                setRight(nums.length - 1);
                setFound(false);
                setFinished(false);
                setStatusText(`Target updated to ${val}. Simulation reset.`);
              }
            }}
            className="w-full bg-slate-905 text-indigo-309 font-mono text-center text-xs focus:outline-none focus:ring-0 rounded p-1 border border-slate-800"
          />
        </div>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-amber-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 10. SLIDING WINDOW VISUALIZER
// ==========================================
function SlidingWindowVisualizer() {
  const [arr] = useState<number[]>([4, 2, 1, 7, 8, 1, 2, 8, 1, 0]);
  const [k] = useState<number>(3);
  const [start, setStart] = useState<number>(0);
  const [runningSum, setRunningSum] = useState<number>(7); // initial 4+2+1
  const [maxSum, setMaxSum] = useState<number>(7);
  const [statusText, setStatusText] = useState<string>('Goal: Locate maximum contiguous sum subarray of size K=3 using Sliding Window.');

  const handleSlide = () => {
    if (start + k >= arr.length) {
      setStatusText(`End reached! Maximum slide sum achieved represents target sum: ${maxSum}.`);
      return;
    }
    const nextStart = start + 1;
    let sum = 0;
    for (let i = nextStart; i < nextStart + k; i++) {
        sum += arr[i];
    }
    const updatedMax = Math.max(maxSum, sum);
    setStart(nextStart);
    setRunningSum(sum);
    setMaxSum(updatedMax);
    setStatusText(`Shifted window right. subArray sum is ${sum}. Best Max Sum registered is current (${updatedMax}).`);
  };

  const handleReset = () => {
    setStart(0);
    let sum = 0;
    for(let i=0; i<k; i++) sum += arr[i];
    setRunningSum(sum);
    setMaxSum(sum);
    setStatusText(`Simulated reset completed. Starting window sum of size ${k} is ${sum}.`);
  };

  return (
    <div className="space-y-4">
      {/* Simulation layout */}
      <div className="w-full h-40 bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-center">
        <span className="text-xs text-indigo-400 font-mono mb-3 block">Sub-array highlight (Window size K={k})</span>
        
        <div className="flex gap-1.5 overflow-x-auto max-w-full justify-center">
          {arr.map((val, idx) => {
            const insideWindow = idx >= start && idx < start + k;
            return (
              <div 
                key={idx} 
                className={`w-12 h-12 rounded border-2 flex flex-col justify-center items-center font-mono transition-all duration-300 shrink-0 ${
                  insideWindow 
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 scale-105 shadow-inner' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-sm font-bold">{val}</span>
                <span className="text-[8px] text-slate-605">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controllers panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button 
          onClick={handleSlide}
          className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 select-none"
        >
          <Play className="w-3.5 h-3.5" /> Slide Window ➔
        </button>

        <button 
          onClick={handleReset}
          className="border border-slate-700 hover:bg-slate-800 text-slate-350 px-4 py-2 rounded text-xs font-bold"
        >
          Reset Index
        </button>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded p-1 font-mono text-[10px] text-emerald-400 justify-center">
          <span>Active Sum: <strong className="text-white text-xs">{runningSum}</strong></span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded p-1 font-mono text-[10px] text-indigo-400 justify-center">
          <span>Max Sum Tracked: <strong className="text-white text-xs">{maxSum}</strong></span>
        </div>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-emerald-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 11. BINARY SEARCH VISUALIZER
// ==========================================
function BinarySearchVisualizer() {
  const [sorted] = useState<number[]>([4, 9, 15, 22, 28, 35, 42, 51, 60, 71, 88, 95]);
  const [target, setTarget] = useState<number>(35);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(sorted.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('Binary Search loaded. Goal: Locate target 35 using divide and conquer.');
  const [found, setFound] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const handleStep = () => {
    if (found || failed) return;
    
    if (low > high) {
      setFailed(true);
      setStatusText(`Bounds crossed! low(${low}) > high(${high}). Element not present.`);
      return;
    }

    const currentMid = Math.floor(low + (high - low) / 2);
    setMid(currentMid);
    
    if (sorted[currentMid] === target) {
      setFound(true);
      setStatusText(`Found Match at mid index [${currentMid}]! sorted[${currentMid}] contains value ${target}.`);
    } else if (sorted[currentMid] < target) {
      setStatusText(`Value ${sorted[currentMid]} is less than target ${target}. Pruning left half! Shift low to mid + 1 = [${currentMid + 1}].`);
      setLow(currentMid + 1);
    } else {
      setStatusText(`Value ${sorted[currentMid]} is greater than target ${target}. Pruning right half! Shift high to mid - 1 = [${currentMid - 1}].`);
      setHigh(currentMid - 1);
    }
  };

  const handleReset = () => {
    setLow(0);
    setHigh(sorted.length - 1);
    setMid(null);
    setFound(false);
    setFailed(false);
    setStatusText(`Simulation reset. Seeking target ${target} inside sorted sequence.`);
  };

  return (
    <div className="space-y-4">
      {/* Simulation display */}
      <div className="w-full h-40 bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-center">
        <span className="text-xs text-indigo-400 font-mono mb-3 block">Pruned Elements dim out as boundaries shrink</span>
        
        <div className="flex gap-1 overflow-x-auto max-w-full justify-center">
          {sorted.map((val, idx) => {
            const isPruned = idx < low || idx > high;
            const isMid = mid === idx;
            const isLowBound = low === idx;
            const isHighBound = high === idx;
            
            return (
              <div 
                key={idx} 
                className={`w-11 h-13 rounded flex flex-col items-center justify-between p-1 font-mono border transition-all duration-300 shrink-0 ${
                  isPruned 
                    ? 'opacity-20 bg-slate-900 border-slate-900 text-slate-705 font-bold' 
                    : isMid 
                      ? 'bg-amber-950 border-amber-400 text-amber-300 font-bold scale-105 ring-2 ring-amber-400/20' 
                      : (isLowBound || isHighBound)
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-755 text-slate-205'
                }`}
              >
                <div className="text-[7px] h-2 text-slate-500 select-none uppercase font-bold">
                  {isMid ? 'mid' : isLowBound ? 'low' : isHighBound ? 'high' : ''}
                </div>
                <span className="text-sm font-bold">{val}</span>
                <span className="text-[8px] text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controllers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button 
          onClick={handleStep}
          disabled={found || failed}
          className={`px-4 py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 select-none ${
            found || failed
              ? 'bg-slate-850 text-slate-505 cursor-not-allowed border border-slate-800'
              : 'bg-indigo-650 hover:bg-indigo-650 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Step Search
        </button>

        <button 
          onClick={handleReset}
          className="border border-slate-700 hover:bg-slate-800 text-slate-350 px-4 py-2 rounded text-xs font-bold"
        >
          Reset Bound Limits
        </button>

        <div className="flex items-center gap-2 bg-slate-950 p-1 border border-slate-800 rounded">
          <span className="text-[10px] text-slate-500 font-mono px-2 shrink-0">Set Target:</span>
          <input 
            type="number"
            value={target}
            onChange={e => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                setTarget(val);
                setLow(0);
                setHigh(sorted.length - 1);
                setMid(null);
                setFound(false);
                setFailed(false);
                setStatusText(`Target updated to ${val}. Bound limits reset.`);
              }
            }}
            className="w-full bg-slate-900 text-indigo-300 font-mono text-center text-xs focus:outline-none focus:ring-0 rounded p-1 border border-slate-850"
          />
        </div>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-emerald-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 12. DYNAMIC PROGRAMMING VISUALIZER
// ==========================================
function DpVisualizer() {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentCol, setCurrentCol] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Grid Path counting (unique paths matching top-left to coordinates (R, C) using DP Tabulation).');
  const [done, setDone] = useState<boolean>(false);

  const handleStep = () => {
    if (done) return;
    
    let nextRow = currentRow;
    let nextCol = currentCol + 1;
    if (nextCol >= 4) {
      nextCol = 0;
      nextRow = currentRow + 1;
    }

    if (nextRow >= 4) {
      setDone(true);
      setStatusText('DP matrix fully tabulated! Max paths solving bottom-right corner represents 20 paths.');
      return;
    }

    const updatedMatrix = matrix.map(row => [...row]);
    
    // Formula: DP[r][c] = (r>0 ? DP[r-1][c] : 0) + (c>0 ? DP[r][c-1] : 0)
    let paths = 0;
    let explanation = '';
    if (nextRow === 0 || nextCol === 0) {
      paths = 1; // borders are always 1
      explanation = `Cell (${nextRow}, ${nextCol}) borders limit is set to foundational value 1.`;
    } else {
      const top = updatedMatrix[nextRow - 1][nextCol];
      const left = updatedMatrix[nextRow][nextCol - 1];
      paths = top + left;
      explanation = `Computed Cell (${nextRow}, ${nextCol}): Top cell ${top} + Left cell ${left} = ${paths} paths.`;
    }

    updatedMatrix[nextRow][nextCol] = paths;
    setMatrix(updatedMatrix);
    setCurrentRow(nextRow);
    setCurrentCol(nextCol);
    setStatusText(explanation);
  };

  const handleReset = () => {
    setMatrix([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    setCurrentRow(0);
    setCurrentCol(0);
    setDone(false);
    setStatusText('DP grid is reset with foundational borders setup.');
  };

  return (
    <div className="space-y-4">
      {/* Simulation display matrix */}
      <div className="w-full bg-slate-950 rounded-lg p-5 border border-slate-800 flex flex-col items-center justify-center">
        <span className="text-xs text-indigo-400 font-mono mb-4 block">DP Matrix State values (Paths count)</span>
        
        <div className="grid grid-cols-4 gap-3 bg-slate-900 justify-center p-3 rounded-xl border border-slate-800">
          {matrix.map((rowArr, r) => 
            rowArr.map((cellVal, c) => {
              const worksCurrent = currentRow === r && currentCol === c;
              const hasComputed = cellVal > 0;
              
              return (
                <div 
                  key={`${r}-${c}`} 
                  className={`w-14 h-14 rounded-lg flex flex-col justify-center items-center font-mono border-2 transition-all duration-300 relative ${
                    worksCurrent 
                      ? 'bg-indigo-950 border-indigo-400 text-indigo-300 scale-105 ring-2 ring-indigo-400/20 shadow-md shadow-indigo-950' 
                      : hasComputed 
                        ? 'bg-slate-950 border-slate-750 text-slate-200' 
                        : 'bg-slate-900/40 border-slate-850/60 text-slate-650'
                  }`}
                >
                  <span className="text-sm font-extrabold">{cellVal}</span>
                  <span className="text-[7.5px] text-slate-505 absolute bottom-1">({r},{c})</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Button interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button 
          onClick={handleStep}
          disabled={done}
          className={`px-4 py-2.5 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 select-none ${
            done 
              ? 'bg-slate-850 text-slate-500 cursor-not-allowed border border-slate-800' 
              : 'bg-indigo-650 hover:bg-indigo-600 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Step Tabulation loop
        </button>

        <button 
          onClick={handleReset}
          className="border border-slate-700 hover:bg-slate-800 text-slate-350 px-4 py-2 rounded text-xs font-semibold"
        >
          Reset Matrix
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-indigo-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

// ==========================================
// 13. LRU CACHE VISUALIZER
// ==========================================
interface LruNode {
  key: string;
  val: string;
}

function LruCacheVisualizer() {
  const [cache, setCache] = useState<LruNode[]>([
    { key: 'user_id', val: '990' },
    { key: 'session', val: 'active' }
  ]);
  const [putKey, setPutKey] = useState<string>('');
  const [putVal, setPutVal] = useState<string>('');
  const [getKey, setGetKey] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('LRU Cache loaded (Max Capacity = 3). Least-Recently-Used entries are pushed back towards the eviction boundary.');

  const handlePut = () => {
    const k = putKey.trim().toLowerCase();
    const v = putVal.trim();
    if (!k || !v) return;

    let nextCache = [...cache];
    // Check if key already exists, move to front/MRU
    const existingIdx = nextCache.findIndex(n => n.key === k);
    if (existingIdx !== -1) {
      nextCache.splice(existingIdx, 1);
      nextCache.unshift({ key: k, val: v });
      setStatusText(`Cache HIT! Key "${k}" exists. Updated values and updated MRU positions.`);
    } else {
      if (nextCache.length >= 3) {
        const evicted = nextCache.pop();
        setStatusText(`Capacity full! Evicted Least-Recently-Used node "${evicted?.key}" to release cache memory slots.`);
      } else {
        setStatusText(`Cache MISS. Key "${k}" was created at MRU position [0].`);
      }
      nextCache.unshift({ key: k, val: v });
    }

    setCache(nextCache);
    setPutKey('');
    setPutVal('');
  };

  const handleGet = () => {
    const k = getKey.trim().toLowerCase();
    if (!k) return;

    let nextCache = [...cache];
    const existingIdx = nextCache.findIndex(n => n.key === k);
    if (existingIdx !== -1) {
      const matchNode = nextCache[existingIdx];
      // Splice and move to MRU
      nextCache.splice(existingIdx, 1);
      nextCache.unshift(matchNode);
      setStatusText(`Cache HIT! Found cached key "${k}" with value "${matchNode.val}". Relocating to MRU position.`);
      setCache(nextCache);
    } else {
      setStatusText(`Cache MISS. Key "${k}" does not reside inside cache buffers.`);
    }
    setGetKey('');
  };

  return (
    <div className="space-y-4">
      {/* Simulation display framework */}
      <div className="w-full bg-slate-950 rounded-lg p-5 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-2">
          <span className="text-slate-550">HashMap keys matching Doubly Linked Nodes</span>
          <span className="bg-slate-850 text-indigo-400 border border-slate-800 px-2 py-0.5 rounded font-bold font-mono">
            Size: {cache.length} / 3 slots
          </span>
        </div>

        <div className="w-full h-24 bg-slate-900 border border-slate-855 flex items-center justify-center gap-3 rounded-lg overflow-x-auto p-2">
          {/* Head indicator block */}
          <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-950 border border-emerald-900 rounded p-1 shrink-0 select-none">MRU / Head</span>
          
          <ArrowRight className="w-3.5 h-3.5 text-slate-505 shrink-0" />

          {cache.length === 0 ? (
            <span className="text-xs text-slate-600 font-mono italic shrink-0">Cache is completely empty.</span>
          ) : (
            cache.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 rounded-lg border-2 border-indigo-650 bg-slate-950 font-mono text-xs flex flex-col items-center shrink-0 min-w-28 relative">
                  <span className="text-indigo-405 text-[10px] uppercase font-bold text-center">Entry</span>
                  <span className="text-slate-200 mt-1"><strong className="text-emerald-400">K:</strong> {item.key}</span>
                  <span className="text-slate-355"><strong className="text-amber-400">V:</strong> {item.val}</span>
                  <span className="absolute -bottom-5 text-[8px] text-slate-550">Index [{idx}]</span>
                </div>
                {idx < cache.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            ))
          )}

          <ArrowRight className="w-3.5 h-3.5 text-slate-555 shrink-0" />

          <span className="text-[10px] font-mono text-rose-400 font-extrabold uppercase bg-rose-950 border border-rose-900 rounded p-1 shrink-0 select-none">LRU / Tail</span>
        </div>
      </div>

      {/* Inputs controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Key" 
            value={putKey} 
            onChange={e => setPutKey(e.target.value)}
            className="w-1/2 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs font-mono focus:border-indigo-505 focus:outline-none"
          />
          <input 
            type="text" 
            placeholder="Val" 
            value={putVal} 
            onChange={e => setPutVal(e.target.value)}
            className="w-1/2 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs font-mono focus:border-indigo-505 focus:outline-none"
          />
          <button 
            onClick={handlePut}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1 rounded text-xs font-semibold shrink-0"
          >
            PUT Key
          </button>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Get cached lookup" 
            value={getKey} 
            onChange={e => setGetKey(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs font-mono focus:border-indigo-505 focus:outline-none"
          />
          <button 
            onClick={handleGet}
            className="bg-sky-600 hover:bg-sky-505 text-white px-3.5 py-1 rounded text-xs font-semibold shrink-0"
          >
            GET Key
          </button>
        </div>

        <button 
          onClick={() => { setCache([{ key: 'user_id', val: '990' }, { key: 'session', val: 'active' }]); setStatusText('Reset completed.'); }}
          className="border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset Cache
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-rose-400">Logger:</strong> {statusText}
      </p>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
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
  val: number;
  left: number | null;
  right: number | null;
}

function BinaryTreeVisualizer() {
  const [tree, setTree] = useState<{ [val: number]: TreeNode }>({
    50: { val: 50, left: 30, right: 70 },
    30: { val: 30, left: 15, right: 40 },
    70: { val: 70, left: null, right: null },
    15: { val: 15, left: null, right: null },
    40: { val: 40, left: null, right: null },
  });
  const [rootVal, setRootVal] = useState<number | null>(50);
  const [insertVal, setInsertVal] = useState<string>('');
  
  // Simulation states
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [simSteps, setSimSteps] = useState<{ node: number; text: string }[]>([]);
  const [simIndex, setSimIndex] = useState<number>(-1);
  const [statusText, setStatusText] = useState<string>('BST is loaded. Perform insertions or run step-by-step traversals.');

  // Render nodes coordinates dynamically based on tree structure using recursive depth-first
  const getCoordinates = () => {
    const coords: { [val: number]: { x: number; y: number } } = {};
    const layout = (val: number | null, xStart: number, xEnd: number, y: number) => {
      if (val === null || !tree[val]) return;
      const x = (xStart + xEnd) / 2;
      coords[val] = { x, y };
      layout(tree[val].left, xStart, x, y + 55);
      layout(tree[val].right, x, xEnd, y + 55);
    };
    if (rootVal !== null) {
      layout(rootVal, 20, 580, 40);
    }
    return coords;
  };

  const coords = getCoordinates();

  // Handlers for traversals
  const startTraversal = (type: 'pre' | 'in' | 'post' | 'bfs') => {
    if (rootVal === null) {
      setStatusText('Tree is empty!');
      return;
    }

    const steps: { node: number; text: string }[] = [];
    
    if (type === 'bfs') {
      const queue: number[] = [rootVal];
      while (queue.length > 0) {
        const curr = queue.shift()!;
        steps.push({ node: curr, text: `BFS Queue pops node ${curr}. Visit this layer element.` });
        const nodeObj = tree[curr];
        if (nodeObj.left !== null) queue.push(nodeObj.left);
        if (nodeObj.right !== null) queue.push(nodeObj.right);
      }
    } else {
      const traverse = (val: number | null) => {
        if (val === null || !tree[val]) return;
        const nodeObj = tree[val];
        if (type === 'pre') steps.push({ node: val, text: `Preorder visit (Root-L-R): Process node ${val} before children.` });
        traverse(nodeObj.left);
        if (type === 'in') steps.push({ node: val, text: `Inorder visit (L-Root-R): Process node ${val} in sorted order.` });
        traverse(nodeObj.right);
        if (type === 'post') steps.push({ node: val, text: `Postorder visit (L-R-Root): Process node ${val} after subtrees are navigated.` });
      };
      traverse(rootVal);
    }

    setSimSteps(steps);
    setVisitedNodes([]);
    setSimIndex(0);
    setActiveNode(steps[0].node);
    setStatusText(`Initialized step-by-step ${type.toUpperCase()} traversal. Click "Next Step" to advance.`);
  };

  const handleNextStep = () => {
    if (simIndex < 0 || simIndex >= simSteps.length) return;
    const currentStep = simSteps[simIndex];
    setVisitedNodes(prev => [...prev, currentStep.node]);
    setActiveNode(currentStep.node);
    setStatusText(currentStep.text);

    if (simIndex === simSteps.length - 1) {
      setStatusText(`Traversal completed! Visited path: ${[...visitedNodes, currentStep.node].join(' -> ')}`);
      setSimIndex(-1);
    } else {
      setSimIndex(prev => prev + 1);
    }
  };

  // BST Insertion with a simulated visual comparison step
  const handleInsert = async () => {
    const val = parseInt(insertVal);
    if (isNaN(val)) return;
    if (tree[val]) {
      setStatusText(`Value ${val} already exists in the BST!`);
      return;
    }
    
    setInsertVal('');
    if (rootVal === null) {
      setTree({ [val]: { val, left: null, right: null } });
      setRootVal(val);
      setStatusText(`Root of BST was null. Created root node with value ${val}.`);
      return;
    }

    setStatusText(`Simulating comparison sequence to insert ${val} in BST...`);
    let curr = rootVal;
    const path: number[] = [];
    
    while (curr !== null) {
      path.push(curr);
      setActiveNode(curr);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (val < curr) {
        setStatusText(`Comparing: ${val} < ${curr}. Decentered to Left node boundary.`);
        const next = tree[curr].left;
        if (next === null) {
          // Perform insertion
          setTree(prev => ({
            ...prev,
            [curr]: { ...prev[curr], left: val },
            [val]: { val, left: null, right: null }
          }));
          break;
        }
        curr = next;
      } else {
        setStatusText(`Comparing: ${val} >= ${curr}. Decentered to Right node boundary.`);
        const next = tree[curr].right;
        if (next === null) {
          setTree(prev => ({
            ...prev,
            [curr]: { ...prev[curr], right: val },
            [val]: { val, left: null, right: null }
          }));
          break;
        }
        curr = next;
      }
    }
    
    setActiveNode(val);
    setStatusText(`Inserted node containing value ${val} underneath its parent element.`);
    setTimeout(() => setActiveNode(null), 1200);
  };

  const handleReset = () => {
    setTree({
      50: { val: 50, left: 30, right: 70 },
      30: { val: 30, left: 15, right: 40 },
      70: { val: 70, left: null, right: null },
      15: { val: 15, left: null, right: null },
      40: { val: 40, left: null, right: null },
    });
    setRootVal(50);
    setActiveNode(null);
    setVisitedNodes([]);
    setSimSteps([]);
    setSimIndex(-1);
    setStatusText('Tree has been reset to base BST skeleton.');
  };

  return (
    <div className="space-y-4">
      {/* Simulation Frame */}
      <div className="w-full h-72 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
        {rootVal === null ? (
          <div className="text-slate-500 font-mono text-sm">BST is empty. Please insert elements below.</div>
        ) : (
          <svg className="w-full h-full" id="tree-svg">
            {/* Draw edge linkage lines first */}
            {Object.keys(tree).map(nodeKey => {
              const val = parseInt(nodeKey);
              const node = tree[val];
              const fromCoords = coords[val];
              if (!fromCoords) return null;

              return (
                <React.Fragment key={`edges-${val}`}>
                  {node.left !== null && coords[node.left] && (
                    <line
                      x1={fromCoords.x}
                      y1={fromCoords.y}
                      x2={coords[node.left].x}
                      y2={coords[node.left].y}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  )}
                  {node.right !== null && coords[node.right] && (
                    <line
                      x1={fromCoords.x}
                      y1={fromCoords.y}
                      x2={coords[node.right].x}
                      y2={coords[node.right].y}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  )}
                </React.Fragment>
              );
            })}

            {/* Draw node circles with labels */}
            {Object.keys(coords).map(nodeKey => {
              const val = parseInt(nodeKey);
              const nodeCoords = coords[val];
              const isActive = activeNode === val;
              const isVisited = visitedNodes.includes(val);

              return (
                <g key={`node-${val}`} className="cursor-pointer">
                  <circle
                    cx={nodeCoords.x}
                    cy={nodeCoords.y}
                    r="16"
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'fill-indigo-800 stroke-indigo-300 stroke-2 ring-2 scale-110'
                        : isVisited
                        ? 'fill-emerald-950 stroke-emerald-500 stroke-2'
                        : 'fill-slate-900 stroke-slate-700'
                    }`}
                  />
                  <text
                    x={nodeCoords.x}
                    y={nodeCoords.y + 4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    className="font-mono text-[10px] font-bold"
                  >
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Traversal triggers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => startTraversal('pre')}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold"
        >
          Preorder DFS
        </button>
        <button
          onClick={() => startTraversal('in')}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold"
        >
          Inorder DFS
        </button>
        <button
          onClick={() => startTraversal('post')}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold"
        >
          Postorder DFS
        </button>
        <button
          onClick={() => startTraversal('bfs')}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold"
        >
          Level-Order BFS
        </button>
      </div>

      {/* Action panel & Insertion input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Val"
            value={insertVal}
            onChange={e => setInsertVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-805 rounded px-2 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleInsert}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-semibold shrink-0"
          >
            InsertBST
          </button>
        </div>

        <button
          onClick={handleNextStep}
          disabled={simIndex < 0}
          className={`px-4 py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            simIndex >= 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Next Step
        </button>

        <button
          onClick={handleReset}
          className="border border-slate-750 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset BST
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-indigo-400">Logger:</strong> {statusText}
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
  const [statusText, setStatusText] = useState<string>('Min Heap loaded. Insert node or extract min root step-by-step.');

  const getHeapNodeCoords = (i: number, total: number) => {
    const depth = Math.floor(Math.log2(i + 1));
    const levelSize = Math.pow(2, depth);
    const indexInLevel = i - (levelSize - 1);
    const y = 35 + depth * 50;
    const xFraction = (indexInLevel + 0.5) / levelSize;
    return { x: `${xFraction * 100}%`, y };
  };

  const handlePush = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    if (heap.length >= 15) {
      setStatusText('Maximum capacity of 15 elements reached to maintain tree legibility.');
      return;
    }
    
    setStatusText(`Inserting value ${val} at the end of the heap backing array.`);
    const newHeap = [...heap, val];
    setHeap(newHeap);
    setInputValue('');

    // Heapify Up Simulation
    let child = newHeap.length - 1;
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (newHeap[child] < newHeap[parent]) {
        setStatusText(`Invariance violated: child(${newHeap[child]}) < parent(${newHeap[parent]}). Swapping...`);
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
    setStatusText(`Extracting minimum value ${heap[0]} from tree root. Swapping root with last leaf.`);
    setSwappingIndices([0, heap.length - 1]);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newHeap = [...heap];
    const poppedValue = newHeap[0];
    const lastValue = newHeap.pop();
    if (newHeap.length > 0 && lastValue !== undefined) {
      newHeap[0] = lastValue;
      setHeap([...newHeap]);
      setStatusText('Heapify Down check starting from root node...');
      
      let index = 0;
      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let smallest = index;

        if (left < newHeap.length && newHeap[left] < newHeap[smallest]) smallest = left;
        if (right < newHeap.length && newHeap[right] < newHeap[smallest]) smallest = right;

        if (smallest !== index) {
          setStatusText(`Heapify Down: Swapping parent(${newHeap[index]}) with smallest child(${newHeap[smallest]})`);
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
    setStatusText(`ExtractMin complete. Popped minimum value ${poppedValue} successfully.`);
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Binary Heap Tree Visualization */}
      <div className="w-full h-56 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
        {heap.length === 0 ? (
          <div className="text-slate-500 font-mono text-sm">Heap is empty. Insert elements below.</div>
        ) : (
          <svg className="w-full h-full">
            {/* Draw edge linkage lines first */}
            {heap.map((val, idx) => {
              const left = 2 * idx + 1;
              const right = 2 * idx + 2;
              const coords = getHeapNodeCoords(idx, heap.length);
              
              return (
                <React.Fragment key={`edges-${idx}`}>
                  {left < heap.length && (
                    <line
                      x1={coords.x}
                      y1={coords.y}
                      x2={getHeapNodeCoords(left, heap.length).x}
                      y2={getHeapNodeCoords(left, heap.length).y}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  )}
                  {right < heap.length && (
                    <line
                      x1={coords.x}
                      y1={coords.y}
                      x2={getHeapNodeCoords(right, heap.length).x}
                      y2={getHeapNodeCoords(right, heap.length).y}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  )}
                </React.Fragment>
              );
            })}

            {/* Draw nodes as circles */}
            {heap.map((val, idx) => {
              const coords = getHeapNodeCoords(idx, heap.length);
              const isSwapping = swappingIndices.includes(idx);
              
              return (
                <g key={`node-${idx}`}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="15"
                    className={`transition-all duration-300 ${
                      isSwapping
                        ? 'fill-amber-800 stroke-amber-300 stroke-2 ring-2 scale-110 animate-pulse'
                        : 'fill-slate-900 stroke-slate-700'
                    }`}
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    className="font-mono text-[9px] font-bold"
                  >
                    {val}
                  </text>
                  <text
                    x={coords.x}
                    y={coords.y - 17}
                    textAnchor="middle"
                    fill="#64748b"
                    className="font-mono text-[7px]"
                  >
                    idx:{idx}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Vector Visualization Panel */}
      <div className="w-full bg-slate-950 rounded-lg flex flex-col items-center justify-center p-3 border border-slate-800">
        <span className="text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-wider">Backing Array Representation</span>
        <div className="flex gap-1.5 overflow-x-auto max-w-full">
          {heap.map((v, i) => (
            <div 
              key={i} 
              className={`w-11 h-11 rounded border flex flex-col items-center justify-center font-mono ${
                swappingIndices.includes(i) 
                  ? 'bg-amber-950 text-amber-300 border-amber-500 scale-105' 
                  : 'bg-slate-900 text-slate-100 border-slate-700'
              }`}
            >
              <span className="text-xs font-bold">{v}</span>
              <span className="text-[8px] text-slate-505">[{i}]</span>
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
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1 rounded text-xs font-bold shrink-0"
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
          onClick={() => { setHeap([15, 20, 30, 45, 55, 60]); setStatusText('Reset completed.'); setSwappingIndices([]); }}
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
  const [nodes, setNodes] = useState<{ [id: string]: { x: string; y: string } }>({
    'A': { x: '20%', y: '30%' },
    'B': { x: '50%', y: '20%' },
    'C': { x: '35%', y: '80%' },
    'D': { x: '65%', y: '80%' },
    'E': { x: '80%', y: '30%' }
  });
  const [edges, setEdges] = useState<{ u: string; v: string }[]>([
    { u: 'A', v: 'B' },
    { u: 'A', v: 'C' },
    { u: 'B', v: 'D' },
    { u: 'C', v: 'E' },
    { u: 'D', v: 'E' }
  ]);

  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  
  // Step-by-step state
  const [simSteps, setSimSteps] = useState<{ node: string; explanation: string; structure: string[] }[]>([]);
  const [simIndex, setSimIndex] = useState<number>(-1);
  const [simType, setSimType] = useState<'BFS' | 'DFS' | null>(null);
  
  const [newNodeName, setNewNodeName] = useState<string>('');
  const [newEdgeU, setNewEdgeU] = useState<string>('');
  const [newEdgeV, setNewEdgeV] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('Graph components loaded. Initialize BFS or DFS step-by-step traversal.');

  // Initialize traversal steps list
  const startTraversal = (type: 'BFS' | 'DFS') => {
    const adj: { [key: string]: string[] } = {};
    Object.keys(nodes).forEach(n => { adj[n] = []; });
    edges.forEach(({ u, v }) => {
      if (adj[u]) adj[u].push(v);
      if (adj[v]) adj[v].push(u);
    });

    // Sort to keep visited branches consistent and deterministic
    Object.keys(adj).forEach(n => { adj[n].sort(); });

    const steps: { node: string; explanation: string; structure: string[] }[] = [];
    const visited = new Set<string>();

    if (type === 'BFS') {
      const queue: string[] = ['A'];
      visited.add('A');
      while (queue.length > 0) {
        // Capture structure snapshot
        const snapshot = [...queue];
        const curr = queue.shift()!;
        steps.push({
          node: curr,
          explanation: `BFS Queue pops node ${curr}. Visiting unvisited node and expanding adjacent neighbors...`,
          structure: snapshot
        });
        
        adj[curr].forEach(neigh => {
          if (!visited.has(neigh)) {
            visited.add(neigh);
            queue.push(neigh);
          }
        });
      }
    } else {
      // DFS standard simulation steps via recursive path or call stack
      const stack: string[] = ['A'];
      while (stack.length > 0) {
        const snapshot = [...stack];
        const curr = stack.pop()!;
        if (!visited.has(curr)) {
          visited.add(curr);
          steps.push({
            node: curr,
            explanation: `DFS Stack pops node ${curr}. Processing recursively deeper, and pushing unvisited neighbors into stack.`,
            structure: snapshot
          });
          // Push neighbors in reverse order so they are processed in normal alphabetical sort
          const revNeighs = [...adj[curr]].reverse();
          revNeighs.forEach(neigh => {
            if (!visited.has(neigh)) {
              stack.push(neigh);
            }
          });
        }
      }
    }

    setSimSteps(steps);
    setVisitedNodes([]);
    setActiveSearch(steps[0].node);
    setSimIndex(0);
    setSimType(type);
    setStatusText(`Initialized ${type} traversal from starting node 'A'. Click "Next Step" to advance simulated queue/stack.`);
  };

  const handleNextStep = () => {
    if (simIndex < 0 || simIndex >= simSteps.length) return;
    const step = simSteps[simIndex];
    setActiveSearch(step.node);
    setVisitedNodes(prev => [...prev, step.node]);
    setStatusText(step.explanation);

    if (simIndex === simSteps.length - 1) {
      setStatusText(`${simType} traversal completed! Visited order path: ${[...visitedNodes, step.node].join(' -> ')}`);
      setSimIndex(-1);
      setSimType(null);
    } else {
      setSimIndex(prev => prev + 1);
    }
  };

  const handleAddNode = () => {
    const name = newNodeName.trim().toUpperCase();
    if (!name || nodes[name]) {
      setStatusText('Node label must be unique and non-empty.');
      return;
    }
    // Compute random coordinates around the center for dynamic positioning
    const x = `${20 + Math.floor(Math.random() * 60)}%`;
    const y = `${20 + Math.floor(Math.random() * 60)}%`;
    setNodes(prev => ({ ...prev, [name]: { x, y } }));
    setNewNodeName('');
    setStatusText(`Added node ${name} cleanly into graph canvas.`);
  };

  const handleAddEdge = () => {
    const u = newEdgeU.trim().toUpperCase();
    const v = newEdgeV.trim().toUpperCase();
    if (!nodes[u] || !nodes[v]) {
      setStatusText('Both source and target nodes must exist in node inventory.');
      return;
    }
    if (u === v) {
      setStatusText('Self loops are disallowed in standard interview sandboxes.');
      return;
    }
    // Verify duplicate edge
    const exists = edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    if (exists) {
      setStatusText('This edge connectivity already exists, undirected.');
      return;
    }

    setEdges(prev => [...prev, { u, v }]);
    setNewEdgeU('');
    setNewEdgeV('');
    setStatusText(`Connected node ${u} directly to node ${v}.`);
  };

  const handleReset = () => {
    setNodes({
      'A': { x: '20%', y: '30%' },
      'B': { x: '50%', y: '20%' },
      'C': { x: '35%', y: '80%' },
      'D': { x: '65%', y: '80%' },
      'E': { x: '80%', y: '30%' }
    });
    setEdges([
      { u: 'A', v: 'B' },
      { u: 'A', v: 'C' },
      { u: 'B', v: 'D' },
      { u: 'C', v: 'E' },
      { u: 'D', v: 'E' }
    ]);
    setVisitedNodes([]);
    setActiveSearch(null);
    setSimSteps([]);
    setSimIndex(-1);
    setSimType(null);
    setStatusText('Graph configurations reset to standard default state.');
  };

  const currentStepStructure = simIndex >= 0 && simIndex < simSteps.length ? simSteps[simIndex].structure : [];

  return (
    <div className="space-y-4">
      {/* Simulation Frame */}
      <div className="w-full h-64 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full">
          {/* Draw connecting edges */}
          {edges.map((e, idx) => {
            const start = nodes[e.u];
            const end = nodes[e.v];
            if (!start || !end) return null;

            const isVisitedEdge = visitedNodes.includes(e.u) && visitedNodes.includes(e.v);
            return (
              <line
                key={`edge-${idx}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isVisitedEdge ? '#10b981' : '#475569'}
                strokeWidth={isVisitedEdge ? '3' : '2'}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Draw nodes as structural SVG groups */}
          {Object.keys(nodes).map(nodeId => {
            const n = nodes[nodeId];
            const isActive = activeSearch === nodeId;
            const isVisited = visitedNodes.includes(nodeId);

            return (
              <g key={`vertex-${nodeId}`}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="18"
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'fill-indigo-805 stroke-indigo-400 stroke-2 ring-2 scale-110'
                      : isVisited
                      ? 'fill-emerald-900 stroke-emerald-600'
                      : 'fill-slate-900 stroke-slate-700'
                  }`}
                />
                <text
                  x={n.x}
                  y={parseFloat(n.y) + 1.2 + '%'}
                  textAnchor="middle"
                  fill="#ffffff"
                  className="font-mono text-xs font-bold pointer-events-none select-none"
                >
                  {nodeId}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal triggers */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button
          onClick={() => startTraversal('BFS')}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-705 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold"
        >
          Init BFS Traversal
        </button>
        <button
          onClick={() => startTraversal('DFS')}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-705 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold"
        >
          Init DFS Traversal
        </button>
        <button
          onClick={handleNextStep}
          disabled={simIndex < 0}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1 ${
            simIndex >= 0
              ? 'bg-emerald-650 hover:bg-emerald-600 text-white animate-pulse'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
          }`}
        >
          <Play className="w-3 h-3" /> Next Step
        </button>
      </div>

      {/* Dynamic Queue/Stack visual frame */}
      {simIndex >= 0 && (
        <div className="bg-slate-950 p-2.5 rounded border border-slate-805 flex flex-col justify-start gap-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400">
            Active {simType === 'BFS' ? 'Queue (FIFO)' : 'Stack (LIFO)'} Structure Snapshot:
          </span>
          <div className="flex gap-1.5 overflow-x-auto">
            {currentStepStructure.map((el, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded border flex items-center justify-center font-mono font-bold text-xs ${
                  (simType === 'BFS' && i === 0) || (simType === 'DFS' && i === currentStepStructure.length - 1)
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300 ring-1 scale-105'
                    : 'bg-slate-900 border-slate-750 text-slate-350'
                }`}
              >
                {el}
              </div>
            ))}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">
            {simType === 'BFS' 
              ? '← Node at left represents front of Queue popped next.' 
              : '← Rightmost node represents top of Stack popped next.'}
          </span>
        </div>
      )}

      {/* Inputs to build graphs dynamically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
        {/* Node controls */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Add Custom Node label</span>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={2}
              placeholder="Label (e.g. F)"
              value={newNodeName}
              onChange={e => setNewNodeName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleAddNode}
              className="bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-semibold rounded px-4 py-1"
            >
              Add Node
            </button>
          </div>
        </div>

        {/* Edge controls */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Add Directed Connections</span>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={2}
              placeholder="U"
              value={newEdgeU}
              onChange={e => setNewEdgeU(e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono text-center focus:border-indigo-500 focus:outline-none"
            />
            <span className="text-slate-500 text-sm font-bold flex items-center">to</span>
            <input
              type="text"
              maxLength={2}
              placeholder="V"
              value={newEdgeV}
              onChange={e => setNewEdgeV(e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono text-center focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleAddEdge}
              className="w-full bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-semibold rounded px-4 py-1"
            >
              Add Connection
            </button>
          </div>
        </div>
      </div>

      {/* Global Reset */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="border border-slate-750 hover:bg-slate-850 text-slate-350 px-4 py-1.5 rounded text-xs font-semibold"
        >
          Reset Graph Default
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
interface TrieNodeInstance {
  id: string;
  char: string;
  isWord: boolean;
  children: Record<string, TrieNodeInstance>;
  x: number;
  y: number;
}

function TrieVisualizer() {
  const [words, setWords] = useState<string[]>(['cat', 'car', 'cab']);
  const [newWord, setNewWord] = useState<string>('');
  const [searchWord, setSearchWord] = useState<string>('');
  const [activeHighlightNode, setActiveHighlightNode] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Dynamic Trie loaded. Insert words to grow node branches.');

  // Dynamically assemble Trie tree root
  const trieRoot = useMemo(() => {
    const root: TrieNodeInstance = { id: 'root', char: 'ROOT', isWord: false, children: {}, x: 0, y: 0 };
    let idCounter = 1;
    words.forEach(w => {
      let curr = root;
      for (let i = 0; i < w.length; i++) {
        const char = w[i];
        if (!curr.children[char]) {
          curr.children[char] = {
            id: `node-${idCounter++}-${char}`,
            char,
            isWord: false,
            children: {},
            x: 0,
            y: 0
          };
        }
        curr = curr.children[char];
        if (i === w.length - 1) curr.isWord = true;
      }
    });

    // Layout the coordinates recursively
    const layout = (node: TrieNodeInstance, xStart: number, xEnd: number, y: number, depth: number) => {
      node.x = (xStart + xEnd) / 2;
      node.y = y;
      
      const childKeys = Object.keys(node.children).sort();
      if (childKeys.length === 0) return;
      
      const span = (xEnd - xStart) / childKeys.length;
      childKeys.forEach((char, idx) => {
        layout(
          node.children[char],
          xStart + idx * span,
          xStart + (idx + 1) * span,
          y + 45,
          depth + 1
        );
      });
    };

    layout(root, 20, 580, 25, 0);
    return root;
  }, [words]);

  // Collect flat list of nodes and links for rendering SVG elegantly
  const collectNodesAndLinks = () => {
    const nodesList: TrieNodeInstance[] = [];
    const linksList: { fromX: number; fromY: number; toX: number; toY: number }[] = [];

    const traverse = (node: TrieNodeInstance) => {
      nodesList.push(node);
      Object.keys(node.children).forEach(char => {
        const child = node.children[char];
        linksList.push({
          fromX: node.x,
          fromY: node.y,
          toX: child.x,
          toY: child.y
        });
        traverse(child);
      });
    };

    traverse(trieRoot);
    return { nodesList, linksList };
  };

  const { nodesList, linksList } = collectNodesAndLinks();

  const insertWord = () => {
    const w = newWord.trim().toLowerCase();
    if (!w || !/^[a-z]+$/.test(w)) {
      setStatusText('Please insert letters (a-z) only.');
      return;
    }
    if (words.includes(w)) {
      setStatusText(`Word "${w}" already exists in the Trie!`);
      return;
    }
    if (w.length > 5) {
      setStatusText('Keep word length <= 5 to maintain visualization layout bounds.');
      return;
    }
    
    setWords(prev => [...prev, w]);
    setNewWord('');
    setStatusText(`Added word "${w}" into the Prefix Tree. Visually re-orienting subtree nodes.`);
  };

  const handleSearch = async () => {
    const target = searchWord.trim().toLowerCase();
    if (!target) return;
    setStatusText(`Searching prefix path for string: "${target}"...`);
    setSearchWord('');
    
    let curr = trieRoot;
    let found = true;
    
    for (let i = 0; i < target.length; i++) {
      const char = target[i];
      if (curr.children[char]) {
        curr = curr.children[char];
        setActiveHighlightNode(curr.id);
        setStatusText(`Letter '${char}' found at depth ${i + 1}.`);
        await new Promise(resolve => setTimeout(resolve, 700));
      } else {
        found = false;
        setStatusText(`Mismatch encountered! Prefix sequence "${target}" does not exist in Trie.`);
        break;
      }
    }

    if (found && curr.isWord) {
      setStatusText(`Found full word path matching: "${target}"! (Marked green in the visualization)`);
    } else if (found) {
      setStatusText(`Matched prefix sequence "${target}", but this node isn't configured as a terminal word.`);
    }

    setTimeout(() => {
      setActiveHighlightNode(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Simulation layout */}
      <div className="w-full h-64 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between p-3">
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase text-slate-500 font-bold font-mono self-center">Current Words:</span>
          {words.map((w, i) => (
            <span 
              key={i} 
              className="bg-slate-900 border border-slate-750 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono"
            >
              {w}
            </span>
          ))}
        </div>

        {/* Dynamic SVG Trie Tree map nodes */}
        <div className="w-full h-48 relative">
          <svg className="w-full h-full">
            {/* Draw edge linkages */}
            {linksList.map((l, i) => (
              <line
                key={`link-${i}`}
                x1={l.fromX}
                y1={l.fromY}
                x2={l.toX}
                y2={l.toY}
                stroke="#334155"
                strokeWidth="1.5"
              />
            ))}

            {/* Draw nodes */}
            {nodesList.map(node => {
              const isRoot = node.id === 'root';
              const isSearchActive = activeHighlightNode === node.id;
              
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isRoot ? '12' : '10'}
                    className={`transition-all duration-300 ${
                      isSearchActive
                        ? 'fill-amber-800 stroke-amber-400 stroke-2 ring-1 scale-110'
                        : node.isWord
                        ? 'fill-emerald-950 stroke-emerald-500 stroke-2'
                        : 'fill-slate-900 stroke-slate-700'
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + (isRoot ? 3 : 3.5)}
                    textAnchor="middle"
                    fill={isSearchActive ? '#fbbf24' : node.isWord ? '#34d399' : '#e2e8f0'}
                    className="font-mono text-[8px] font-bold select-none pointer-events-none"
                  >
                    {isRoot ? 'R' : node.char}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Input panel & Interactive operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Insert Custom Word</span>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. dog" 
              value={newWord} 
              onChange={e => setNewWord(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs font-mono focus:border-sky-500 focus:outline-none"
            />
            <button 
              onClick={insertWord}
              className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-1 rounded text-xs font-semibold shrink-0"
            >
              Insert
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Test Prefix Search (Animate)</span>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. cat" 
              value={searchWord} 
              onChange={e => setSearchWord(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs font-mono focus:border-amber-500 focus:outline-none"
            />
            <button 
              onClick={handleSearch}
              className="bg-amber-600 hover:bg-amber-550 text-white px-4 py-1 rounded text-xs font-semibold shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button 
          onClick={() => { setWords(['cat', 'car', 'cab']); setStatusText('Reset completed.'); }}
          className="border border-slate-755 hover:bg-slate-800 text-slate-350 px-4 py-1.5 rounded text-xs font-semibold shrink-0"
        >
          Reset Setup
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <strong className="text-sky-300">Logger:</strong> {statusText}
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
  
  // Animation/Simulation frames
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [findPath, setFindPath] = useState<number[]>([]);
  const [statusText, setStatusText] = useState<string>('Disjoint Set forest initialized with 6 elements. Perform interactive Union or find.');

  const getNodeCoords = (id: number) => {
    // Elegant hex coordinates centering the canvas
    const angle = (id * 2 * Math.PI) / 6;
    const x = 50 + Math.cos(angle) * 38;
    const y = 105 + Math.sin(angle) * 65;
    return { x: `${x}%`, y };
  };

  const handleUnion = async () => {
    const u = parseInt(node1);
    const v = parseInt(node2);
    if (isNaN(u) || isNaN(v) || u < 0 || u > 5 || v < 0 || v > 5) {
      setStatusText('Enter nodes indices values index between 0 and 5.');
      return;
    }

    setNode1('');
    setNode2('');

    if (u === v) {
      setStatusText(`Nodes are identical elements! Union ${u} and ${v} has no operation effect.`);
      return;
    }

    // Interactive step sequence: Find roots
    setStatusText(`Simulating: Union(${u}, ${v}) starts by finding representative roots...`);
    setActiveHighlight(u);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find U root
    let rootU = u;
    const pathU = [rootU];
    while (rootU !== parents[rootU]) {
      rootU = parents[rootU];
      pathU.push(rootU);
    }
    setFindPath(pathU);
    setStatusText(`Found Root of element ${u} is representative ${rootU}.`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find V root
    setActiveHighlight(v);
    let rootV = v;
    const pathV = [rootV];
    while (rootV !== parents[rootV]) {
      rootV = parents[rootV];
      pathV.push(rootV);
    }
    setFindPath(pathV);
    setStatusText(`Found Root of element ${v} is representative ${rootV}.`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (rootU === rootV) {
      setStatusText(`Representative root of both is ${rootU}. Node elements already belong to the same connected component.`);
      setFindPath([]);
      setActiveHighlight(null);
      return;
    }

    // Merge representatives by Rank rule
    const nextParents = [...parents];
    const nextRanks = [...ranks];

    if (ranks[rootU] < ranks[rootV]) {
      nextParents[rootU] = rootV;
      setStatusText(`Union: Rank of ${rootU} < Rank of ${rootV}. Parent of root ${rootU} pointed to root ${rootV}.`);
    } else if (ranks[rootU] > ranks[rootV]) {
      nextParents[rootV] = rootU;
      setStatusText(`Union: Rank of ${rootV} < Rank of ${rootU}. Parent of root ${rootV} pointed to root ${rootU}.`);
    } else {
      nextParents[rootV] = rootU;
      nextRanks[rootU]++;
      setStatusText(`Union: Identical ranks! Pointed parent root ${rootV} to root ${rootU}. Incremented Rank of root ${rootU} to ${nextRanks[rootU]}.`);
    }

    setParents(nextParents);
    setRanks(nextRanks);
    setTimeout(() => {
      setFindPath([]);
      setActiveHighlight(null);
    }, 1500);
  };

  // Pedogogical separate Find action with visual Path Compression animation!
  const handleFind = async (elementId: number) => {
    setStatusText(`Simulating: Find(${elementId}) path...`);
    setActiveHighlight(elementId);
    
    let curr = elementId;
    const path: number[] = [curr];
    while (curr !== parents[curr]) {
      curr = parents[curr];
      path.push(curr);
    }

    // Highlight the path step-by-step
    for (const step of path) {
      setActiveHighlight(step);
      setFindPath(prev => [...prev, step]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setStatusText(`Root found: ${curr}. Starting dynamic path compression to optimize tree structure!`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dynamic Compression parent updates
    const nextParents = [...parents];
    path.forEach(node => {
      nextParents[node] = curr;
    });

    setParents(nextParents);
    setStatusText(`Compressed: parent references of traversed nodes [${path.join(', ')}] have been re-routed directly to root representative ${curr}.`);
    
    setTimeout(() => {
      setActiveHighlight(null);
      setFindPath([]);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Frame */}
      <div className="w-full h-60 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full">
          {/* SVG definitions containing arrowheads */}
          <defs>
            <marker
              id="parent-arrow"
              viewBox="0 0 10 10"
              refX="17"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Draw connecting arrow vectors leading to parent nodes */}
          {parents.map((p, idx) => {
            if (p === idx) return null; // Root nodes don't point to others
            const from = getNodeCoords(idx);
            const to = getNodeCoords(p);

            const isHighlighted = findPath.includes(idx);

            return (
              <line
                key={`parent-link-${idx}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? '#10b981' : '#475569'}
                strokeWidth={isHighlighted ? '2.5' : '1.5'}
                markerEnd="url(#parent-arrow)"
                className="transition-all duration-350"
              />
            );
          })}

          {/* Draw representation node circle hexagon elements */}
          {parents.map((p, idx) => {
            const coords = getNodeCoords(idx);
            const isActive = activeHighlight === idx;
            const isPathNode = findPath.includes(idx);
            const isRepresentativeRoot = parents[idx] === idx;

            return (
              <g key={`uf-node-${idx}`} className="cursor-pointer" onClick={() => handleFind(idx)}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="15"
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'fill-indigo-800 stroke-indigo-400 stroke-2 ring-2 scale-110'
                      : isPathNode
                      ? 'fill-emerald-950 stroke-emerald-500 stroke-2'
                      : isRepresentativeRoot
                      ? 'fill-slate-900 stroke-sky-505 stroke-2'
                      : 'fill-slate-900 stroke-slate-705'
                  }`}
                />
                <text
                  x={coords.x}
                  y={coords.y + 4}
                  textAnchor="middle"
                  fill="#f8fafc"
                  className="font-mono text-xs font-bold font-semibold select-none pointer-events-none"
                >
                  {idx}
                </text>
                <text
                  x={coords.x}
                  y={coords.y - 18}
                  textAnchor="middle"
                  fill="#64748b"
                  className="font-mono text-[7px]"
                >
                  Rk:{ranks[idx]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Control interface */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input 
          type="number" 
          placeholder="Element U (0-5)" 
          value={node1} 
          onChange={e => setNode1(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 text-sm font-mono focus:border-indigo-505 focus:outline-none"
        />
        <input 
          type="number" 
          placeholder="Element V (0-5)" 
          value={node2} 
          onChange={e => setNode2(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 text-sm font-mono focus:border-indigo-505 focus:outline-none"
        />
        <button 
          onClick={handleUnion}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-xs font-bold"
        >
          Union sets
        </button>
        <button 
          onClick={() => { setParents([0, 1, 2, 3, 4, 5]); setRanks([0, 0, 0, 0, 0, 0]); setStatusText('Reset completed.'); setFindPath([]); setActiveHighlight(null); }}
          className="border border-slate-755 hover:bg-slate-800 text-slate-350 px-4 py-1.5 rounded text-xs font-semibold shrink-0"
        >
          Reset Elements
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
        <span className="text-emerald-400 font-bold">Logger:</span> {statusText}
        <span className="block mt-1.5 text-slate-500 text-[10px]">
          * Pro Tip: Click any node circle directly to execute `Find(X)` and visualize path compression step-by-step!
        </span>
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

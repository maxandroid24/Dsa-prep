import React, { useState } from 'react';
import { Topic } from '../types';
import { Lightbulb, ListOrdered, GraduationCap, Compass, BookOpen, ArrowRight, HelpCircle, Server } from 'lucide-react';

interface BeginnerGuideProps {
  topic: Topic;
}

interface TopicExplanation {
  analogyTitle: string;
  analogyText: string;
  whyItMatters: string;
  stepByStep: string[];
  laymanTerms: { term: string; explanation: string }[];
}

// Complete library of custom absolute beginner explanations
const BEGINNER_LIBRARY: Record<string, TopicExplanation> = {
  'scalability-basics': {
    analogyTitle: 'The Hamburger Stand 🍔',
    analogyText: 'Imagine you run a super popular hamburger stand with one chef and one small grill. Today, a bus with 100 hungry tourists pulls up. \n\n• Vertical Scaling (Scaling Up) means buying a bigger, faster grill. But eventually, you cannot buy a grill any larger, and you still only have one chef! If that chef gets tired or the grill breaks, your business fully shuts down.\n\n• Horizontal Scaling (Scaling Out) means hiring 3 more chefs and setting up 3 identical hamburger stands side-by-side. If one grill breaks, the other three keep flipping burgers!',
    whyItMatters: 'Global apps like Netflix and Google can serve billions of users across the world simultaneously without slowdowns because they use thousands of small, cheap computers connected together instead of one giant expensive computer.',
    stepByStep: [
      'A user opens their phone and makes a request (e.g., clicks "Watch Movie").',
      'The request arrives at a Load Balancer (the usher at the gate).',
      'The Load Balancer looks at the pool of available servers and redirects the request to the computer that has the least work currently.',
      'That server fetches the movie files and streams them back to your phone instantly.'
    ],
    laymanTerms: [
      { term: 'Vertical Scaling', explanation: 'Upgrading your existing computer with higher power (more RAM/CPU). Simple but has a hardware limit.' },
      { term: 'Horizontal Scaling', explanation: 'Adding more identical computers to share the work. Unlimited potential and safe from single crashes.' },
      { term: 'Stateless', explanation: 'Servers do not remember your past screen visits directly. They check a fast central locker (like Redis) so any computer can serve you.' }
    ]
  },
  'load-balancers': {
    analogyTitle: 'The Restaurant Host 🛎️',
    analogyText: 'Imagine running a very busy restaurant. If every customer just rushed through the entrance and sat at the first table they saw, they would crash into each other, and one waiter would end up with 30 tables while another waiter slept in the kitchen. \n\nInstead, you hire a smart Restaurant Host at the front door. The host greets every guest and says: "Let me guide you to Waiter 3, they have an empty table!" If Waiter 2 is sick or taking a break (Health Check fail), the host avoids sending anyone to them.',
    whyItMatters: 'It prevents any single server from getting crushed under heavy traffic while other backup servers sit completely empty and unused.',
    stepByStep: [
      'Your phone sends a request to visit a website.',
      'The request reaches the Load Balancer first before touching any app files.',
      'The Load Balancer runs a quick system algorithm (like Round-Robin, taking turns) to choose Node B.',
      'It forwards your request to Node B, gets the answer, and serves it back to you.'
    ],
    laymanTerms: [
      { term: 'Layer 4 (L4) Balancer', explanation: 'Fast router that only looks at the basic computer connection ports without reading what you typed.' },
      { term: 'Layer 7 (L7) Balancer', explanation: 'Smart router that decrypts your secure request to see what URL path you want (e.g., /checkout vs /login) and sends you to specialists.' },
      { term: 'Health Check', explanation: 'The balancer continuously pings backend servers on repeat. If a server stops replying, it is temporarily pulled from the team.' }
    ]
  },
  'http-apis': {
    analogyTitle: 'Ordering from a Menu 📋',
    analogyText: 'Suppose you walk into a Japanese sushi diner. You do not run into the kitchen and grab raw fish from the fridge yourself. Instead, you look at a standardized Menu (the API contract), choose item #4 "Salmon Roll" (URL Path), and ask the waiter (the HTTP Request). \n\nThe waiter relays this to the chef, who compiles the food and brings it back to your table in a neat bento box (the JSON Response).',
    whyItMatters: 'API standards allow separate programs (even ones written in different programming languages by different companies) to communicate seamlessly without knowing each other\'s internal code.',
    stepByStep: [
      'The client app makes an HTTP Request using standard verbs (GET for reading, POST for creating new data).',
      'The API gateway translates and authenticates your request parameters.',
      'The core server processes the request parameters and formats the requested output.',
      'The server wraps the data in standard JSON text envelopes and responds with an HTTP status code (200 for Success, 404 for Not Found).'
    ],
    laymanTerms: [
      { term: 'REST API', explanation: 'A standard menu that uses web links and typical internet methods (GET, POST, PUT, DELETE) to manage data.' },
      { term: 'gRPC', explanation: 'A super-fast, private API system used inside server databases. It matches codes directly in binary instead of sending slow text files.' },
      { term: 'JSON', explanation: 'A clear way of writing data using text keys and lists, readable by both humans and computers.' }
    ]
  },
  'cdn': {
    analogyTitle: 'Neighborhood Bookstore 📚',
    analogyText: 'Imagine everyone in Tokyo gets obsessed with a new fantasy book published in New York. If every single person in Tokyo had to fly to New York to buy the print edition from the main warehouse, flights would crash, and it would take 30 hours to read a chapter! \n\nInstead, the New York warehouse ships 10,000 copies to local bookstores in Tokyo. You just walk 5 minutes down your street and get the book instantly.',
    whyItMatters: 'Loading huge pictures and movie trailers directly from servers raw across oceans takes seconds of lag. CDNs save these files in edge cities everywhere for instant downloads.',
    stepByStep: [
      'You open a website and request a heavy image (like a movie cover banner).',
      'Your browser checks if a CDN server near your city has a saved copy of this picture.',
      'If yes (CDN Hit), it serves it to you immediately in milliseconds.',
      'If no (CDN Miss), the CDN grabs it from the primary server in America, saves a copy locally for future neighbors, and displays it to you.'
    ],
    laymanTerms: [
      { term: 'Edge Server', explanation: 'A secure computer stationed locally in cities worldwide specifically to cache files near local web users.' },
      { term: 'Origin Server', explanation: 'Your central master computer where the actual source files and primary databases reside.' },
      { term: 'Cache Expiry (TTL)', explanation: 'A timer on files. After it expires, the edge server verifies with the origin to check if files changed.' }
    ]
  },
  'caching': {
    analogyTitle: 'Sticky Desk Note 📝',
    analogyText: 'Imagine your boss calls you 100 times a day asking: "What is our company tax ID number?" Every time, you have to get up, walk to a heavy combinations-locked filing cabinet (the Database), search folders, and read it. This takes 5 minutes per call!\n\nInstead, you write the tax ID number on a sticky note (the Cache) and stick it right onto your desk monitor. Now when they call, you answer in 1 second. But if your boss updates the ID, you block outdated values by peeling off the sticky note and writing a fresh one!',
    whyItMatters: 'Websites load fast because they write common database search results on super-fast in-memory desk notes, bypassing heavy disk lookups.',
    stepByStep: [
      'A user requests info (e.g., "Show me the top trending posts").',
      'The application checks the fast Memory Cache (Redis) first.',
      'If the cache contains the list (Cache Hit), we skip the database entirely and render it.',
      'If missing (Cache Miss), we run a slow database search, write the result into the cache for next time, and show it to the user.'
    ],
    laymanTerms: [
      { term: 'Cache Hit Rate', explanation: 'The percentage of requests solved instantly by the cache without bothering the main database.' },
      { term: 'Cache Invalidation', explanation: 'Throwing away or updating cached records because the source data changed. "Hardest problem in CS!"' },
      { term: 'Eviction Policy (LRU)', explanation: 'When memory fills up, the computer automatically room-clears by deleting the Least Recently Used sticky notes.' }
    ]
  },
  'sql-vs-nosql': {
    analogyTitle: 'Excel vs. Box of Folders 📊',
    analogyText: '• SQL is like an elegant Excel spreadsheet. Every row must have the exact same columns (e.g., User ID, First Name, Birthdate). If you want to link books, you link their IDs carefully (Relationships). This is superb for banks where precision is mandatory.\n\n• NoSQL is like a cardboard box containing labeled paper folders. One folder can have 2 sheets of notes; another can have 10 photos and a drawing. It is highly flexible. Highly optimized for social feeds, chats, and fast-changing catalogs.',
    whyItMatters: 'Forcing messy dynamic data into rigid Excel layouts slows you down, while using flexible boxes for critical bank transfers risk loose, corrupt records.',
    stepByStep: [
      'Decide if your app data needs strict mathematical relationships (choose SQL) or fast unstructured flexibility (NoSQL).',
      'For SQL: Write tables with explicit columns, primary keys, and constraints.',
      'For NoSQL: Store data as standalone documents (like JSON files) or key-value pairings.',
      'Query the database using matching protocols optimized to speed either structured joins or nested document reads.'
    ],
    laymanTerms: [
      { term: 'Relational (SQL)', explanation: 'Structured storage using rows and links (foreign keys) that enforces consistency and safe transactions.' },
      { term: 'Non-Relational (NoSQL)', explanation: 'Flexible document collections with no strict schema matching, easy to scale sideways across multiple servers.' },
      { term: 'Schema', explanation: 'The strict blueprint or architecture rule specifying columns and data types allowed in database tables.' }
    ]
  },
  'replication': {
    analogyTitle: 'The backup singers 🎙️',
    analogyText: 'Suppose a main singer (the Leader Database) performs on stage and also records write files. You have two backup singers standing next to them. Whenever the main singer belts out a lyric, the backups listen and repeat it immediately.\n\nIf the main singer unexpectedly loses their voice or trips (Server Crash), one backup singer grabs the main microphone and becomes the new leader! Meanwhile, audience members can ask the backups for copies of the lyrics (scale reads).',
    whyItMatters: 'It guarantees that even if a database computer physically melts, you do not lose your customer accounts or transaction history, while also speeding up reads.',
    stepByStep: [
      'The client app writes new data to the Main Leader Database node.',
      'The Leader accepts the write and streams the actions log to Follower nodes.',
      'The Followers copy the actions into their local drives in the background.',
      'When users want to read or search, they read from the Followers, keeping the Leader free for active writes.'
    ],
    laymanTerms: [
      { term: 'Leader Node', explanation: 'The main database computer that processes incoming write updates and serves as the source of truth.' },
      { term: 'Follower (Replica)', explanation: 'Clone databases that repeat the leader\'s state to speed up searches and act as emergency backups.' },
      { term: 'Replication Lag', explanation: 'The tiny delay between the leader saving data and the followers copying it. Can show briefly stale reads.' }
    ]
  },
  'sharding': {
    analogyTitle: 'Splitting the School Records 🗄️',
    analogyText: 'Imagine a high school with 15,000 students. If you try to pack all physical student files into a single metal cabinet, the door will jam, sheets will rip, and only one secretary can search files at a time.\n\nInstead, you split the files into 3 separate cabinets:\n• Cabinet 1 (A-G Last Names)\n• Cabinet 2 (H-N Last Names)\n• Cabinet 3 (O-Z Last Names)\nNow, secretaries can search different cabinets at the same time without fighting over the drawers!',
    whyItMatters: 'Once a website grows past a certain size, its database becomes too heavy for a single physical computer drive. Sharding splits the data across multiple hardware drives.',
    stepByStep: [
      'An application determines a "Shard Key" (e.g., student\'s last name).',
      'The proxy router looks at the key and calculates which cabinet it belongs to.',
      'The router forwards the query straight to the isolated shard.',
      'The database returns the answer without searching millions of unrelated columns from other shards.'
    ],
    laymanTerms: [
      { term: 'Shard Key', explanation: 'The column parameter (like User ID or Country) used to calculate which computer gets to store your record.' },
      { term: 'Horizontal Partitioning', explanation: 'Splitting rows of a table into multiple pieces instead of splitting columns.' },
      { term: 'Hotspot Shard', explanation: 'When a shard key is chosen poorly (e.g. by Year built) and 90% of requests hit a single machine, crashing it.' }
    ]
  },
  'cap-theorem': {
    analogyTitle: 'The Broken Telephone Line ☎️',
    analogyText: 'Imagine two hotel offices: Office A in London, and Office B in Tokyo. They share room availability details over a phone wire. Suddenly, a storm cuts the telephone wire (Network Partition / P).\n\nNow, a guest walks into the London office and books the Royal Suite. The London clerk accepts it. But when a guest walks into the Tokyo office asking "Is the Royal Suite empty?":\n\n• If Tokyo says "Yes" (Availability / A), Tokyo gives fast service, but now we have duplicate booking discrepancies! (Consistency is broken).\n\n• If Tokyo says "I cannot tell you right now because my phone line is down" (Consistency / C), Tokyo protects data accuracy but denies service. (Availability is broken).',
    whyItMatters: 'In a real-world network, connections will occasionally fail. You must decide whether to stop your app during splits to keep data perfect, or keep running and fix errors later.',
    stepByStep: [
      'Two servers lose their direct communication links due to a network glitch.',
      'A change is written to Server 1.',
      'The system evaluates its configuration rules.',
      'If CP (Consistency): Server 2 shuts down or raises error reads because it cannot confirm the update. If AP (Availability): Server 2 answers with its best guess.',
    ],
    laymanTerms: [
      { term: 'Consistency (C)', explanation: 'Every computer returns identical, most-up-to-date data, at the cost of blocking queries if synchronization fails.' },
      { term: 'Availability (A)', explanation: 'Every computer remains online and returns replies instantly, even if the data is slightly outdated.' },
      { term: 'Partition Tolerance (P)', explanation: 'The system continues to run even if some internal network wiring breaks. This is mandatory in software!' }
    ]
  },
  'kafka': {
    analogyTitle: 'The Endless Conveyor Belt 🏭',
    analogyText: 'Imagine a factory with a giant circular conveyor belt. Workers (Producers) dump packages onto the belt on repeat. Each package gets stamped with a sequential number (Offsets).\n\nOther workers (Consumers) sit along the belt. Some workers grab packages very fast. Another worker is slow because they print labels. If a worker goes to lunch, they don\'t lose packages—when they return, they look at their saved clipboard number and start reading right where they stopped!',
    whyItMatters: 'It handles massive logs, millions of telemetry pings, and payment events by logging them safely onto a disk tape first so no message is ever lost.',
    stepByStep: [
      'A Producer app pushes an event record (e.g., "User clicked Add-to-Cart") onto a Kafka topic.',
      'Kafka appends the message to the end of a physical, sequential partition log on disk.',
      'The Consumer app pulls messages dynamically from Kafka at its own comfortable processing speed.',
      'The Consumer commits its progress (Offset) back to Kafka so it never repeats or skips messages.'
    ],
    laymanTerms: [
      { term: 'Topic Partition', explanation: 'A literal append-only folder on the computer\'s hard drive where messages are written in chronological sequence.' },
      { term: 'Consumer Group', explanation: 'A team of server workers who share the task of reading messages from different parts of the conveyor belt.' },
      { term: 'Offset', explanation: 'A simple index number representing how far a reader has processed messages down the line.' }
    ]
  },
  'websockets': {
    analogyTitle: 'An Open Phone Connection 📞',
    analogyText: '• Standard Web Browsing (HTTP) is like sending a postcard. You write a question, put a stamp on it, mail it, wait, and get a card back. To ask another question, you do the whole thing over again.\n\n• WebSockets are like opening a direct telephone connection. You call once, stay on the line, and can both talk, interrupt, and listen to each other instantly without buying stamps or waiting on mail runs!',
    whyItMatters: 'Essential for live services like multiplayer games, chat boxes, and stock tickers where even a 1-second delay feels broken.',
    stepByStep: [
      'The client app triggers an HTTP request with "Upgrade" handshakes.',
      'The server agrees and transitions the connection from HTTP to WebSocket TCP protocol.',
      'A permanent direct pipe remains open between the browser and that specific backend server.',
      'Either side can push message chunks instantly with near-zero header overhead.'
    ],
    laymanTerms: [
      { term: 'Handshake Upgrade', explanation: 'The initial greeting where client and server agree to switch from standard web paging to a permanent chat tunnel.' },
      { term: 'Stateful Connection', explanation: 'The server must hold onto active TCP ports in memory. Harder to scale horizontally than stateless HTTP.' },
      { term: 'Ping-Pong heartbeat', explanation: 'Small silent signals sent on repeat to make sure the connection hasn\'t disconnected or gone dead.' }
    ]
  },
  'microservices': {
    analogyTitle: 'The Restaurant Kitchen Team 🧑‍🍳',
    analogyText: '• A Monolith is like having one single chef in a kitchen. They take the order, cook the steak, bake the bread, wash the dishes, sweep the floor, and handle the register. If they slip and hurt their arm, the entire restaurant shuts down!\n\n• Microservices split the work: Chef A only cooks meat, Baker B only makes bread, C is the cashier, and D handles cleaning. If the Baker gets sick, you can still sell steaks and soda while you wait for a replacement!',
    whyItMatters: 'In huge companies like Amazon, having 5,000 developers edit a single giant app causes chaos. Microservices let small teams work on their own features independently.',
    stepByStep: [
      'An API router or Gateway receives requests from the mobile app.',
      'It parses the path (e.g., /payment redirects to Billing, /profile redirects to Account).',
      'The microservices process their isolated databases independently.',
      'If they need to talk, they call each other via lightweight, lightning-fast private API tunnels.'
    ],
    laymanTerms: [
      { term: 'API Gateway', explanation: 'The single front door that greets clients and forwards them to the right microservice department.' },
      { term: 'Service Discovery', explanation: 'The phonebook where microservices register their active server IPs so others can trace them.' },
      { term: 'Circuit Breaker', explanation: 'A safety switch. If Service A fails, the gateway trips the breaker to return defaults, saving other systems from crashing.' }
    ]
  }
};

export const BeginnerGuide: React.FC<BeginnerGuideProps> = ({ topic }) => {
  const [activeSubTab, setActiveSubTab] = useState<'analogy' | 'flow' | 'vocabulary'>('analogy');

  // Normalise Slug
  const lookupKey = topic.id;
  const guide = BEGINNER_LIBRARY[lookupKey];

  if (!guide) {
    // Generate simple on-the-fly general layman guide if not explicitly mapped
    return (
      <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          <h3 className="text-sm font-mono text-slate-200 font-bold uppercase tracking-wider">Concept Starter Guide</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Welcome! System Design is just about building smart digital piping inside applications so they can handle millions of users safely.
        </p>
        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl space-y-2">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
            <Compass className="h-3.5 w-3.5 text-blue-400" /> Summary Translation:
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {topic.summary}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-900 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <HelpCircle className="h-3.5 w-3.5 text-slate-605" />
          <span>Tip: Hover or toggle individual cards below to analyze structural schemas step-by-step.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/65 border border-slate-900/90 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Dynamic Beginner Header Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-slate-950 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-[#3b82f6]" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#3b82f6]">Layperson Translator</h4>
            <p className="text-[11px] text-slate-400 font-sans">Making complex architecture simple for absolute beginners</p>
          </div>
        </div>
        
        {/* Sub-tabs controller */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('analogy')}
            className={`px-3 py-1 text-[10px] font-mono rounded font-bold transition-all ${
              activeSubTab === 'analogy' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-slate-250'
            }`}
          >
            🍕 Real-World Analogy
          </button>
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`px-3 py-1 text-[10px] font-mono rounded font-bold transition-all ${
              activeSubTab === 'flow' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-slate-250'
            }`}
          >
            🔄 1-2-3 Step Flow
          </button>
          <button
            onClick={() => setActiveSubTab('vocabulary')}
            className={`px-3 py-1 text-[10px] font-mono rounded font-bold transition-all ${
              activeSubTab === 'vocabulary' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-slate-250'
            }`}
          >
            📖 Vocabulary Match
          </button>
        </div>
      </div>

      {/* Beginner Explanation Active Screen */}
      <div className="p-6 text-left">
        {activeSubTab === 'analogy' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-800/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="h-4 w-4 text-amber-400" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-300">
                  Like Im 5: {guide.analogyTitle}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {guide.analogyText}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-900/35 border border-slate-900 rounded-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3b82f6] font-bold block mb-1">
                Why this matters in the real world:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {guide.whyItMatters}
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'flow' && (
          <div className="space-y-4 animate-fade-in font-sans">
            <h5 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-305 flex items-center gap-1.5">
              <ListOrdered className="h-4 w-4 text-blue-400" /> Dynamic Step-by-Step Flow:
            </h5>
            
            <div className="relative border-l border-slate-800 pl-4 ml-2 space-y-5">
              {guide.stepByStep.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Number Indicator */}
                  <span className="absolute -left-[25px] top-0 h-4 w-4 rounded-full bg-[#3b82f6] text-white font-mono text-[9px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'vocabulary' && (
          <div className="space-y-4 animate-fade-in">
            <h5 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-305 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#3b82f6]" /> Deciphering Complex Buzzwords:
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.laymanTerms.map((term, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/40 border border-slate-900/85 rounded-xl space-y-1">
                  <div className="font-mono text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-[#3b82f6]" />
                    <span>{term.term}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {term.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

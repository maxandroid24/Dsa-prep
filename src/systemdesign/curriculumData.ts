import { Topic } from './types';

export const CURRICULUM_TOPICS: Topic[] = [
  // --- HLD ---
  // Core Basics
  {
    id: 'scalability-basics',
    title: 'Scalability Basics',
    track: 'HLD',
    category: 'Core Basics',
    summary: 'Mastering the core fundamentals of scale. Understanding Vertical vs. Horizontal scaling, state management, and bottlenecks in high-throughput architectures.',
    cheatSheet: [
      'Vertical scaling (Scale-up): Increase CPU/RAM on a single server. Limited by hardware ceiling, single point of failure.',
      'Horizontal scaling (Scale-out): Add more commodity servers to a pool. Highly resilient, requires load balancers.',
      'SLA/SLIs: Maintain 99.9% uptime (three nines = ~8.7 hours downtime/year).',
      'Stateless architectures: Move user sessions to Redis/JWTs so any web node can handle any request.'
    ],
    diagram: `graph TD
  Client[Client Devices] -->|Loads Web Application| SV[Single Big Server: Scale Up]
  
  style SV fill:#f43f5e,stroke:#9f1239,stroke-width:2px,color:#fff
  
  Client -->|Requests Distributed Across Pool| LB[Load Balancer]
  LB --> Web1[Web Node 1: Scale Out]
  LB --> Web2[Web Node 2: Scale Out]
  LB --> Web3[Web Node 3: Scale Out]
  
  style LB fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
  classDef nodes fill:#1e293b,stroke:#475569,stroke-width:1px,color:#cbd5e1;
  class Web1,Web2,Web3,Client nodes;`,
    components: [
      { name: 'Client Devices', role: 'Sends user traffic via HTTP/S', description: 'Triggers rendering requirements', tier: 'Client' },
      { name: 'Load Balancer', role: 'Distributes user sessions', description: 'Checks health of active nodes', tier: 'Load Balancer' },
      { name: 'Web Node Pool', role: 'Runs standard application logic', description: 'Stateless servers responding to API endpoints', tier: 'Service' }
    ],
    relationships: [
      { from: 'Client Devices', to: 'Load Balancer', label: 'Inbound requests' },
      { from: 'Load Balancer', to: 'Web Node Pool', label: 'HTTP load balancing' }
    ],
    tradeoffs: [
      {
        criteria: 'Scaling Vector',
        factorA: 'Vertical Scaling (Scale Up)',
        factorB: 'Horizontal Scaling (Scale Out)',
        valA: 'Simple, no distributed transaction complexities.',
        valB: 'Limitless capacity, highly redundant.',
        preferred: 'Horizontal is absolutely essential for long-term global platform development.'
      }
    ],
    faqs: [
      {
        question: 'What is the "shared nothing" architecture?',
        answer: 'An architecture where each node is independent and self-sufficient. There is no single central point of contention in the system (like a shared hard drive or database server) that restricts throughput.'
      },
      {
        question: 'When is it acceptable to scale vertically?',
        answer: 'For early-stage startups, simple proof-of-concepts, or micro-services with strictly bounded loads where complex database sharding or load balance overhead is overly tedious.'
      }
    ],
    resources: [
      { title: 'System Design Course: Scalability', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=SqcXyXaa_X0', youtubeId: 'SqcXyXaa_X0' },
      { title: 'An Introduction to System Scaling', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=v0I8gQG-SGs', youtubeId: 'v0I8gQG-SGs' }
    ]
  },
  {
    id: 'load-balancers',
    title: 'Load Balancers',
    track: 'HLD',
    category: 'Core Basics',
    summary: 'Deploying high-availability proxies to balance TCP/HTTP requests across standard server arrays, enhancing both throughput and network fault-tolerance.',
    cheatSheet: [
      'Layer 4 (Transport): Balances based on IP and Port. Extremely fast, low latency, no SSL termination.',
      'Layer 7 (Application): Looks at cookies, HTTP headers, paths. Performs routing decisions, rate limiting, and SSL termination.',
      'Algorithms: Round Robin, Weighted Round Robin, Least Connections, IP Hash.',
      'Hardware vs Software: Nginx/HAProxy (Software) vs F5 Networks (Hardware).'
    ],
    diagram: `graph LR
  C1[Client A] --> L7[Layer 7 Load Balancer: NGINX]
  C2[Client B] --> L7
  
  L7 -->|Headers: /api/users| S_Users[User Microservice Pool]
  L7 -->|Headers: /api/orders| S_Orders[Order Microservice Pool]
  
  style L7 fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
  style S_Users fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff
  style S_Orders fill:#8b5cf6,stroke:#6d28d9,stroke-width:1px,color:#fff`,
    components: [
      { name: 'NGINX Base', role: 'Smart Application Proxy', description: 'Evaluates REST paths and cookies', tier: 'Load Balancer' },
      { name: 'UserService', role: 'User account database handler', description: 'Manages profile edits and authentication', tier: 'Service' },
      { name: 'OrderService', role: 'Handles shopping carts and payments', description: 'Reads inventory logs', tier: 'Service' }
    ],
    relationships: [
      { from: 'NGINX Base', to: 'UserService', label: 'HTTP Proxy: /api/users' },
      { from: 'NGINX Base', to: 'OrderService', label: 'HTTP Proxy: /api/orders' }
    ],
    tradeoffs: [
      {
        criteria: 'Load Balancing Layer',
        factorA: 'Layer 4 Load Balancing',
        factorB: 'Layer 7 Load Balancing',
        valA: 'Optimal speed, small packet inspection overhead.',
        valB: 'Smart routing, SSL acceleration, authorization guards.',
        preferred: 'Use L7 for microservice micro-routing, L4 for fast edge network ingestion.'
      }
    ],
    faqs: [
      {
        question: 'What is SSL termination at the Load Balancer?',
        answer: 'The process of decrypting SSL/TLS traffic on the load balancer instead of the application servers. This reduces CPU usage on application servers, simplifying SSL certificate renewals.'
      },
      {
        question: 'How do you handle Load Balancer failure?',
        answer: 'Configure Active-Passive DNS setups or Keepalived with redundant Load Balancer nodes sharing a Virtual IP (VIP) to fail over instantly.'
      }
    ],
    resources: [
      { title: 'Software Load Balancers Explained', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=sU9ALm96-D8', youtubeId: 'sU9ALm96-D8' },
      { title: 'Load Balancers Crash Course', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=Ait83_S_qS4', youtubeId: 'Ait83_S_qS4' }
    ]
  },
  {
    id: 'http-apis',
    title: 'HTTP & APIs',
    track: 'HLD',
    category: 'Core Basics',
    summary: 'Design criteria for APIs linking microservices. Comparing RESTful designs, GraphQL, gRPC, and standard serialization envelopes (JSON, Protobuf).',
    cheatSheet: [
      'REST: Stateless, HTTP standard methods. Easy to cache, but prone to over-fetching or under-fetching.',
      'gRPC: Runs on HTTP/2. Dual-streaming, binary serialization using Protobuf. Insanely fast inner-service contracts.',
      'GraphQL: Single endpoint graph search. Client defines the response hierarchy. Solves web over-fetching.',
      'Idempotency: GET, PUT, and DELETE must be idempotent (safe to retry multiple times without altering final state).'
    ],
    diagram: `graph TD
  WebClient1[Web App REST] -->|HTTP 1.1 JSON| API_G[API Gateway]
  WebClient2[Mobile Clients] -->|GraphQL| API_G
  
  API_G -->|gRPC / Protobuf| S1[Service A: Billing]
  API_G -->|gRPC / Protobuf| S2[Service B: Inventory]
  
  style API_G fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
  style S1 fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff
  style S2 fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff`,
    components: [
      { name: 'API Gateway', role: 'Inbound Reverse Proxy', description: 'Authenticates, throttles, and routes requests', tier: 'Gateway' },
      { name: 'Billing Service', role: 'Protobuf gRPC Service', description: 'Calculates subscription invoices', tier: 'Service' }
    ],
    relationships: [
      { from: 'API Gateway', to: 'Billing Service', label: 'gRPC over HTTP/2' }
    ],
    tradeoffs: [
      {
        criteria: 'API Protocol',
        factorA: 'REST / HTTP JSON',
        factorB: 'gRPC / HTTP/2 Protobuf',
        valA: 'Highly human-readable, universal browser support.',
        valB: 'Extreme speed, compile-time strict type contract.',
        preferred: 'We prefer REST for client edge contracts and gRPC for high-speed microservice service meshes.'
      }
    ],
    faqs: [
      {
        question: 'Why is HTTP/2 crucial for gRPC efficiency?',
        answer: 'It supports multiplexing over a single TCP connection, allowing multiple concurrent requests and bi-directional streaming simultaneously without connection head-of-line blocking.'
      }
    ],
    resources: [
      { title: 'gRPC vs REST Comparison', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=gnchfO_Jpww', youtubeId: 'gnchfO_Jpww' }
    ]
  },
  {
    id: 'cdn',
    title: 'CDN (Content Delivery Network)',
    track: 'HLD',
    category: 'Core Basics',
    summary: 'Serving static content and media assets worldwide at edge servers located closer to user devices to minimize physical propagation delay.',
    cheatSheet: [
      'Edge servers (PoPs): Hundreds of globally distributed proxy servers caching static files.',
      'Origin Shield: Extra caching layer between CDN edge and the originating database.',
      'Cache Invalidation: Purge edge configs via Webhooks, Hash-tagged URLs (versioning), or TTL control.',
      'Dynamic CDN routing: Edge servers proxying web sockets or API routes for TLS acceleration.'
    ],
    diagram: `graph LR
  User[User in Tokyo] -->|Requests bundle.js| TokyoEdge[CDN Edge Tokyo]
  TokyoEdge -->|Cache Hit: Returns File| User
  TokyoEdge -.->|Cache Miss| Origin[Origin Server: us-central]
  
  style TokyoEdge fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
  style Origin fill:#f43f5e,stroke:#9f1239,stroke-width:2px,color:#fff`,
    components: [
      { name: 'Tokyo CDN Edge', role: 'Local Geo Edge Server', description: 'Caches static files close to Tokyo traffic', tier: 'Cache' },
      { name: 'Origin Cloud Bucket', role: 'Global Static Registry', description: 'Hosts baseline builds', tier: 'Database' }
    ],
    relationships: [
      { from: 'Tokyo CDN Edge', to: 'Origin Cloud Bucket', label: 'Backfill pull on Miss' }
    ],
    tradeoffs: [
      {
        criteria: 'Cache Expiry Policy',
        factorA: 'Long TTL (Cache Everything)',
        factorB: 'Zero TTL (Dynamic / Revalidate)',
        valA: 'Insanely fast speed, minimal server load.',
        valB: 'Real-time accuracy at the expense of origin hits.',
        preferred: 'Prefer hashing static filenames (e.g., logo.a8f9d.png) with infinite TTL.'
      }
    ],
    faqs: [
      {
        question: 'What is the "Thundering Herd" problem in CDN caches?',
        answer: 'When a popular item expires simultaneously, thousands of requests bypass the CDN and hit the origin server at the same time, potentially crashing the database.'
      }
    ],
    resources: [
      { title: 'How CDN works under the hood', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=IIPb_g-b87U', youtubeId: 'IIPb_g-b87U' }
    ]
  },
  {
    id: 'caching',
    title: 'Caching Strategies',
    track: 'HLD',
    category: 'Core Basics',
    summary: 'Using fast memory cache pools like Redis or Memcached to save high-load database cycles and enhance system reading latency.',
    cheatSheet: [
      'Cache-aside: App queries cache first. Yes? Return. No? Fetch DB, write cache, then return.',
      'Write-through: App writes to cache, which synchronously updates database before returning.',
      'Write-behind (Write-back): App writes to cache immediately, cache writes asynchronously to database in background.',
      'Eviction Policies: LRU (Least Recently Used), LFU (Least Frequently Used), FIFO, TTL expiration.'
    ],
    diagram: `graph TD
  App[Application Logic] -->|1. Try Cache| R_Cache[Redis Cache]
  R_Cache -->|2a. Cache Hit| App
  App -->|2b. Cache Miss: Read DB| SQL[PostgreSQL Database]
  SQL -->|3. Backfill Cache| R_Cache
  
  style R_Cache fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
  style SQL fill:#f43f5e,stroke:#9f1239,stroke-width:1px,color:#fff`,
    components: [
      { name: 'Redis Cache', role: 'In-Memory Data Store', description: 'High-speed sub-millisecond lookups', tier: 'Cache' },
      { name: 'PostgreSQL Database', role: 'Relational Persistent Store', description: 'Holds structural user records', tier: 'Database' }
    ],
    relationships: [
      { from: 'App', to: 'Redis Cache', label: 'GET key' },
      { from: 'App', to: 'PostgreSQL Database', label: 'SQL Query' }
    ],
    tradeoffs: [
      {
        criteria: 'Write Strategy',
        factorA: 'Write-Through Caching',
        factorB: 'Write-Behind Caching',
        valA: 'Guarantees complete consistency across both datasets.',
        valB: 'Extreme writing speed; DB is updated in background batches.',
        preferred: 'Use Write-Behind for non-critical logging statistics, Write-Aside/Through for financial ledgers.'
      }
    ],
    faqs: [
      {
        question: 'What is Cache Penetration?',
        answer: 'When queries are made for keys that never exist in either cache or database, causing a complete origin lookup database cycle. Solve by caching empty/null results or using a Bloom Filter.'
      }
    ],
    resources: [
      { title: 'Redis & Caching Crash Course', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=U3RkDL2sUHY', youtubeId: 'U3RkDL2sUHY' },
      { title: 'Choosing the right Cache strategy', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=zZ8Xg7U-S7Q', youtubeId: 'zZ8Xg7U-S7Q' }
    ]
  },
  {
    id: 'database-indexing',
    title: 'Database Indexing',
    track: 'HLD',
    category: 'Core Basics',
    summary: 'Accelerating lookup speeds of persistent databases using indices. Comparing B-Trees, LSM Trees, and Hash Maps.',
    cheatSheet: [
      'B-Tree Indices: Optimal for point-looks and wide range scans. Kept sorted across a balanced shallow tree.',
      'LSM (Log-Structured Merge-Tree): Appends writes to Memtable. High-speed database inserts, optimized for write-heavy loads.',
      'Composite Indexes: Multi-column order indices. Order matters due to Leftmost Prefix Rule.',
      'Cost: Slows down write operations (INSERT, UPDATE, DELETE) since the index structure must be modified synchronously.'
    ],
    diagram: `graph TD
  Query[Query: WHERE age = 22] --> B_Root[B-Tree Root: key=20]
  B_Root -->|Age >= 20| B_Right[Right Child Page]
  B_Right -->|Index Pointer| DiskRow[Data Block on Solid Disk]
  
  style B_Root fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
  classDef pages fill:#1e293b,stroke:#475569,stroke-width:1px,color:#cbd5e1;
  class B_Right,DiskRow pages;`,
    components: [
      { name: 'B-Tree Engine', role: 'Structured Lookup Optimizer', description: 'Maintains balanced memory pointers', tier: 'Database' }
    ],
    relationships: [
      { from: 'Query', to: 'B-Tree Engine', label: 'Pointer traversal' }
    ],
    tradeoffs: [
      {
        criteria: 'Index Engine',
        factorA: 'B-Tree Indexing',
        factorB: 'LSM Tree Indexing',
        valA: 'Ideal for read-heavy operations, quick point/range scans.',
        valB: 'Extreme write capabilities due to log-append merging.',
        preferred: 'Use B-Trees for standard Relational databases, and LSM trees for NoSQL database engines like Cassandra.'
      }
    ],
    faqs: [
      {
        question: 'Explain the Leftmost Prefix Rule in composite indexing.',
        answer: 'If you create a composite index on (col_a, col_b), the database can use this index for filtering on (col_a) on its own, but NOT for filtering on (col_b) on its own without (col_a), as the index is sorted by col_a first.'
      }
    ],
    resources: [
      { title: 'How Database Indexes Work', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=-qNSDKu0O88', youtubeId: '-qNSDKu0O88' }
    ]
  },

  // Data & Scaling
  {
    id: 'sql-vs-nosql',
    title: 'SQL vs NoSQL',
    track: 'HLD',
    category: 'Data & Scaling',
    summary: 'Designing data storage clusters. Comparing strict schemas, joins, and acid guarantees of SQL tables to NoSQL collections built for simple key-value lookups.',
    cheatSheet: [
      'SQL (Relational): Structured Tables, strong schemas, ACID compliant, supports complex JOIN queries.',
      'NoSQL (Document/K-V/Wide-Column): Flexible schemes, high-scaled sharding, denormalized data structures.',
      'Horizontal Scaling: SQL requires partition keys / manual sharding; NoSQL scales out of the box dynamically.',
      'Use Case: SQL for core finance platforms, billing systems. NoSQL for chat histories, clickstreams, social feeds.'
    ],
    diagram: `graph TD
  SQL[SQL: Relational Database] -->|ACID: ACID Transactions| S_Table[Tables with strict schemas and JOIN links]
  NoSQL[NoSQL: Document Store] -->|BASE: High-Throughput scale| N_Doc[JSON files with nested duplicate keys]
  
  style SQL fill:#f43f5e,stroke:#9f1239,stroke-width:1px,color:#fff
  style NoSQL fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff`,
    components: [
      { name: 'SQL Schema Engine', role: 'Enforces ACID compliance', description: 'Locks rows on updates', tier: 'Database' },
      { name: 'NoSQL Distributed Engine', role: 'Provides flexible storage', description: 'Shares data across servers', tier: 'Database' }
    ],
    relationships: [
      { from: 'SQL Schema Engine', to: 'NoSQL Distributed Engine', label: 'Data sync mirror' }
    ],
    tradeoffs: [
      {
        criteria: 'Database Paradigm',
        factorA: 'Relational DB (SQL)',
        factorB: 'Non-Relational (NoSQL)',
        valA: 'Strong ACID guarantees, clean queries without redundancy.',
        valB: 'Limitless storage capacity, simple keys layout.',
        preferred: 'Modern platforms use both: transactional SQL for billing, NoSQL for high-write feeds.'
      }
    ],
    faqs: [
      {
        question: 'What is ACID vs. BASE?',
        answer: 'ACID focuses on strict consistency (Atomicity, Consistency, Isolation, Durability). BASE focuses on eventual consistency (Basically Available, Soft state, Eventual consistency) prioritizing write speeds.'
      }
    ],
    resources: [
      { title: 'SQL vs NoSQL Database Architectures', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=ZS_kXvG35uQ', youtubeId: 'ZS_kXvG35uQ' },
      { title: 'The Ultimate DB Decisions Guide', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=bx2S-ZscR3U', youtubeId: 'bx2S-ZscR3U' }
    ]
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    track: 'HLD',
    category: 'Data & Scaling',
    summary: 'Preventing massive cash invalidations during cache scale adjustments using consistent hashing ring distributions.',
    cheatSheet: [
      'Standard Hashing: request % N servers. Changing web pool sizing (N) invalidates 99% of pre-cached items.',
      'Consistent Hashing Rin: Nodes and keys are mapped on a circle (0 - 2^32-1) using cryptographic hashes.',
      'Key Routing: Traverse clockwise on the ring to locate the first available cache server node.',
      'Virtual Nodes (VNodes): Maps single servers to multiple ring locations, distributing keys evenly.'
    ],
    diagram: `graph TD
  Ring((Hashing Ring Circle)) --- NodeA[Node A at 12:00]
  Ring --- NodeB[Node B at 04:00]
  Ring --- NodeC[Node C at 08:00]
  
  Key1[Request Key 1] -->|Hashes to 02:00| NodeB
  Key2[Request Key 2] -->|Hashes to 07:00| NodeC
  
  style NodeA fill:#3b82f6,stroke:#1d4ed8,stroke-width:1px,color:#fff
  style NodeB fill:#3b82f6,stroke:#1d4ed8,stroke-width:1px,color:#fff
  style NodeC fill:#3b82f6,stroke:#1d4ed8,stroke-width:1px,color:#fff`,
    components: [
      { name: 'Hashing Circle', role: 'Virtual Keys Mapping Location', description: 'Saves 2^32 partitions', tier: 'Cache' }
    ],
    relationships: [
      { from: 'Key1', to: 'NodeB', label: 'Clockwise search' }
    ],
    tradeoffs: [
      {
        criteria: 'Partition Mapping',
        factorA: 'Standard Hash Routing',
        factorB: 'Consistent Hash Ring',
        valA: 'Simple index lookups but completely fails on resizing.',
        valB: 'Limits re-allocations to only 1/N keys upon server resize.',
        preferred: 'Consistent Hashing is critical for dynamic scale setups.'
      }
    ],
    faqs: [
      {
        question: 'Why are Virtual Nodes essential?',
        answer: 'They prevent hotspot data imbalances ("hotspots"). If a hardware node is mapped to multiple positions, it avoids uneven clustering of data.'
      }
    ],
    resources: [
      { title: 'System Design: Consistent Hashing', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=zaRkONvyGr8', youtubeId: 'zaRkONvyGr8' }
    ]
  },
  {
    id: 'message-queues',
    title: 'Message Queues & Event-Driven Architecture',
    track: 'HLD',
    category: 'Communication & Events',
    summary: 'Implementing message queue brokers to decouple system tasks, enabling reliable asynchronous communications across microservices.',
    cheatSheet: [
      'Asynchronous Processing: Producer dumps a task on queue; Consumer picks it up whenever free.',
      'Protocols: AMQP (RabbitMQ) vs Distributed Log/Streaming (Kafka).',
      'At-Least-Once Delivery: Consumer commits progress only AFTER completing calculations.',
      'Backpressure: Temporarily stores excess payloads when consumers are overwhelmed.'
    ],
    diagram: `graph LR
  P[Producer: Checkout Service] -->|Sends task: order_created| MQ[Message Queue Broker]
  MQ -->|Pushes tasks to workers| C1[Worker 1: Payments]
  MQ -->|Pushes tasks to workers| C2[Worker 2: Email Notify]
  
  style MQ fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
  classDef nodes fill:#1e293b,stroke:#475569,stroke-width:1px,color:#cbd5e1;
  class P,C1,C2 nodes;`,
    components: [
      { name: 'Message Queue Broker', role: 'Buffers transaction records', description: 'Queues transactions sequentially', tier: 'Queue' }
    ],
    relationships: [
      { from: 'Producer: Checkout Service', to: 'Message Queue Broker', label: 'Publish event' },
      { from: 'Message Queue Broker', to: 'Worker 1: Payments', label: 'Subscribe' }
    ],
    tradeoffs: [
      {
        criteria: 'Delivery Guarantee',
        factorA: 'At-Most-Once Delivery',
        factorB: 'At-Least-Once Delivery',
        valA: 'Faster speed, minor items might be silently dropped.',
        valB: 'Zero data drops; requires idempotent deduplication filters.',
        preferred: 'At-Least-Once is standard, ensuring critical operations are never discarded.'
      }
    ],
    faqs: [
      {
        question: 'What is the main difference between RabbitMQ and Kafka?',
        answer: 'RabbitMQ is a smart message broker that routes messages to queues and deletes them once acknowledged. Kafka is a high-throughput distributed log where consumers manage their own offset pointers to read persistent files.'
      }
    ],
    resources: [
      { title: 'Kafka vs Message Queues', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=iJgGZ7S_3L8', youtubeId: 'iJgGZ7S_3L8' }
    ]
  },
  {
    id: 'rate-limiter',
    title: 'Rate Limiters',
    track: 'HLD',
    category: 'System Components',
    summary: 'Deploying rate limiters at API endpoints to throttle user request frequencies, preventing server abuse and resource starvation.',
    cheatSheet: [
      'Algorithms: Token Bucket, Leaking Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter.',
      'Token Bucket: Users burn tokens on requests; refilled at a fixed rate. Supports bursts.',
      'Leaking Bucket: Enforces a steady flow of outbound tasks. No burst support.',
      'Deployment Local vs Redis. Use Redis to track globally synchronized rate limits.'
    ],
    diagram: `graph TD
  User[Client API Request] -->|Hits Endpoint| RL[Rate Limiter Guard]
  RL -->|Check Token Slices >= 1| Approved[Route Request to Service]
  RL -->|No Tokens Left| Rejected[Return 429 Too Many Requests]
  
  style RL fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff`,
    components: [
      { name: 'Rate Limiter Guard', role: 'Inbound Interceptor', description: 'Validates API keys against threshold limits', tier: 'Gateway' }
    ],
    relationships: [
      { from: 'User', to: 'Rate Limiter Guard', label: 'Inbound Request' }
    ],
    tradeoffs: [
      {
        criteria: 'Limiting Algorithm',
        factorA: 'Token Bucket',
        factorB: 'Leaking Bucket',
        valA: 'Handles sudden traffic bursts gracefully.',
        valB: 'Enforces a constant processing rate, smoothing traffic.',
        preferred: 'Token Bucket is the standard approach for developer APIs due to its flexibility.'
      }
    ],
    faqs: [
      {
        question: 'How do you handle race conditions in multi-region rate limiters?',
        answer: 'Use Redis Lua scripts or sorted sets to write atomic increments, eliminating classic read-then-write latency issues.'
      }
    ],
    resources: [
      { title: 'Designing a Rate Limiter from scratch', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=CRGPbCbR_T0', youtubeId: 'CRGPbCbR_T0' },
      { title: 'Rate Limiter Algorithms Crash Course', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=m8M8fLYzP7I', youtubeId: 'm8M8fLYzP7I' }
    ]
  },

  // Real-World Practice Cases
  {
    id: 'url-shortener',
    title: 'URL Shortener (TinyURL)',
    track: 'HLD',
    category: 'Real-World Practice Cases',
    summary: 'Full end-to-end design of a URL shortener service. Building high-availability mappings of short key hashes to redirect strings.',
    cheatSheet: [
      'Key Generation Service (KGS): Pre-generates random 7-character string keys asynchronously, preventing runtime hash collisions.',
      'Base62 Encoding: Maps numeric sequential IDs to readable letters [a-zA-Z0-9].',
      'Read Scaling: Highly write-once, read-frequent. Use local caches (Redis) to store popular tiny keys.',
      'SQL DB vs Wide-Column Key-Value: NoSQL database like DynamoDB is perfect for lookup speed.'
    ],
    diagram: `graph LR
  User[User clicks tiny.url/x8FaB2] --> WebServer[Web Application Cluster]
  WebServer -->|1. Check Active Cache| Cache[Redis Cache]
  Cache -.->|Miss: Query DB| DB[DynamoDB Key-Value Store]
  WebServer -->|2. Receive https://google.com| Redirect[Return HTTP 302 Found]
  
  style WebServer fill:#3b82f6,stroke:#1d4ed8,stroke-width:1px,color:#fff
  style Cache fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff
  style DB fill:#f43f5e,stroke:#9f1239,stroke-width:1px,color:#fff`,
    components: [
      { name: 'Web Server', role: 'Coordinates hash parsing', description: 'Handles lookup traffic', tier: 'Service' },
      { name: 'Redis Cache', role: 'Stores hot redirect mappings', description: 'Sub-millisecond resolution redirects', tier: 'Cache' },
      { name: 'DynamoDB Map', role: 'Provides persistent storage', description: 'Key-value mapping pairs', tier: 'Database' }
    ],
    relationships: [
      { from: 'WebServer', to: 'Redis Cache', label: 'Lookup' },
      { from: 'WebServer', to: 'DynamoDB Map', label: 'Fallback fetch' }
    ],
    tradeoffs: [
      {
        criteria: 'Hash Strategy',
        factorA: 'On-The-Fly Hashing (MD5/Murmur)',
        factorB: 'Key Generation Service (KGS)',
        valA: 'Requires database lookup to handle duplicate collisions.',
        valB: 'Pre-allocates unique keys; zero lookup collisions.',
        preferred: 'Key Generation Service ensures faster speeds and simpler runtime processes.'
      }
    ],
    faqs: [
      {
        question: 'Why do we return HTTP 302 redirect code instead of 301?',
        answer: 'HTTP 301 is a permanent redirect, cached by the browser; subsequent hits bypass our server entirely. We use 302 (Temporary Redirect) to track redirect analytics.'
      }
    ],
    resources: [
      { title: 'TinyURL System Design', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=fMZMm_oF3H4', youtubeId: 'fMZMm_oF3H4' },
      { title: 'Scale TinyURL to millions of requests', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=gYp_FnoL7b8', youtubeId: 'gYp_FnoL7b8' }
    ]
  },
  {
    id: 'chat-system',
    title: 'Chat System (WhatsApp)',
    track: 'HLD',
    category: 'Real-World Practice Cases',
    summary: 'Architecting an instant messaging network supporting ultra-low latency push notifications and delivery status confirmations.',
    cheatSheet: [
      'WebSockets: Establishes a persistent TCP tunnel between client devices and routing servers.',
      'Active Sessions Tracker: Maintains an in-memory hash mapping current users to active websocket gateways.',
      'Delivery Receipts: Generates status flags (Sent -> Delivered -> Read) utilizing small backplane queue logs.',
      'NoSQL Database: MongoDB/Cassandra is ideal for maintaining ordered chat logs.'
    ],
    diagram: `graph TD
  Sender[User A] -->|1. Sends Msg via WS| Gateway[WebSocket Gateway Server]
  Gateway -->|2. Check Location| MemStore[Redis Users Location Sessions]
  Gateway -->|3. Append log| HistDB[Cassandra Chat History DB]
  
  MemStore -->|Target is Online: Push| Gateway2[WebSocket Gateway User B]
  Gateway2 -->|4. Active Transfer| Receiver[User B]
  
  style Gateway fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
  style MemStore fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff
  style HistDB fill:#f43f5e,stroke:#9f1239,stroke-width:1px,color:#fff`,
    components: [
      { name: 'WebSocket Gateway', role: 'Maintains open TCP streams', description: 'Pushes instantaneous messages', tier: 'Service' },
      { name: 'Redis Session Store', role: 'Tracks user locations', description: 'Maps IDs to connection servers', tier: 'Cache' },
      { name: 'Cassandra History DB', role: 'Stores chat archives', description: 'Optimized for fast sequential writes', tier: 'Database' }
    ],
    relationships: [
      { from: 'Sender', to: 'WebSocket Gateway', label: 'WebSocket Send' },
      { from: 'WebSocket Gateway', to: 'Redis Session Store', label: 'Query recipient destination' }
    ],
    tradeoffs: [
      {
        criteria: 'Message Database',
        factorA: 'SQL Database (PostgreSQL)',
        factorB: 'Wide-Column DB (Cassandra)',
        valA: 'Strict schemas; index and write performance degrade heavily at scale.',
        valB: 'Highly scaled performance; simple horizontal cluster expansion.',
        preferred: 'Cassandra or DynamoDB are optimal choices for storing massive chat histories.'
      }
    ],
    faqs: [
      {
        question: 'How do you handle messages sent to an offline user?',
        answer: 'The gateway identifies that the user is offline, flushes the message to the database, and publishes a task to the push notification service (FCM/APNS).'
      }
    ],
    resources: [
      { title: 'Designing a chat system like WhatsApp', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=vvhC64hQZMk', youtubeId: 'vvhC64hQZMk' },
      { title: 'How WhatsApp works under the hood', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=5mD311S_614', youtubeId: '5mD311S_614' }
    ]
  },

  // --- LLD ---
  // Core Basics LLD
  {
    id: 'solid-principles',
    title: 'SOLID Design Principles',
    track: 'LLD',
    category: 'OOD & SOLID',
    summary: 'The five core architectural criteria of clean Object-Oriented software engineering to prevent code rot and ensure flexible extensions.',
    cheatSheet: [
      'Single Responsibility (SRP): A class should have only one reason to change.',
      'Open/Closed (OCP): Classes must be open for extension, but closed for modification.',
      'Liskov Substitution (LSP): Subtypes must be completely substitutable for their supertypes.',
      'Interface Segregation (ISP): Clients should not be forced to depend upon methods they do not use.',
      'Dependency Inversion (DIP): Depend upon abstractions, not concrete classes.'
    ],
    diagram: `classDiagram
  class OrderProcessor {
    +processOrder(Order)
  }
  class INotificationChannel {
    <<interface>>
    +sendNotification(String)
  }
  class EmailNotifier {
    +sendNotification(String)
  }
  class SMSNotifier {
    +sendNotification(String)
  }
  
  OrderProcessor --> INotificationChannel : Depend On Abstraction
  INotificationChannel <|-- EmailNotifier : Implement
  INotificationChannel <|-- SMSNotifier : Implement`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Abstraction Depth',
        factorA: 'Concrete Direct Calls (No Interfaces)',
        factorB: 'Interface Polymorphism (SOLID DIP)',
        valA: 'Extremely fast to write, but tightly couples modules together.',
        valB: 'Slightly more boilerplate; allows modifications without editing base logic.',
        preferred: 'Invert dependencies whenever modules cross key application boundaries.'
      }
    ],
    faqs: [
      {
        question: 'What is a violation of Liskov Substitution Principle?',
        answer: 'A classic example is a Square class extending a Rectangle class. Since a Square forces width to equal height, it breaks the expected behavior of a generic Rectangle (setting width independently).'
      }
    ],
    resources: [
      { title: 'SOLID Software Principles Explained', creator: 'Refactoring Guru', url: 'https://refactoring.guru/design-patterns' }
    ]
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns',
    track: 'LLD',
    category: 'Design Patterns',
    summary: 'Reusable blueprints for solving recurring software design problems. Categorized into Creational, Structural, and Behavioral.',
    cheatSheet: [
      'Creational (How objects are made): Singleton, Factory Method, Abstract Factory, Builder, Prototype.',
      'Structural (How classes compose): Adapter, Decorator, Facade, Composite, Proxy.',
      'Behavioral (How objects interact): Strategy, Observer, Command, State, Iterator.'
    ],
    diagram: `classDiagram
  class Subject {
    -list Of Observers
    +attach(Observer)
    +notify()
  }
  class Observer {
    <<interface>>
    +update()
  }
  class ConcreteObserverA {
    +update()
  }
  class ConcreteObserverB {
    +update()
  }
  
  Subject --> Observer : Updates
  Observer <|-- ConcreteObserverA : Implements
  Observer <|-- ConcreteObserverB : Implements`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Pattern Usage',
        factorA: 'Strict Design Patterns',
        factorB: 'Simple Vanilla Arrays & Functions',
        valA: 'Highly standard terminology, decoupling of complex states.',
        valB: 'Easier to read for junior engineers; lightweight.',
        preferred: 'Avoid over-architecting early; apply patterns only when you identify repeating logic structures.'
      }
    ],
    faqs: [
      {
        question: 'When should you choose Strategy over State pattern?',
        answer: 'Use Strategy when you want to change algorithms at runtime independently of state (e.g., sorting). Use State when an object behaves differently based on internal status changes (e.g., Draft -> Review -> Published).'
      }
    ],
    resources: [
      { title: 'Design Patterns Core Guide', creator: 'Refactoring Guru', url: 'https://refactoring.guru/design-patterns' }
    ]
  },
  {
    id: 'parking-lot',
    title: 'Parking Lot LLD Problem',
    track: 'LLD',
    category: 'Common Case Problems',
    summary: 'A standard Low-Level interview question. Designing classes, methods, and thread-safe operations for managing multi-floor vehicle garages.',
    cheatSheet: [
      'Core Entities: ParkingLot, ParkingFloor, ParkingSpot (Compact, Large, Handicapped), Vehicle (Car, Truck, Bike), Ticket, Payment.',
      'Patterns: Singleton (for ParkingLot manager), Factory (for creating custom Vehicle instances).',
      'Thread Safety: Enforce Mutex Lock checks on `assignSpot` processes to avoid double booking.'
    ],
    diagram: `classDiagram
  class ParkingLot {
    -List Floors
    -List ActiveTickets
    +assignSpot(Vehicle)
    +releaseSpot(ParkingSpot)
  }
  class ParkingFloor {
    -int floorNumber
    -Map spots
    +findFreeSpot(VehicleType)
  }
  class ParkingSpot {
    -String spotId
    -boolean isFree
    -SpotType type
    +parkVehicle(Vehicle)
  }
  class Vehicle {
    +String licensePlate
    +VehicleType type
  }
  
  ParkingLot *-- ParkingFloor
  ParkingFloor *-- ParkingSpot
  ParkingSpot o-- Vehicle`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Concurrency Locking',
        factorA: 'Method Synchronized Locks',
        factorB: 'Concurrent Collections (ConcurrentHashMap)',
        valA: 'Simple, heavy lock contention, blocks reading threads.',
        valB: 'Highly performant concurrent reads; slight code complexity.',
        preferred: 'Use thread-safe concurrent collections to avoid blocking of check-out lanes.'
      }
    ],
    faqs: [
      {
        question: 'How do you handle scaling to multiple parking entrances?',
        answer: 'Ensure the spot assignment method is locked or uses database-level row locks (e.g., SELECT FOR UPDATE) to prevent race conditions when assigning a single spot to multiple entries.'
      }
    ],
    resources: [
      { title: 'Parking Lot Low-Level Design', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=t_K86g8dMHY', youtubeId: 't_K86g8dMHY' }
    ]
  }
];

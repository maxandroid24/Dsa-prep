import { QuizQuestion, Quiz } from './types';

export const TOPIC_QUIZZES: Record<string, QuizQuestion[]> = {
  'scalability-basics': [
    {
      id: 'scale-1',
      question: 'Which of the following describes a key limitation of vertical scaling (Scale-Up)?',
      options: [
        'It requires complex load balancers to distribute database queries.',
        'It has an upper hardware ceiling and introduces a single point of failure.',
        'It is more complex to manage than horizontal scaling in early MVP development.',
        'It requires syncing in-memory user sessions across a server pool.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Vertical scaling increases the CPU/RAM of a single machine. It is limited by hardware ceilings and represents a Single Point of Failure (SPOF).'
    },
    {
      id: 'scale-2',
      question: 'What does a "shared nothing" architecture mean in horizontal scaling?',
      options: [
        'Each server node operates completely independently, preventing shared disk or memory bottlenecks.',
        'Application instances do not share source code templates in modern Cloud-Native containers.',
        'No security secrets or environment files are shared between development and production builds.',
        'Database replicas communicate without using TCP connection sockets.'
      ],
      correctAnswerIndex: 0,
      explanation: 'In a "shared nothing" architecture, each computing node is independent and self-sufficient. There is no central point of contention in the system that restricts vertical expansion.'
    },
    {
      id: 'scale-3',
      question: 'Which strategy is preferred to make a web server pool completely stateless?',
      options: [
        'Incrementing a local in-memory counter on each web request.',
        'Moving user sessions into a shared Redis memory cache or using signed JWT tokens.',
        'Running all requests sequentially on a primary database worker thread.',
        'Disabling NGINX session stickiness to force local index synchronization.'
      ],
      correctAnswerIndex: 1,
      explanation: 'To keep web servers stateless, session state must be shifted somewhere else—such as external Redis clusters, persistent databases, or self-contained signed JWTs.'
    }
  ],
  'load-balancers': [
    {
      id: 'lb-1',
      question: 'What is a primary characteristic of a Layer 4 Load Balancer?',
      options: [
        'It inspects HTTP cookies, headers, and requested REST paths before routing.',
        'It acts as an SSL terminator, decrypting inbound HTTPS certificates.',
        'It operates at the Transport layer, balancing based on raw source/destination IP addresses and ports with minimal CPU usage.',
        'It dynamically rewrites response JSON formats to compress media files.'
      ],
      correctAnswerIndex: 2,
      explanation: 'Layer 4 Load Balancers operate at the Transport layer (TCP/UDP). They make fast routing decisions based purely on IP and Port, without inspecting application-layer details like HTTP headers.'
    },
    {
      id: 'lb-2',
      question: 'How does a Layer 7 Load Balancer make smart routing decisions?',
      options: [
        'By analysing TCP sliding window sizes on client devices.',
        'By parsing application-layer details such as HTTP request paths (/api/users), cookies, and headers.',
        'By caching DNS query records at global point-of-presence (PoP) edge servers.',
        'By routing raw Ethernet MAC addresses through hardware multiplexers.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Layer 7 load balancers operate at the Application layer. They analyze the specific incoming HTTP elements (headers, paths, cookies, URLs) to route traffic to specialized microservices.'
    },
    {
      id: 'lb-3',
      question: 'What is SSL/TLS termination at the load balancer level?',
      options: [
        'Instantly canceling any user certificates blocklisted by system security teams.',
        'The process of decrypting SSL traffic at the load balancer, relieving application servers from cryptography CPU workloads.',
        'Disabling secure communication channels once user sessions are logged in.',
        'Forcing all microservices to use custom self-signed certificates in production.'
      ],
      correctAnswerIndex: 1,
      explanation: 'SSL/TLS termination decrypts incoming secure traffic at the load balancer. The load balancer then forwards plaintext HTTP to backend microservices, reducing certificate renewal and CPU overhead on backend nodes.'
    }
  ],
  'http-apis': [
    {
      id: 'api-1',
      question: 'Which HTTP methods must be strictly idempotent according to REST design specs?',
      options: [
        'POST and DELETE',
        'POST and PUT',
        'GET, PUT, and DELETE',
        'POST and PATCH'
      ],
      correctAnswerIndex: 2,
      explanation: 'GET, PUT, and DELETE are idempotent. Multiple identical requests should have the same side effects as a single request. POST is not idempotent as it creates new resources sequentially.'
    },
    {
      id: 'api-2',
      question: 'Why is gRPC highly efficient for internal microservice communication compared to REST over JSON?',
      options: [
        'It uses raw string concatenation instead of complex structural JSON parses.',
        'It runs on HTTP/2, supports full-duplex multiplexing, and uses compact, binary Protocol Buffer serialization.',
        'It bypasses TCP/IP rules, communicating directly via hardware local fiber-optic networks.',
        'It completely eliminates the need for any api schema contracts or strict interfaces.'
      ],
      correctAnswerIndex: 1,
      explanation: 'gRPC runs on HTTP/2 (enabling multiplexed, bi-directional streams) and serializes structured payloads into compact binary Protobuf streams, making it significantly faster and lighter than HTTP/1.1 REST over text-based JSON.'
    },
    {
      id: 'api-3',
      question: 'What problem does GraphQL primarily solve for mobile and web clients?',
      options: [
        'It replaces relational database SQL triggers with stateless JSON caches.',
        'It solves client-side over-fetching and under-fetching by letting the client specify exactly which fields to return in a single query.',
        'It speeds up raw audio/video streaming files by chunking binary structures.',
        'It coordinates multi-master database replication conflicts automatically.'
      ],
      correctAnswerIndex: 1,
      explanation: 'GraphQL enables clients to request exactly what they need in a single response, eliminating the over-fetching (retrieving unused fields) and under-fetching (requiring chain API queries) common in standard REST.'
    }
  ],
  'cdn': [
    {
      id: 'cdn-1',
      question: 'What is the role of an "Origin Shield" in a Content Delivery Network context?',
      options: [
        'To prevent browser console logging leaks on client devices.',
        'An extra centralized cache layer between the CDN edge servers and the origin backend to protect the origin database from sudden thundering herd misses.',
        'A browser-level sandbox blocking cross-origin script executions.',
        'A hardwired firewall shielding the primary database from DNS attacks.'
      ],
      correctAnswerIndex: 1,
      explanation: 'An Origin Shield is an high-availability centralized cache that sits between CDN edges (Points of Presence) and the source origin server. It minimizes edge cash-miss traffic hitting the main database.'
    },
    {
      id: 'cdn-2',
      question: 'Which cache invalidation technique allows CDNs to serve updated files instantly on subsequent releases?',
      options: [
        'Setting edge TTL parameters to infinite and waiting for monthly cache sweeps.',
        'Asset versioning or URL hashing (e.g., bundle.js -> bundle.a8f9d.js), completely bypassing old cache hits.',
        'Using heavy HTTP DELETE commands to wipe ISP global routers.',
        'Wiping local browser cookies automatically via custom server headers.'
      ],
      correctAnswerIndex: 1,
      explanation: 'URL hashing or asset finger-printing changes the file name on rebuilds. Edge CDN servers treat this as a completely new resource, fetching and caching it instantly with zero invalidation lag.'
    },
    {
      id: 'cdn-3',
      question: 'What is the "Thundering Herd" problem in CDN caches?',
      options: [
        'Overwhelming physical router links due to heavy geographical weather disruptions.',
        'Concurrent requests bypassing edge locations for an expired high-demand asset, flooding the primary database origin.',
        'Slow disk reads on mechanical database hard drives.',
        'Web browsers refreshing tabs automatically on network reconnect events.'
      ],
      correctAnswerIndex: 1,
      explanation: 'The Thundering Herd occurs when a highly popular cached file expires from edge proxies simultaneously. Immediate multi-threaded requests bypass the CDN, hitting the origin web servers together and causing system degradation.'
    }
  ],
  'caching': [
    {
      id: 'cache-1',
      question: 'How does the "Cache-aside" (Lazy Loading) strategy retrieve database records?',
      options: [
        'The application writes to the database immediately and reads exclusively from disk on every cycle.',
        'The application queries the cache first. If it is a hit, returns. If a miss, it queries the database, writes the result to the cache, and then returns.',
        'The database updates the cache in-memory asynchronously using write logs.',
        'The application writes to the cache, which synchronously updates the database blockingly before executing reads.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Cache-aside is the most popular layout. The cache is queried first; on a miss, the application pulls data from the source database and populates the cache for future requests.'
    },
    {
      id: 'cache-2',
      question: 'What is Cache Penetration and how do you protect against it?',
      options: [
        'When the cache server overflows its RAM limits. Solve by switching to larger NVMe machines.',
        'When requests query keys that exist in neither cache nor database, bypassing cache guards. Solve by caching null values or using Bloom Filters.',
        'When reading speeds degrade due to high client network latencies. Solve by using a CDN.',
        'When multiple nodes update the same cached value concurrently. Solve by using distributed locks.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Cache Penetration occurs when non-existent keys are queried repeatedly, bypassing the cache entirely to hit the database. Solutions include caching null results with short TTLs or using compact Bloom Filters in-memory.'
    },
    {
      id: 'cache-3',
      question: 'In which scenario is a "Write-Behind" (Write-Back) cache strategy highly preferred?',
      options: [
        'Atomic transaction ledgers where consistency between database and cache must be 100% synchronously guaranteed.',
        'High-volume write systems (such as gaming score logs or page click analytics) where writes can be buffered in memory and batched to the database asynchronously.',
        'Read-only static file stores serving catalog contents.',
        'Websites that do not use any secondary databases.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Write-Behind updates the cache instantly and confirms write success to the user immediately, writing to the underlying database in asynchronous background batches. It maximizes write throughput at the risk of brief data loss if the cache crash before flushing.'
    }
  ],
  'database-indexing': [
    {
      id: 'idx-1',
      question: 'What is a B-Tree index optimized for under relational (SQL) work loads?',
      options: [
        'Handling high-throughput, raw file logs without structural searches.',
        'Point-lookup queries and wide range scans, maintaining sorted, balanced nodes to guarantee O(log N) lookup speeds.',
        'Performing raw full text search stemming operations over unstructured paragraphs.',
        'Reducing memory storage requirements on SQL servers.'
      ],
      correctAnswerIndex: 1,
      explanation: 'B-Trees represent balanced sorted trees, keeping data sorted and facilitating efficient point gets and range evaluations in O(log N) node validations.'
    },
    {
      id: 'idx-2',
      question: 'How do LSM (Log-Structured Merge-Tree) index engines optimize disk-write speeds?',
      options: [
        'By performing synchronous block shatters on mechanical disk spindles.',
        'By buffering updates in an in-memory "MemTable" and writing sequential append-only logs to disk, merging them in background sweep cycles.',
        'By disabling all primary key constraints during insertions.',
        'By using multi-dimensional spatial indexes to map binary tables.'
      ],
      correctAnswerIndex: 1,
      explanation: 'LSM trees are optimized for write-heavy systems (e.g., Cassandra). They write synchronously to an in-memory MemTable and append to an active commit log, writing sequential SSTables in background thread sweeps to bypass index fragmentation.'
    },
    {
      id: 'idx-3',
      question: 'According to the Leftmost Prefix Rule, which queries can use a composite index defined on (user_id, created_at)?',
      options: [
        'Queries filtering on created_at alone.',
        'Queries filtering on user_id alone, OR user_id and created_at together.',
        'Only queries that do not use the user_id field.',
        'Queries utilizing custom full-text search keywords.'
      ],
      correctAnswerIndex: 1,
      explanation: 'A composite index is sorted strictly by the leftmost columns first. An index on (user_id, created_at) can optimize searches for user_id alone, or user_id + created_at combinations. It cannot optimize created_at alone because it is grouped under user_id nodes.'
    }
  ],
  'sql-vs-nosql': [
    {
      id: 'db-1',
      question: 'Under what design constraints should a system architect select a Relational (SQL) database?',
      options: [
        'When schema flexibility is high and you are saving variable-field JSON documents.',
        'When your system requires strong ACID transactional compliance, complex multi-table JOINs, and strict data consistency checks (such as banking ledger balances).',
        'When write throughput exceeds 500,000 requests per second out-of-the-box.',
        'When you intend to build distributed nodes with eventual soft-state consistency.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Relational databases are structured to ensure robust ACID constraints, relational schemas, and complex join query checks, making them optimal for transactional pipelines with zero tolerances for divergence.'
    },
    {
      id: 'db-2',
      question: 'What is the primary architectural concept behind the BASE consistency model of NoSQL clusters?',
      options: [
        'Binary Authentication Secure Encryption.',
        'Basically Available, Soft-state, Eventual consistency—focusing on horizontal scale and write speed over instant synchronized views.',
        'Block Access Sequential Execution for multi-master databases.',
        'Backup Archive Security Extensions.'
      ],
      correctAnswerIndex: 1,
      explanation: 'The BASE model trades strict, synchronized consistency for scalability and fast response. Soft-states signify values that might shift over replication delays, eventually reaching consistency.'
    },
    {
      id: 'db-3',
      question: 'Which database system is optimal for storing massive social media relational networks (social graphs) like follower lists and mutual links?',
      options: [
        'A document store NoSQL database like MongoDB.',
        'A Graph Database (such as Neo4j) mapping entities as vertices and relationship linkages as rich edges.',
        'An append-only raw CSV file registry.',
        'A wide-column database utilizing consistent hash tables.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Graph Databases are highly optimized for handling deeply nested relational structures with fast transverse edge joins, avoiding slow SQL nested loops or denormalized JSON doc queries.'
    }
  ]
};

// Generates fallback dynamic MCQ questions for any missing topic to prevent application errors
export function getQuizByTopicId(topicId: string): QuizQuestion[] {
  const customQuiz = TOPIC_QUIZZES[topicId];
  if (customQuiz) return customQuiz;

  // Render high-quality fallback questions matching the matched system design criteria
  const formattedTitle = topicId.replace(/-/g, ' ').toUpperCase();
  return [
    {
      id: `${topicId}-fallback-1`,
      question: `What is a primary architectural design concern when scaling a system segment like ${formattedTitle}?`,
      options: [
        'Enforcing strict single-thread blocks on mechanical server disks.',
        `Evaluating capacity bounds, resolving single points of failure, and decoupling components.`,
        'Using raw plaintext strings for all internal APIs to eliminate JSON serialization overhead.',
        'Forcing all client devices to refresh active web sockets every ten seconds.'
      ],
      correctAnswerIndex: 1,
      explanation: `System design for ${formattedTitle} requires minimizing network bottlenecks, introducing functional redundancies, and scaling nodes horizontally.`
    },
    {
      id: `${topicId}-fallback-2`,
      question: 'How do distributed caches enhance the availability of system components?',
      options: [
        'By copying the entire physical application code onto memory caches.',
        'By shielding heavy databases/disk queries from repeating reads, serving high-frequency requests from fast in-memory stores.',
        'By disabling TLS security validation checks once inside virtual cloud firewalls.',
        'By converting relational tables into raw binary logs.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Distributed caching boosts speed and availability by storing hot items in RAM pools, avoiding expensive disk query loops.'
    },
    {
      id: `${topicId}-fallback-3`,
      question: 'Which trade-off is most critical when introducing horizontal scaling to a system component?',
      options: [
        'Increased reliance on localized vertical hardware frames.',
        'Ensuring distributed data synchronization and handling network partitions versus accepting processing latencies.',
        'Stamping of raw serial logs into static offline file formats.',
        'Bypassing RESTful protocol specifications entirely.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Horizontal scale adds multiple server nodes, bringing structural complexity in maintaining state coherence, sync overhead, and partition tolerance (as modeled by CAP Theorem).'
    }
  ];
}

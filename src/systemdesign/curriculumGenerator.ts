import { Topic, ComponentBlock, Relationship, TradeOff, FAQ, CuratedResource } from './types';
import { CURRICULUM_TOPICS } from './curriculumData';

// Generate consistent topic IDs from raw syllabus names
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .trim();
}

// Maps of category categories
export const HLD_ROADMAP = [
  {
    phase: 'Core Basics',
    topics: [
      'Scalability Basics',
      'Back Of the Envelope Estimation',
      'System Design Framework',
      'Load Balancers',
      'HTTP & APIs',
      'CDN',
      'Caching',
      'Database Indexing'
    ]
  },
  {
    phase: 'Data & Scaling',
    topics: [
      'SQL vs NoSQL',
      'Replication',
      'Sharding',
      'Consistent Hashing',
      'CAP Theorem',
      'Distributed Cache',
      'Key-Value Store',
      'Unique-Id Generator'
    ]
  },
  {
    phase: 'Communication & Events',
    topics: [
      'Message Queues',
      'Kafka',
      'Pub/Sub',
      'Event-Driven Architecture',
      'WebSockets'
    ]
  },
  {
    phase: 'System Components',
    topics: [
      'Web Crawler',
      'Notification System',
      'Rate Limiter',
      'Search Autocomplete',
      'Metrics Monitoring and Alerting System',
      'Ad Click Event Aggregation',
      'Microservices',
      'Android System Design'
    ]
  },
  {
    phase: 'Real-World Practice Cases',
    topics: [
      'URL Shortener',
      'Chat System',
      'Instagram Feed',
      'YouTube Design',
      'Google Drive',
      'Proximity Service',
      'Nearby Friends',
      'Google Maps',
      'Hotel Reservation System',
      'Distributed Email Service',
      'S3-like Object Storage',
      'Real-time Gaming Leaderboard',
      'Payment System',
      'Digital Wallet',
      'Stock Exchange'
    ]
  }
];

export const LLD_ROADMAP = [
  {
    phase: 'OOD & SOLID',
    topics: ['SOLID Design Principles']
  },
  {
    phase: 'Design Patterns',
    topics: ['Design Patterns']
  },
  {
    phase: 'System Architecture & Diagrams',
    topics: ['Schema Design', 'Class Diagrams']
  },
  {
    phase: 'Common Problems',
    topics: ['Parking Lot', 'Movie Ticket Booking', 'Chess Game']
  }
];

// Fallback topic metadata library
const FALLBACK_TOPICS: Record<string, Partial<Topic>> = {
  'replication': {
    summary: 'Synchronizing database copies across multiple computing nodes to scale database reads and introduce fault tolerances.',
    cheatSheet: [
      'Leader-Follower (Master-Slave): Leader processes writes; followers scale read operations.',
      'Leader-Leader (Active-Active): Multiple nodes handle write queries; requires complex conflict resolutions.',
      'Symmetric / Peer-to-Peer: Anyone accepts updates (e.g., Cassandra).',
      'Sync vs Async: Sync guarantees data security but slows writes, whereas Async ensures speed but risk lag.'
    ],
    diagram: `graph TD
  Client[Client Server] -->|SQL Write| Master[Primary Leader Database]
  Master -->|Asynchronous Replication Logs| Replica1[Read Replica 1: follower]
  Master -->|Asynchronous Replication Logs| Replica2[Read Replica 2: follower]
  
  ClientReader[Client Readers] -->|Read Query| Replica1
  ClientReader -->|Read Query| Replica2
  
  style Master fill:#f43f5e,stroke:#9f1239,stroke-width:2px,color:#fff
  classDef replica fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff;
  class Replica1,Replica2 replica;`,
    components: [
      { name: 'Primary Leader Database', role: 'Handles write executions', description: 'Origin source of truth', tier: 'Database' },
      { name: 'Follower Database replicas', role: 'Accept read queries only', description: 'Replicated copy caches', tier: 'Database' }
    ],
    relationships: [
      { from: 'Primary Leader Database', to: 'Follower Database replicas', label: 'Replication sync streams' }
    ],
    tradeoffs: [
      {
        criteria: 'Consistency Level',
        factorA: 'Synchronous Replication',
        factorB: 'Asynchronous Replication',
        valA: 'Strict Consistency across all copies.',
        valB: 'Extremely fast write updates; minor replication lags under pressure.',
        preferred: 'Asynchronous is highly preferred for scaled reads setups.'
      }
    ],
    faqs: [
      {
        question: 'What is replication lag?',
        answer: 'The time delay between a write operation finishing on the leader database and that change being written to reading replica clones.'
      }
    ],
    resources: [
      { title: 'Database Replication and Scale', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=F3aofP87Iws', youtubeId: 'F3aofP87Iws' }
    ]
  },
  'sharding': {
    summary: 'Distributing datasets across partitioned database arrays using range-based, hash-based, or lookup-based sharing patterns.',
    cheatSheet: [
      'Horizontal partitioning: Splits single database tables into multiple smaller ones with identical schemas.',
      'Sharding Key: Colum values (e.g., user_id) used to determine which shard receives a write request.',
      'Hotspot Shard: Single shard receiving excessive loads due to suboptimal shard key selection.',
      'Re-sharding limits: Dynamic scaling of shard allocations is difficult and requires consistent hashing.'
    ],
    diagram: `graph TD
  Query[Insert User: ID=99] --> Router[Database Proxy Router]
  Router -->|Hash of ID % 2 == 1| Shard1[Database Shard 1]
  Router -->|Hash of ID % 2 == 0| Shard2[Database Shard 2]
  
  style Router fill:#3b82f6,stroke:#1d4ed8,stroke-width:1.5px,color:#fff
  classDef shard fill:#f43f5e,stroke:#9f1239,stroke-width:1px,color:#fff;
  class Shard1,Shard2 shard;`,
    components: [
      { name: 'Database Router', role: 'Evaluates sharding keys', description: 'Distributes writes', tier: 'Load Balancer' }
    ],
    relationships: [
      { from: 'Query', to: 'Database Router', label: 'Write payload' }
    ],
    tradeoffs: [
      {
        criteria: 'Shard Partition Key',
        factorA: 'Range-Based Sharding',
        factorB: 'Hash-Based Sharding',
        valA: 'Optimized for range queries, but prone to hotspotting.',
        valB: 'Even data distribution, but range queries require checking all shards.',
        preferred: 'Consistent hash-based sharding matches generic write-heavy workloads.'
      }
    ],
    faqs: [
      {
        question: 'What is a cross-shard join?',
        answer: 'A query requiring data from multiple tables located on different shards. Cross-shard joins are very slow; we avoid them by denormalizing data.'
      }
    ],
    resources: [
      { title: 'Database Sharding Crash Course', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=5faMjKuB9_Y', youtubeId: '5faMjKuB9_Y' }
    ]
  },
  'cap-theorem': {
    summary: 'The CAP Theorem asserts that a distributed data ecosystem can only guarantee two out of three criteria: Consistency, Availability, and Partition Tolerance.',
    cheatSheet: [
      'Consistency (C): Every reading node receives the latest write updates or an error response.',
      'Availability (A): Every operational node returns a non-error response without consistency guarantees.',
      'Partition Tolerance (P): The cluster continues operation despite network split errors dropping inter-node links.',
      'The PACELC Core: Extending CAP to cover Latency vs Consistency trade-offs when operating without partition failures.'
    ],
    diagram: `graph TD
  subgraph Network Partition
    NodeA[Node A: CAP CP Zone] -.->|Network Split| NodeB[Node B: CAP CP Zone]
  end
  ClientA[User A Writes] --> NodeA
  ClientB[User B Reads] --> NodeB
  
  style NodeA fill:#f43f5e,stroke:#9f1239,color:#fff
  style NodeB fill:#f43f5e,stroke:#9f1239,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Network Partition Selection',
        factorA: 'Choose Consistency (CP)',
        factorB: 'Choose Availability (AP)',
        valA: 'Reject writes on isolated nodes to ensure synchronized values.',
        valB: 'Accept writes on all nodes; resolve diverging data in background later.',
        preferred: 'We prefer CP for financial records and AP for status feeds.'
      }
    ],
    faqs: [
      {
        question: 'Is there a CA database system?',
        answer: 'In real-world networks, partition tolerance (P) is mandatory because network cables and connections can always fail. Thus, CA system claims are practically non-existent.'
      }
    ],
    resources: [
      { title: 'The CAP Theorem Explained Simply', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=HcyLXdXsnX0', youtubeId: 'HcyLXdXsnX0' }
    ]
  },
  'distributed-cache': {
    summary: 'Setting up multi-node cache networks (like Redis Cluster) utilizing shared memory pools with consistent hashing partition plans.',
    cheatSheet: [
      'Gossip Protocol: Nodes communicate cluster states, slot metrics, and node fail-over notifications.',
      'Partition Slots: Redis divides hashing key allocations into exactly 16384 unique logical slots.',
      'Sentinel: Provides automated monitoring and primary node fail-over capabilities.'
    ],
    diagram: `graph LR
  Client[Application Client] -->|Key Hash Mapping| Node1[Redis Shard 1: Master]
  Client -->|Key Hash Mapping| Node2[Redis Shard 2: Master]
  
  style Node1 fill:#10b981,stroke:#047857,color:#fff
  style Node2 fill:#10b981,stroke:#047857,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Cache Sync State',
        factorA: 'Single Node Redis',
        factorB: 'Redis Distributed Cluster',
        valA: 'Simple layout with minor deployment latency.',
        valB: 'Horizontal cache expansion; high system availability.',
        preferred: 'Choose distributed clusters for enterprise-grade load patterns.'
      }
    ],
    faqs: [
      {
        question: 'What are replication models of Redis clusters?',
        answer: 'Each master shard has at least one slave node. If a master fails, the cluster votes and promotes a slave replica.'
      }
    ],
    resources: [
      { title: 'Understanding Redis Cluster System Design', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=T_dfS_t4rIE', youtubeId: 'T_dfS_t4rIE' }
    ]
  },
  'kafka': {
    summary: 'An open-source distributed event-streaming platform optimized for high-throughput, low-latency log collection analytics.',
    cheatSheet: [
      'Topics & Partitions: Topics are divided into sequential append-only partitions, writing to disk.',
      'Consumer Groups: Divides partition message streams among active subscriber instances.',
      'Zero-Copy: OS kernel writes storage page caches directly to network pipes, bypassing application memory contexts.',
      'Offsets: Integers representing the current transaction progress pointer of client readers.'
    ],
    diagram: `graph TD
  P[Producer Hub] -->|Partition Key| TopicK[Topic Partitions Log]
  TopicK -->|Index Segment 1| P0[Partition 0]
  TopicK -->|Index Segment 2| P1[Partition 1]
  
  P0 -->|Offset Reader| C1[Consumer Instance A]
  P1 -->|Offset Reader| C2[Consumer Instance B]
  
  style TopicK fill:#8b5cf6,stroke:#6d28d9,color:#fff
  style P0 fill:#1e293b,stroke:#475569,color:#cbd5e1
  style P1 fill:#1e293b,stroke:#475569,color:#cbd5e1`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Stream Indexing',
        factorA: 'Traditional Message Queue (Push-Based)',
        factorB: 'Log-Append Streaming (Kafka Pull-Based)',
        valA: 'Broker retains delivery state metadata; deletes on read.',
        valB: 'Low broker overhead; consumers track their own reading offsets.',
        preferred: 'Log-append streaming is ideal for big data pipes and event sourcing archives.'
      }
    ],
    faqs: [
      {
        question: 'What is a controller node in Kafka?',
        answer: 'A designated broker in the cluster that coordinates leader replication and handles partition reassignments.'
      }
    ],
    resources: [
      { title: 'How Kafka scales event streaming', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=9_C8D7_8fO0', youtubeId: '9_C8D7_8fO0' }
    ]
  },
  'pub-sub': {
    summary: 'Decoupled systems using topics where publishers throw events without targeting specific endpoints, and sub-systems retrieve files via subscriptions.',
    cheatSheet: [
      'Fan-Out: Publishing a single notification can trigger concurrent database, billing, and logs services.',
      'Idempotent receivers: Sub-systems should filter dual messages safely.',
      'Dead-Letter Queue (DLQ): Temporarily logs corrupted message payloads that fail processing.'
    ],
    diagram: `graph LR
  Publisher[Publisher: Order service] -->|Publish event: paid| Topic[Pub/Sub Topic]
  Topic --> Sub1[SMS Broker Sub]
  Topic --> Sub2[Warehouse Sub]
  
  style Topic fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Message Delivery',
        factorA: 'Point-To-Point Direct HTTP',
        factorB: 'Pub/Sub Broker Fan-Out',
        valA: 'Tight coupling; fails if downstream nodes are busy or offline.',
        valB: 'Decoupled systems; easily expand tasks without re-editing publishers.',
        preferred: 'Pub/Sub is highly preferred for distributed microservice setups.'
      }
    ],
    faqs: [
      {
        question: 'How do you prevent processing duplicate messages?',
        answer: 'Affix user or payment IDs inside payment messages, verifying them against database transactions before executing edits.'
      }
    ],
    resources: [
      { title: 'Pub Sub vs Message Queues', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=F3tIOO5_39g', youtubeId: 'F3tIOO5_39g' }
    ]
  },
  'event-driven-architecture': {
    summary: 'A system architecture pattern built on top of event generation, detection, and consumption streams.',
    cheatSheet: [
      'State change events: Captures immutable facts that happened rather than execution instructions.',
      'Saga Pattern: Manages distributed transactions across multiple microservices with compensation steps.',
      'Event Sourcing: Persists application state shifts as sequential logs instead of overwriting table rows.'
    ],
    diagram: `graph TD
  User[Click Action] --> Server[Web Engine]
  Server -->|Save Event Log| ES[Event Store DB]
  ES -->|Publish events| Broker[Kafka Event Bus]
  Broker --> ReadDBSync[Read Database Sync Service]
  
  style ES fill:#f43f5e,stroke:#9f1239,color:#fff
  style Broker fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Application Database State',
        factorA: 'Standard Relational Updates',
        factorB: 'Event Sourcing Patterns',
        valA: 'Updates rows; simple schemas; hard to audit history.',
        valB: 'Retains high fidelity audit history, but reconstructing active state requires replaying logs.',
        preferred: 'Use Standard Relational updates for simple applications, and Sagas/Events for high-load platforms.'
      }
    ],
    faqs: [
      {
        question: 'What is CQRS (Command Query Responsibility Segregation)?',
        answer: 'Splitting database channels into separate Read (query) and Write (command) models to optimize both operations independently.'
      }
    ],
    resources: [
      { title: 'Designing Event-Driven Microservices', creator: 'Martin Fowler', url: 'https://martinfowler.com/articles/201701-event-driven.html' }
    ]
  },
  'websockets': {
    summary: 'Enabling real-time, bi-directional persistent TCP connections between clients and servers with very low message header overhead.',
    cheatSheet: [
      'Handshake: Establishes connection using standard HTTP upgrade headers, transitioning to WebSocket protocol.',
      'Keep-Alives (Ping/Pong): Small heartbeat packets to check and maintain the connection.',
      'Connection State: Servers hold socket memory handles, limiting horizontal scale.',
      'Solutions: Use memory-efficient session registries like Redis to coordinate client nodes.'
    ],
    diagram: `graph LR
  Client[Client web app] -->|1. HTTP Handshake Upgrade| S_Node[WebSocket Gateway server]
  S_Node -->|2. Bidirectional Sockets| Client
  
  style S_Node fill:#3b82f6,stroke:#1d4ed8,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Real-Time Protocol',
        factorA: 'Long Polling (HTTP)',
        factorB: 'WebSockets (TCP)',
        valA: 'High header size overhead; fires a fresh request on repeat loops.',
        valB: 'Sub-millisecond latency; holds persistent TCP bindings.',
        preferred: 'Choose WebSockets for bidirectional games and chat apps; choose SSE for unidirectional displays.'
      }
    ],
    faqs: [
      {
        question: 'How do you scale Websocket servers horizontally?',
        answer: 'Since TCP connections are stateful, use a Load Balancer with session stickiness or routing hashes, and map active clients to their routing nodes using a central Redis instance.'
      }
    ],
    resources: [
      { title: 'WebSockets System Design Crash Course', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=2HerLPMgPhU', youtubeId: '2HerLPMgPhU' }
    ]
  },
  'notification-systems': {
    summary: 'Building a reliable notification center to push SMS, emails, and iOS/Android notifications, achieving extreme delivery success guarantees.',
    cheatSheet: [
      'Multiple Channels: FCM (Android), APNS (iOS), SendGrid (Email), Twilio (SMS).',
      'Worker Decoupling: Queue send requests to prevent platform timeouts during slow external API responses.',
      'Deduplication: Attach unique tracking tokens to eliminate spam notifications.'
    ],
    diagram: `graph LR
  Trigger[Trigger Notification] --> MQ[Notification Request Queue]
  MQ --> Worker[Notification Workers]
  Worker -->|iOS Push| APNS[Apple Push Services]
  Worker -->|Android Push| FCM[Google Firebase Push]
  
  style MQ fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Reliability Guarantee',
        factorA: 'Fire and Forget (Low Cost)',
        factorB: 'At-Least-Once Delivery (Retry Worker)',
        valA: 'Cheap; doesn\'t retry if third-party providers error.',
        valB: 'Slightly higher cost; retries sending with exponential backoff on errors.',
        preferred: 'We use At-Least-Once for system status, transaction bills, and account activations.'
      }
    ],
    faqs: [
      {
        question: 'How do you handle rate-limits imposed by third-party SMS/Email hosts?',
        answer: 'Rate-limit notification workers using local buckets, processing notification requests in regulated queue structures.'
      }
    ],
    resources: [
      { title: 'How to build a Notification System', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=b1e_7S9GPJQ', youtubeId: 'b1e_7S9GPJQ' }
    ]
  },
  'search-systems': {
    summary: 'Building query mechanisms over unstructured text files utilizing inverted index parsers (such as Elasticsearch).',
    cheatSheet: [
      'Inverted Index: Maps distinct words to lists of documents they appear in.',
      'Tokenization & Normalization: Strips text blocks of punctuation, lowercases characters, and scales terms.',
      'Logstash & Beats: Gathers, reformats, and routes logs to Elasticsearch indices.'
    ],
    diagram: `graph TD
  Input[Search Query: Scalable] --> Analyzer[Text Stemming Tokenizer]
  Analyzer --> Index[Inverted Index: Map]
  Index -->|Scalable appears in:| Matches[Doc 1, Doc 45, Doc 99]
  
  style Index fill:#3b82f6,stroke:#1d4ed8,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Query Performance',
        factorA: 'Relational Database SELECT %LIKE',
        factorB: 'Elasticsearch Inverted Index',
        valA: 'Extremely slow; scans every database row sequentially.',
        valB: 'Instant results; consumes disk space for indexing and requires synchronization from master DB.',
        preferred: 'Inverted Index is highly preferred for rich, catalog-wide searches.'
      }
    ],
    faqs: [
      {
        question: 'How do you synchronize Elasticsearch with the primary database?',
        answer: 'Use CDC (Change Data Capture) tools like Debezium to read database binlogs and index them into Elasticsearch automatically.'
      }
    ],
    resources: [
      { title: 'Elasticsearch System Architecture', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=MyM4N856e4U', youtubeId: 'MyM4N856e4U' }
    ]
  },
  'microservices': {
    summary: 'Decomposing monolithes into highly focused, independently deployable services that communicate via lightweight APIs.',
    cheatSheet: [
      'Domain Driven Design (DDD): Map service boundaries around specific business subdomains (Bounded Contexts).',
      'Service Discovery: Uses catalogs like HashiCorp Consul to dynamically trace available server IP endpoints.',
      'Saga Compensations: Rolls back failed transactions across microservices by invoking inverse cancel operations.'
    ],
    diagram: `graph TD
  API_G[API Gateway Gateway] --> Users[UserService App]
  API_G --> Pay[PaymentService App]
  Users -.->|RPC / gRPC Link| Pay
  
  style API_G fill:#3b82f6,stroke:#1d4ed8,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Ecosystem Architecture',
        factorA: 'Monolithic Single Deploy',
        factorB: 'Microservices Decomposition',
        valA: 'Very simple to build; easy database transactions; hard for large teams to scale.',
        valB: 'High team autonomy; independent scaling; high operational complexity (network, tracking, latency).',
        preferred: 'Start with a modular monolith; scale out to microservices as the engineering team grows.'
      }
    ],
    faqs: [
      {
        question: 'What is a Circuit Breaker pattern?',
        answer: 'An architectural safety pattern. If a subservice fails consistently, the breaker trips (opens) and returns local defaults immediately, protecting downstream services from resource starvation.'
      }
    ],
    resources: [
      { title: 'Monolith to Microservices Roadmap', creator: 'Martin Fowler', url: 'https://martinfowler.com/articles/break-monolith-into-microservices.html' }
    ]
  },
  'android-system-design': {
    summary: 'Architecting resource-constrained mobile apps with local SQL caches, offline synchronization, and push messaging systems.',
    cheatSheet: [
      'Clean Architecture: Presentation Layer (MVVM) -> Domain Layer (Use Cases) -> Data Repository Layer.',
      'Network Optimization: Implement local SQLite caching databases (Room DB) to allow offline work.',
      'Batter Capacity: Minimize telemetry push payloads; run large synchronization batches over Wi-Fi.'
    ],
    diagram: `graph TD
  UI[Fragments/Composibles] --> VM[ViewModel Layer]
  VM --> UC[Use Cases / Interactors]
  UC --> Repo[Data Repository]
  Repo -->|API Request| Network[Retrofit HTTP APIs]
  Repo -->|Offline SQLite Cache| LocalDB[Room Database Store]
  
  style Repo fill:#10b981,stroke:#047857,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Mobile Data Ingestion',
        factorA: 'Live API Streaming',
        factorB: 'Offline-First Caching (SQLite Sync)',
        valA: 'Always shows real-time values; requires constant network connections.',
        valB: 'Instant UI rendering; syncs changes in the background; resilient to offline drops.',
        preferred: 'Offline-first caching provides global mobile audiences with a much smoother interface.'
      }
    ],
    faqs: [
      {
        question: 'How do you structure background sync workers?',
        answer: 'Use Android WorkManager. It schedules deferrable background tasks that survive system reboots, respecting battery constraints.'
      }
    ],
    resources: [
      { title: 'Android App Architectural Guide', creator: 'System Design Primer', url: 'https://developer.android.com/topic/architecture' }
    ]
  },
  'instagram-feed': {
    summary: 'System architecture case study for Instagram Feed: designing social graphs, posting media assets, and instantly rendering subscriber home feeds.',
    cheatSheet: [
      'Fan-Out on Write (Push Model): When a user updates, we append the post ID to all subscriber timelines in Redis. Ideal for standard users.',
      'Fan-Out on Read (Pull Model): Maintain celebrity post arrays separately. When a follower reads, merge the celebrity list with their standard feed.',
      'Fast Feeds: Store the pre-compiled timelines of all active users in Redis arrays to render them instantly.'
    ],
    diagram: `graph TD
  User[Follower opens feed] --> API[Feeds Server App]
  API -->|Fetch timeline list| Redis[Redis Timeline Cache]
  Redis -.->|Cache Miss| DB[Cassandra Post Database]
  
  style Redis fill:#10b981,stroke:#047857,color:#fff
  style DB fill:#f43f5e,stroke:#9f1239,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Feed Compilation',
        factorA: 'Fan-Out on Write (Push)',
        factorB: 'Fan-Out on Read (Pull)',
        valA: 'Extremely fast reads, but writing is very expensive for users with high follower counts.',
        valB: 'Writing is instant, but reads are slow as we must fetch and clean timelines on-the-fly.',
        preferred: 'We use a hybrid approach: Fan-Out on Write for standard users, and Pull for celebrity updates.'
      }
    ],
    faqs: [
      {
        question: 'How does Instagram store and serve photos at scale?',
        answer: 'They save photo files directly in object stores (like AWS S3) and serve them using a Content Delivery Network (CDN) with geographic edge caching.'
      }
    ],
    resources: [
      { title: 'Designing Instagram Feed System', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=QmX2NPkJTKg', youtubeId: 'QmX2NPkJTKg' },
      { title: 'How Instagram Scales its Post Feeds', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=S2S6v6F4Qxs', youtubeId: 'S2S6v6F4Qxs' }
    ]
  },
  'youtube-design': {
    summary: 'Case study: Designing YouTube. Setting up high-performance video segment streaming pipelines and metadata servers.',
    cheatSheet: [
      'Transcoding Pipeline: Converts raw videoclips into web formats (MP4, WebM) at multiple resolutions (360p, 720p, 1080p).',
      'Video Streaming Protocols: Enforce HLS (HTTP Live Streaming) or MPEG-DASH to adjust video quality dynamically based on the user\'s network bandwidth.',
      'Global CDNs: Distribute video segment files directly to geographic edge servers.'
    ],
    diagram: `graph TD
  Upload[User uploads raw clip] --> GW[Ingress Server]
  GW --> Queue[Transcoding Jobs Queue]
  Queue --> Worker[Transcoder Workers: convert resolutions]
  Worker --> Storage[S3 Segments Bucket]
  Storage --> CDN[Global Streaming CDNs]
  
  style Queue fill:#8b5cf6,stroke:#6d28d9,color:#fff
  style CDN fill:#3b82f6,stroke:#1d4ed8,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Video Playback Method',
        factorA: 'Standard Single File HTTP Pull',
        factorB: 'Adaptive Stream Segments (HLS)',
        valA: 'High buffer delays; download failures require restarting the video.',
        valB: 'The video is split into 5-second segments, adapting quality dynamically as bandwidth shifts.',
        preferred: 'Adaptive Stream Segments (such as HLS or MPEG-DASH) are essential for satisfying global viewers.'
      }
    ],
    faqs: [
      {
        question: 'Why not save video metadata inside the video file bucket directly?',
        answer: 'Video file buckets are designed for binary objects. We store search metadata, view counts, and comments in faster databases (like NoSQL Cassandra or MySQL cluster shards) to search and write them efficiently.'
      }
    ],
    resources: [
      { title: 'Architecting YouTube System Design', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=wYk0xSsm-uQ', youtubeId: 'wYk0xSsm-uQ' },
      { title: 'Video Streaming Architecture deep-dive', creator: 'ByteByteGo', url: 'https://youtube.com/watch?v=Z38_0S8A13Y', youtubeId: 'Z38_0S8A13Y' }
    ]
  },
  'movie-ticket-booking': {
    summary: 'LLD case study: Designing a movie booking engine (like BookMyShow). Resolving thread-safety challenges when users lock seats concurrently.',
    cheatSheet: [
      'Core Classes: BookingManager, Cinema, Movie, Hall, Show, Seat, Booking, Payment.',
      'Concurrency Strategy: Prevent double-booking seat selection checks by using SQL Row Locks (SELECT FOR UPDATE) or Distributed Lock arrays in Redis.',
      'State Pattern: Change a Booking\'s state from PENDING to PAID or EXPIRED (returning seats to the pool if payment is not made within 10 minutes).'
    ],
    diagram: `classDiagram
  class Cinema {
    -String name
    -List Halls
    +listActiveShows()
  }
  class Show {
    -String showId
    -Movie movie
    -List Seats
    +reserveSeats(List SeatIds)
  }
  class Seat {
    -int row
    -int col
    -SeatStatus status
    +lockSeat()
    +releaseSeat()
  }
  class Movie {
    -String title
    -int durationMinutes
  }
  
  Cinema *-- Show
  Show *-- Seat
  Show o-- Movie`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Seat Lock Mechanism',
        factorA: 'In-Memory JVM Mutex Lock',
        factorB: 'Database Row Locks (SQL SELECT FOR UPDATE)',
        valA: 'Very fast, but fails if the booking application is scaled to multiple servers.',
        valB: 'Ensures robust synchronization across multiple cluster instances.',
        preferred: 'We prefer database-level row locks or distributed Redis caches to coordinate larger networks.'
      }
    ],
    faqs: [
      {
        question: 'How do you handle transient seat reservation hold limits (e.g., 5-minute checkout holds)?',
        answer: 'Change the seat status to "Reserved". Use Redis with an expiration token (TTL) or a scheduled job to release the seats if checkout is not completed.'
      }
    ],
    resources: [
      { title: 'Movie Booking System LLD', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=pDkrF_X_wZg', youtubeId: 'pDkrF_X_wZg' }
    ]
  },
  'schema-design': {
    summary: 'Designing database layouts manually: choosing primary keys, foreign keys, constraints, and structuring normalized (or denormalized) indexes.',
    cheatSheet: [
      'Database Normalization (1NF, 2NF, 3NF): Decouples duplicate tables to ensure consistency.',
      'Denormalization Trade-off: Duplicate specific parameters to speed up high-frequency reads.',
      'Constraint Validation: Enforce Foreign Key indexes and Check restraints directly on databases.'
    ],
    diagram: `graph TD
  UserTable[Users Table] -->|1 to Many link| PostsTable[Posts Table]
  PostsTable -->|1 to Many link| CommentsTable[Comments Table]
  
  style UserTable fill:#f43f5e,stroke:#9f1239,color:#fff
  style PostsTable fill:#f43f5e,stroke:#9f1239,color:#fff`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Structure Level',
        factorA: 'Highly Normalized (3NF)',
        factorB: 'Denormalized High-Performance Map',
        valA: 'Consumes less storage space; update operations are fast and consistent.',
        valB: 'Highly optimized reads with simple select metrics; updates require rewriting multiple entries.',
        preferred: 'Always default to normalized schemas; denormalize selectively only when you identify performance bottlenecks.'
      }
    ],
    faqs: [
      {
        question: 'When is denormalization preferred?',
        answer: 'In read-heavy analytics databases (like data warehouses) or NoSQL architectures where SQL JOIN operations are expensive or missing.'
      }
    ],
    resources: [
      { title: 'Under the Hood: SQL Schema Design', creator: 'Hussein Nasser', url: 'https://youtube.com/watch?v=GieEsM8ePlo', youtubeId: 'GieEsM8ePlo' }
    ]
  },
  'chess-game': {
    summary: 'LLD case study: Chess Game. Developing clean, polymorphic class relationships to handle coordinate systems, player turns, and piece moves.',
    cheatSheet: [
      'Core Classes: ChessGame, Board, Spot, Piece (King, Queen, Rook, etc.), Move, Player.',
      'Strategy Pattern: Implement the Strategy pattern on Piece objects to validate coordinates for dynamic moves.',
      'Move History: Maintain a clean linked list or stack of Move instances to easily support undo actions.'
    ],
    diagram: `classDiagram
  class ChessGame {
    -Board board
    -List players
    -List movesHistory
    +playerMove(Move)
    +isCheckmate()
  }
  class Board {
    -Spot spots[][]
    +resetBoard()
  }
  class Piece {
    <<abstract>>
    -boolean isWhite
    +isValidMove(Board, Spot start, Spot end)*
  }
  class Pawn {
    +isValidMove()
  }
  class Knight {
    +isValidMove()
  }
  
  ChessGame *-- Board
  Piece <|-- Pawn
  Piece <|-- Knight
  Board o-- Piece`,
    components: [],
    relationships: [],
    tradeoffs: [
      {
        criteria: 'Move Validation Design',
        factorA: 'Rules Engine Inside Piece Object',
        factorB: 'Separate Validator/Rules Service Class',
        valA: 'Clear Object-Oriented polymorphism, encapsulation.',
        valB: 'Cleanly decouples game state models from validation logic.',
        preferred: 'Encapsulating movement rules inside custom Piece objects is the standard and most intuitive approach.'
      }
    ],
    faqs: [
      {
        question: 'How do you handle advanced chess rules like Castling or En Passant?',
        answer: 'Implement state flags in the ChessGame and Piece classes (e.g., Piece.hasMoved) and validate these conditions within the central Move transaction.'
      }
    ],
    resources: [
      { title: 'Designing a class-diagram Chess match', creator: 'Gaurav Sen', url: 'https://youtube.com/watch?v=FIIvK7-99-4', youtubeId: 'FIIvK7-99-4' }
    ]
  }
};

// Merges fallback templates with default curated topic array
export function getTopicById(id: string): Topic {
  const match = CURRICULUM_TOPICS.find(t => t.id === id);
  if (match) return match;

  // Derive static backup if not explicitly designed in curriculumData.ts
  const fallback = FALLBACK_TOPICS[id];

  // Try parsing display fallback structures
  const displayTitle = id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace('Api', 'API')
    .replace('Cdn', 'CDN')
    .replace('Cap', 'CAP')
    .replace('Ood', 'OOD')
    .replace('Lld', 'LLD')
    .replace('Hld', 'HLD')
    .replace('Solid', 'SOLID')
    .replace('Sql', 'SQL')
    .replace('Nosql', 'NoSQL')
    .replace('Sms', 'SMS')
    .replace('Websockets', 'WebSockets')
    .replace('Tinyurl', 'TinyURL');

  // Determine Track Type
  let track: 'HLD' | 'LLD' = 'HLD';
  let category = 'System Components';
  
  // Find track categories dynamically by looking through HLD_ROADMAP and LLD_ROADMAP
  const inHLD = HLD_ROADMAP.find(phase => phase.topics.some(t => slugify(t) === id));
  if (inHLD) {
    track = 'HLD';
    category = inHLD.phase;
  } else {
    const inLLD = LLD_ROADMAP.find(phase => phase.topics.some(t => slugify(t) === id));
    if (inLLD) {
      track = 'LLD';
      category = inLLD.phase;
    }
  }

  return {
    id,
    title: displayTitle,
    track,
    category,
    summary: fallback?.summary || `Comprehensive learning workspace node exploring ${displayTitle}. Learn components, data flow schemas, and structural choices.`,
    cheatSheet: fallback?.cheatSheet || [
      `Mastering ${displayTitle} is highly valued in high-scale tech designs.`,
      'Focus heavily on decoupling interfaces to prevent performance bottlenecks.',
      'Consider failure scenarios: data replication delay, high consumer queues, and network partitioning.'
    ],
    diagram: fallback?.diagram || `graph LR
  Client[Client web application] -->|API Requests| Gateway[Gateway Core Proxy]
  Gateway -->|Handles| Node[Service System Node: ${displayTitle}]
  
  style Gateway fill:#3b82f6,stroke:#1d4ed8,color:#fff
  style Node fill:#10b981,stroke:#047857,color:#fff`,
    components: fallback?.components || [
      { name: 'Gateway Core Proxy', role: 'Routes requested segments', description: 'Limits throughput', tier: 'Gateway' },
      { name: `Service: ${displayTitle}`, role: `Processes requests for ${displayTitle}`, description: 'Performs calculations', tier: 'Service' }
    ],
    relationships: fallback?.relationships || [
      { from: 'Gateway Core Proxy', to: `Service: ${displayTitle}`, label: 'Secure route redirect' }
    ],
    tradeoffs: fallback?.tradeoffs || [
      {
        criteria: 'Scale Strategy',
        factorA: 'Stateless Service Execution',
        factorB: 'Stateful Session Mapping',
        valA: 'Scales horizontally out of the box with zero cache sync issues.',
        valB: 'Requires local server storage; introduces single points of failure.',
        preferred: 'Always design applications with user state decoupled from computation servers.'
      }
    ],
    faqs: fallback?.faqs || [
      {
        question: `Why is ${displayTitle} critical under high traffic volumes?`,
        answer: `It decouples system resources, enabling computation nodes to scale independently, preventing cascading failures across standard service meshes.`
      }
    ],
    resources: fallback?.resources || [
      { title: `${displayTitle} Deep Dive System Course`, creator: 'ByteByteGo', url: 'https://youtube.com' },
      { title: `${displayTitle} Case Studies`, creator: 'Gaurav Sen', url: 'https://youtube.com' }
    ]
  };
}

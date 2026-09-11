// backend/src/config/questions.bank.ts
/**
 * Ryyvora AI — Server-Side Authoritative Question Bank
 * Correct answers & explanations are kept strictly on the server.
 */

export interface ExamQuestion {
  id: string;
  domain: string; // CSE, IT, AI/DS, ECE, EEE, MECH, CIVIL, GEN
  topic: string;
  question: string;
  options: [string, string, string, string];
  correct: number; // 0, 1, 2, 3
  explanation: string;
}

export const QUESTION_BANK: ExamQuestion[] = [
  // ── CSE (Computer Science & Engineering) ───────────────────────────
  {
    id: 'cse_01',
    domain: 'CSE',
    topic: 'Algorithms',
    question: 'What is the tightest worst-case time complexity of QuickSort without random pivot selection?',
    options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
    correct: 2,
    explanation: 'Without randomization or median-of-three, an unbalanced partition (such as already sorted data) yields O(n²).',
  },
  {
    id: 'cse_02',
    domain: 'CSE',
    topic: 'Data Structures',
    question: 'Which data structure is optimal for implementing an LRU (Least Recently Used) cache with O(1) get and put?',
    options: ['Binary Search Tree', 'Hash Map with Doubly Linked List', 'Min-Heap', 'Circular Queue'],
    correct: 1,
    explanation: 'A Hash Map gives O(1) key lookup and a Doubly Linked List allows O(1) eviction and node repositioning.',
  },
  {
    id: 'cse_03',
    domain: 'CSE',
    topic: 'Web Systems',
    question: 'In React 18+, what is the purpose of concurrent rendering transitions via useTransition?',
    options: ['Immediate state updates for urgent inputs', 'Marking updates as non-blocking and interruptible', 'Synchronous DOM mutation', 'Server component streaming only'],
    correct: 1,
    explanation: 'useTransition marks state updates as non-urgent transitions so higher priority user inputs remain responsive.',
  },
  {
    id: 'cse_04',
    domain: 'CSE',
    topic: 'Databases',
    question: 'In PostgreSQL, which ACID property does Write-Ahead Logging (WAL) primarily guarantee during crashes?',
    options: ['Atomicity and Durability', 'Isolation only', 'Consistency checking', 'Denormalization'],
    correct: 0,
    explanation: 'WAL logs changes before writing dirty pages to disk, guaranteeing that committed transactions survive crashes (Durability) and incomplete ones can be rolled back (Atomicity).',
  },
  {
    id: 'cse_05',
    domain: 'CSE',
    topic: 'Operating Systems',
    question: 'Which condition is NOT one of the four Coffman conditions necessary for deadlock to occur?',
    options: ['Mutual Exclusion', 'Preemption allowed', 'Hold and Wait', 'Circular Wait'],
    correct: 1,
    explanation: 'No preemption is the requirement. If resources can be preempted, deadlock cannot persist.',
  },
  {
    id: 'cse_06',
    domain: 'CSE',
    topic: 'Computer Networks',
    question: 'During the TCP three-way handshake, what flags are set in the second packet transmitted by the server?',
    options: ['SYN only', 'ACK only', 'SYN + ACK', 'FIN + ACK'],
    correct: 2,
    explanation: 'The server acknowledges the client SYN by setting the ACK flag and synchronizes its own sequence number with the SYN flag.',
  },
  {
    id: 'cse_07',
    domain: 'CSE',
    topic: 'System Design',
    question: 'What is the primary benefit of using Consistent Hashing in distributed caching tiers like Memcached or DynamoDB?',
    options: ['Even sorting of cached values', 'Minimizing key remapping when nodes are added or removed', 'Eliminating cache miss penalties completely', 'Encrypting cache keys in transit'],
    correct: 1,
    explanation: 'Consistent hashing remaps only K/N keys on average when a node joins or leaves, preventing massive cache stampedes.',
  },
  {
    id: 'cse_08',
    domain: 'CSE',
    topic: 'Software Engineering',
    question: 'In SOLID design principles, what does the Liskov Substitution Principle (LSP) enforce?',
    options: ['Classes must have only one reason to change', 'Subtypes must be substitutable for their base types without altering correctness', 'Depend on abstractions rather than concretions', 'Interfaces should not be bloated'],
    correct: 1,
    explanation: 'LSP requires objects of a superclass to be replaceable with objects of its subclasses without breaking application behavior.',
  },
  {
    id: 'cse_09',
    domain: 'CSE',
    topic: 'Security',
    question: 'What is the primary defense against Cross-Site Request Forgery (CSRF) attacks in modern web APIs?',
    options: ['Content Security Policy headers', 'Anti-CSRF synchronizer tokens and SameSite cookie attributes', 'HTTPS encryption', 'Database input sanitization'],
    correct: 1,
    explanation: 'Anti-CSRF tokens and SameSite=Strict/Lax prevent unauthorized cross-origin requests from executing state-changing operations.',
  },
  {
    id: 'cse_10',
    domain: 'CSE',
    topic: 'Distributed Systems',
    question: 'According to the CAP theorem, in the presence of a network partition (P), a distributed system must choose between:',
    options: ['Performance and Latency', 'Consistency and Availability', 'Concurrency and Scalability', 'Durability and Replication'],
    correct: 1,
    explanation: 'When network partitions occur, distributed nodes must either reject requests to preserve consistency or serve stale data to preserve availability.',
  },
  {
    id: 'cse_11',
    domain: 'CSE',
    topic: 'Algorithms',
    question: 'Which graph traversal algorithm finds the shortest path in an unweighted directed graph with O(V + E) complexity?',
    options: ['Dijkstra Algorithm', 'Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Bellman-Ford Algorithm'],
    correct: 2,
    explanation: 'BFS explores nodes level by level, ensuring that the first time a node is reached corresponds to its shortest path in unweighted graphs.',
  },
  {
    id: 'cse_12',
    domain: 'CSE',
    topic: 'Architecture',
    question: 'In event-driven architectures, what mechanism ensures message processing order across distributed consumer instances?',
    options: ['Round-robin partition routing', 'Message partition keys (e.g. in Apache Kafka)', 'Broadcast fanout queues', 'Dead letter queues'],
    correct: 1,
    explanation: 'Messages sharing the same partition key are mapped to the same partition and consumed in strict linear order by a single consumer thread.',
  },
  {
    id: 'cse_13',
    domain: 'CSE',
    topic: 'Frontend Engineering',
    question: 'Why does React require unique keys when rendering lists of elements?',
    options: ['To allow CSS styling hooks', 'To identify which items have changed, been added, or been removed during reconciliation', 'To generate unique HTML DOM element IDs', 'To enable server side rendering caching'],
    correct: 1,
    explanation: 'Keys allow React to match existing fiber tree nodes with new elements across renders, minimizing DOM re-creation.',
  },
  {
    id: 'cse_14',
    domain: 'CSE',
    topic: 'Concurrency',
    question: 'In Go or Node.js, what is a race condition?',
    options: ['When two threads execute in parallel without errors', 'When the outcome of execution depends on non-deterministic scheduling of concurrent operations', 'When garbage collection pauses all execution threads', 'When network bandwidth is saturated'],
    correct: 1,
    explanation: 'A race condition occurs when concurrent threads access shared state without proper synchronization, making output dependent on thread scheduling order.',
  },
  {
    id: 'cse_15',
    domain: 'CSE',
    topic: 'Database Optimization',
    question: 'What is an Index-Organized Table (or Clustered Index) in relational databases?',
    options: ['An index stored on a separate storage drive', 'A table whose physical row storage order is dictated by the indexed key', 'A temporary hash table generated during queries', 'An index that only indexes primary foreign keys'],
    correct: 1,
    explanation: 'A clustered index determines the physical order of data in the table, enabling very fast range scans on that key.',
  },
  {
    id: 'cse_16',
    domain: 'CSE',
    topic: 'Containerization',
    question: 'What underlying Linux kernel primitives provide resource limits (CPU, Memory) to Docker containers?',
    options: ['Namespaces', 'Control Groups (cgroups)', 'Chroot jail', 'Seccomp profiles'],
    correct: 1,
    explanation: 'Control Groups (cgroups) meter and limit physical hardware resources, while Namespaces provide isolation.',
  },
  {
    id: 'cse_17',
    domain: 'CSE',
    topic: 'Compiler Design',
    question: 'What is the primary output of the lexical analysis (scanning) phase in a compiler pipeline?',
    options: ['Abstract Syntax Tree (AST)', 'Three-Address Code', 'Stream of Tokens', 'Bytecode instructions'],
    correct: 2,
    explanation: 'The lexer scans raw source characters and converts them into tokens with associated types and attributes.',
  },
  {
    id: 'cse_18',
    domain: 'CSE',
    topic: 'Cryptography',
    question: 'Which cryptographic algorithm provides asymmetric encryption and digital signatures based on the hardness of discrete logarithms?',
    options: ['AES-256', 'Elliptic Curve Cryptography (ECDSA)', 'SHA-384', 'ChaCha20'],
    correct: 1,
    explanation: 'ECDSA is an asymmetric public-key cryptography algorithm built upon elliptic curve discrete logarithm problem.',
  },
  {
    id: 'cse_19',
    domain: 'CSE',
    topic: 'Cloud Computing',
    question: 'What architectural pattern allows a service to gracefully degrade when a downstream dependent service is failing?',
    options: ['Circuit Breaker Pattern', 'Bulkhead Isolation', 'Saga Pattern', 'Both Circuit Breaker and Bulkhead'],
    correct: 3,
    explanation: 'Circuit Breakers halt requests to failing services, while Bulkheads isolate resources so one failing dependency does not exhaust all worker threads.',
  },
  {
    id: 'cse_20',
    domain: 'CSE',
    topic: 'Computer Networks',
    question: 'What is the main enhancement of HTTP/2 over HTTP/1.1 in terms of network transport efficiency?',
    options: ['Mandatory symmetric TLS encryption', 'Multiplexed binary framing over a single TCP connection', 'Stateless UDP datagram streaming', 'Automatic WebP image conversion'],
    correct: 1,
    explanation: 'HTTP/2 introduces binary framing and stream multiplexing over one connection, eliminating head-of-line blocking at the HTTP application layer.',
  },

  // ── IT (Information Technology & DevOps) ───────────────────────────
  {
    id: 'it_01',
    domain: 'IT',
    topic: 'DevOps & CI/CD',
    question: 'In Kubernetes architecture, which component watches newly created Pods with no assigned node and selects one to run on?',
    options: ['kube-apiserver', 'kube-scheduler', 'kube-controller-manager', 'etcd'],
    correct: 1,
    explanation: 'The kube-scheduler selects the optimal node for unscheduled pods based on resource constraints, affinity, and taints.',
  },
  {
    id: 'it_02',
    domain: 'IT',
    topic: 'Cybersecurity',
    question: 'What is the primary mechanism of a Man-in-the-Middle (MITM) attack mitigation in public TLS/SSL connections?',
    options: ['Certificate Authority (CA) public key infrastructure and signature verification', 'Port knocking on edge firewalls', 'Periodic rotation of DNS nameservers', 'Using private RFC 1918 IP addresses'],
    correct: 0,
    explanation: 'PKI and CA chain validation ensure the client is communicating with the authentic owner of the public certificate.',
  },
  {
    id: 'it_03',
    domain: 'IT',
    topic: 'Infrastructure as Code',
    question: 'In Terraform, what file stores the mapping between real-world infrastructure and configuration declarations?',
    options: ['main.tf', 'terraform.tfstate', '.terraform.lock.hcl', 'variables.tf'],
    correct: 1,
    explanation: 'The state file (terraform.tfstate) records metadata and mappings of managed cloud resources to your configuration.',
  },
  {
    id: 'it_04',
    domain: 'IT',
    topic: 'Networking',
    question: 'Which routing protocol is the standard Exterior Gateway Protocol (EGP) used to route traffic between Autonomous Systems on the global Internet?',
    options: ['OSPF', 'BGP (Border Gateway Protocol)', 'RIPv2', 'EIGRP'],
    correct: 1,
    explanation: 'BGP is the core routing protocol of the internet that exchanges routing and reachability information among Autonomous Systems.',
  },
  {
    id: 'it_05',
    domain: 'IT',
    topic: 'Linux Administration',
    question: 'Which command in Linux displays all socket statistics and listening ports with process ownership without DNS lookups?',
    options: ['ss -tulpn', 'netstat -a', 'ifconfig -a', 'lsof -iTCP'],
    correct: 0,
    explanation: 'ss -tulpn displays TCP (-t), UDP (-u), listening (-l), process names (-p), and numeric addresses (-n).',
  },
  {
    id: 'it_06',
    domain: 'IT',
    topic: 'Cloud Security',
    question: 'What principle states that users and automated systems should be granted only the minimum permissions necessary to complete tasks?',
    options: ['Zero Trust Principle', 'Principle of Least Privilege (PoLP)', 'Separation of Environments', 'Defense in Depth'],
    correct: 1,
    explanation: 'The Principle of Least Privilege restricts access rights to the bare minimum required for routine duties.',
  },

  // ── AI/DS (Artificial Intelligence & Data Science) ────────────────
  {
    id: 'aids_01',
    domain: 'AI/DS',
    topic: 'Deep Learning',
    question: 'What mechanism in the Transformer architecture allows the model to capture dependencies between tokens regardless of their distance?',
    options: ['Recurrent Feedback Loops', 'Scaled Dot-Product Self-Attention', 'Convolutional Pooling', 'Gradient Clipping'],
    correct: 1,
    explanation: 'Self-attention calculates attention weights between all pairs of tokens in parallel, bypassing the sequential bottleneck of RNNs.',
  },
  {
    id: 'aids_02',
    domain: 'AI/DS',
    topic: 'Machine Learning',
    question: 'When evaluating an imbalanced classification model where false negatives carry severe consequences, which metric should be prioritized?',
    options: ['Accuracy', 'Specificity', 'Recall (Sensitivity)', 'Precision'],
    correct: 2,
    explanation: 'Recall measures the fraction of actual positives correctly identified, minimizing false negatives.',
  },
  {
    id: 'aids_03',
    domain: 'AI/DS',
    topic: 'Vector Databases',
    question: 'Which indexing algorithm is widely utilized in vector search engines for fast Approximate Nearest Neighbor (ANN) search?',
    options: ['B-Tree indexing', 'HNSW (Hierarchical Navigable Small World)', 'Bitmap indexing', 'Hash index'],
    correct: 1,
    explanation: 'HNSW builds multi-layer graph structures with logarithmic scaling for high-dimensional vector similarity retrieval.',
  },
  {
    id: 'aids_04',
    domain: 'AI/DS',
    topic: 'LLMs & GenAI',
    question: 'What does RAG (Retrieval-Augmented Generation) primarily solve when serving enterprise generative AI applications?',
    options: ['Increasing token generation speed by 10x', 'Reducing model hallucinations by grounding responses in retrieved domain documents', 'Eliminating the need for vector embeddings', 'Enabling offline CPU inference'],
    correct: 1,
    explanation: 'RAG retrieves authoritative external knowledge chunks dynamically and injects them into the model context prompt.',
  },
  {
    id: 'aids_05',
    domain: 'AI/DS',
    topic: 'Data Preprocessing',
    question: 'Why is standardization (Z-score normalization) critical prior to training algorithms like SVM or PCA?',
    options: ['To convert text strings to numbers', 'Because these algorithms are sensitive to feature scales when calculating distances or variances', 'To prevent class imbalance', 'To handle missing values automatically'],
    correct: 1,
    explanation: 'Distance-based and variance-maximizing algorithms will disproportionately prioritize features with large raw numerical scales without normalization.',
  },

  // ── ECE (Electronics & Communication Engineering) ──────────────────
  {
    id: 'ece_01',
    domain: 'ECE',
    topic: 'Embedded Systems',
    question: 'In embedded C for microcontrollers, why is the keyword "volatile" applied to hardware register pointers and ISR shared variables?',
    options: ['To allocate memory in EEPROM', 'To prevent the compiler from optimizing away reads or writes to variables changed by hardware', 'To speed up variable execution in SRAM', 'To make variables thread-safe across cores'],
    correct: 1,
    explanation: 'Volatile instructs the compiler that the variable value may change at any time outside compiler control (e.g. by hardware or an interrupt).',
  },
  {
    id: 'ece_02',
    domain: 'ECE',
    topic: 'Digital Signal Processing',
    question: 'According to the Nyquist-Shannon sampling theorem, what is the minimum sampling frequency to avoid aliasing for a band-limited signal with max frequency fm?',
    options: ['fs = fm', 'fs >= 2 * fm', 'fs = 0.5 * fm', 'fs >= 4 * fm'],
    correct: 1,
    explanation: 'The sampling rate must be at least twice the maximum frequency component in the analog signal to enable exact reconstruction.',
  },
  {
    id: 'ece_03',
    domain: 'ECE',
    topic: 'Communication Systems',
    question: 'Which serial communication protocol uses a 2-wire interface (SDA, SCL) with open-drain outputs and pull-up resistors?',
    options: ['SPI', 'UART', 'I2C (Inter-Integrated Circuit)', 'CAN Bus'],
    correct: 2,
    explanation: 'I2C uses two bidirectional open-collector/drain lines with pull-up resistors for multi-master, multi-slave communication.',
  },
  {
    id: 'ece_04',
    domain: 'ECE',
    topic: 'VLSI Design',
    question: 'In CMOS inverter logic, why is static power dissipation nearly zero under steady-state voltage inputs?',
    options: ['Only one of the pull-up PMOS or pull-down NMOS networks is conducting in any steady state', 'Superconducting interconnects are used', 'Resistive pull-ups absorb all current', 'Capacitive charge is recycled back to VDD'],
    correct: 0,
    explanation: 'In steady state (high or low), either the NMOS or PMOS is in cutoff, cutting off any direct current path from VDD to ground.',
  },

  // ── EEE (Electrical & Electronics Engineering) ─────────────────────
  {
    id: 'eee_01',
    domain: 'EEE',
    topic: 'Power Electronics',
    question: 'In modern Electric Vehicle (EV) inverters, what semiconductor technology provides superior switching efficiency and thermal tolerance over Silicon IGBTs?',
    options: ['Germanium diodes', 'Silicon Carbide (SiC) MOSFETs', 'Selenium rectifiers', 'Lead-acid switches'],
    correct: 1,
    explanation: 'Wide-bandgap SiC semiconductors allow higher operating temperatures, faster switching frequencies, and substantially lower switching losses.',
  },
  {
    id: 'eee_02',
    domain: 'EEE',
    topic: 'Control Systems',
    question: 'What is the role of the Derivative (D) term in a closed-loop PID controller?',
    options: ['Eliminates steady-state error', 'Dampens oscillations and improves transient response by anticipating error trends', 'Increases system gain at zero frequency', 'Powers down the plant during overcurrent'],
    correct: 1,
    explanation: 'The derivative term reacts to the rate of change of the error signal, providing predictive damping against overshoot and oscillations.',
  },

  // ── MECH (Mechanical Engineering) ──────────────────────────────────
  {
    id: 'mech_01',
    domain: 'MECH',
    topic: 'Thermodynamics',
    question: 'Which ideal thermodynamic cycle serves as the standard theoretical model for internal combustion spark-ignition (petrol) engines?',
    options: ['Rankine Cycle', 'Otto Cycle', 'Diesel Cycle', 'Brayton Cycle'],
    correct: 1,
    explanation: 'The Otto cycle is the ideal thermodynamic cycle for four-stroke spark-ignition engines with constant-volume heat addition.',
  },
  {
    id: 'mech_02',
    domain: 'MECH',
    topic: 'Finite Element Analysis',
    question: 'According to von Mises yield criterion, yielding of a ductile material occurs when:',
    options: ['Maximum principal stress reaches tensile yield strength', 'Distortion energy per unit volume reaches the distortion energy at yield under uniaxial tension', 'Maximum shear strain exceeds 45 degrees', 'Hydrostatic pressure equals atmospheric pressure'],
    correct: 1,
    explanation: 'The von Mises yield criterion is based on maximum shear strain (distortion) energy theory for ductile materials.',
  },

  // ── CIVIL (Civil & Infrastructure Engineering) ─────────────────────
  {
    id: 'civil_01',
    domain: 'CIVIL',
    topic: 'Structural Engineering',
    question: 'In reinforced concrete design (IS 456 / ACI 318), what is the purpose of designing sections as under-reinforced rather than over-reinforced?',
    options: ['To reduce concrete compressive strength requirements', 'To ensure ductile failure with visible warning cracks prior to collapse', 'To save total weight of steel rebar', 'To eliminate shear reinforcement requirements'],
    correct: 1,
    explanation: 'In an under-reinforced section, steel yields before concrete crushes, providing visible deflections and warning signs before structural failure.',
  },
  {
    id: 'civil_02',
    domain: 'CIVIL',
    topic: 'Geotechnical Engineering',
    question: 'What soil parameter represents the ratio of the volume of voids to the total volume of the soil mass?',
    options: ['Void ratio (e)', 'Porosity (n)', 'Degree of saturation (S)', 'Specific gravity (G)'],
    correct: 1,
    explanation: 'Porosity is the ratio of void volume to total volume, whereas void ratio is the ratio of void volume to solid volume.',
  },

  // ── GEN (Engineering & Applied Sciences) ───────────────────────────
  {
    id: 'gen_01',
    domain: 'GEN',
    topic: 'Engineering Ethics & Standards',
    question: 'Under the National Skills Qualifications Framework (NSQF) in India, what level corresponds to a standard Bachelor of Technology (B.Tech) degree graduate competency?',
    options: ['Level 3', 'Level 4', 'Level 6 - 7', 'Level 10'],
    correct: 2,
    explanation: 'NSQF Level 6/7 represents four-year undergraduate professional degree competence involving complex technical problem solving.',
  },
  {
    id: 'gen_02',
    domain: 'GEN',
    topic: 'Project Management',
    question: 'In Critical Path Method (CPM) project scheduling, what is the total float of activities that lie on the critical path?',
    options: ['Infinity', 'Zero', 'Equal to the project duration', 'Variable based on resource loading'],
    correct: 1,
    explanation: 'Critical path activities have zero float; any delay in these activities immediately delays the entire project completion date.',
  },
];

export function getExamQuestions(domainCode: string, count: number = 20): ExamQuestion[] {
  const normDomain = domainCode.toUpperCase();
  // Filter questions matching domain or GEN
  const domainQuestions = QUESTION_BANK.filter(
    (q) => q.domain === normDomain || (normDomain === 'IT' && q.domain === 'CSE') || (normDomain === 'AI/DS' && q.domain === 'CSE')
  );

  const fallbackQuestions = QUESTION_BANK.filter((q) => q.domain === 'GEN' || q.domain === 'CSE');

  const combined = [...domainQuestions, ...fallbackQuestions];

  // Unique by ID
  const unique = Array.from(new Map(combined.map((q) => [q.id, q])).values());

  // Shuffle and slice
  const shuffled = [...unique].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

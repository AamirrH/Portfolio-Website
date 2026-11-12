export type Section = 'home' | 'projects' | 'roomly' | 'swiftship' | 'signalroute' | 'about' | 'contact';
export type ProjectId = 'roomly' | 'swiftship' | 'signalroute';
export interface Metric { label: string; value: string; detail: string; progress?: number; }
export interface Project { id: ProjectId; exit: string; title: string; category: string; pitch: string; stack: string[]; highlights: string[]; metrics: Metric[]; live?: string; repo?: string; repoTodo?: string; }
export interface Technology { name: string; icon?: string; }
export interface TechnologyGroup { id: string; label: string; technologies: Technology[]; }
// Use the local logos where available; unknown technologies remain text.
export const projectTechIcons: Record<string, string> = {
  Java: 'java', 'Spring Boot': 'springboot', 'Spring Security': 'springsecurity',
  'Spring Data JPA': 'springdatajpa', React: 'react', PostgreSQL: 'postgresql',
  Docker: 'docker', Kafka: 'apachekafka', Redis: 'redis',
  'GitHub Actions': 'githubactions', Python: 'python',
};
// Cleaned icon art from the supplied SwiftShip sheet. Labels remain live text.
export const projectTechArtwork: Record<string, { src: string; overlay?: string; wide?: boolean }> = {
  Java: { src: '/assets/tech-art/java.webp' },
  'Spring Boot': { src: '/assets/tech-art/spring-boot.webp' },
  React: { src: '/assets/tech-art/react.webp' },
  'Spring Cloud Gateway': { src: '/assets/tech-art/spring-cloud-gateway.webp' },
  Kafka: { src: '/assets/tech-art/kafka.webp' },
  'PostgreSQL / PostGIS': { src: '/assets/tech-art/postgres-postgis.webp', wide: true },
  Redis: { src: '/assets/tech-art/redis.webp' },
  WebSocket: { src: '/assets/tech-art/websocket.webp' },
  Resilience4j: { src: '/assets/tech-art/resilience4j.webp' },
  'Spring AI / Gemini': { src: '/assets/tech-art/spring-ai-gemini.webp', wide: true },
  OpenRouteService: { src: '/assets/tech-art/openrouteservice.webp', overlay: 'ORS' },
  Docker: { src: '/assets/tech-art/docker.webp' },
};
// Each project can use its own supplied icon artwork for a shared technology.
export const projectTechArtworkByProject: Partial<Record<ProjectId, Record<string, { src: string; overlay?: string; wide?: boolean }>>> = {
  roomly: {
    Java: { src: '/assets/tech-art/roomly-java.webp' },
    'Spring Boot': { src: '/assets/tech-art/roomly-spring-boot.webp' },
    'Spring Security': { src: '/assets/tech-art/roomly-spring-security.webp' },
    'Spring Data JPA': { src: '/assets/tech-art/roomly-spring-data-jpa.webp' },
    React: { src: '/assets/tech-art/roomly-react.webp' },
    PostgreSQL: { src: '/assets/tech-art/roomly-postgresql.webp' },
    Razorpay: { src: '/assets/tech-art/roomly-razorpay.webp' },
    'Google Calendar API': { src: '/assets/tech-art/roomly-google-calendar.webp' },
    JWT: { src: '/assets/tech-art/roomly-jwt.webp' },
    Docker: { src: '/assets/tech-art/roomly-docker.webp' },
  },
  signalroute: {
    Python: { src: '/assets/tech-art/signalroute-python.webp' },
    Pandas: { src: '/assets/tech-art/signalroute-pandas.webp' },
    Pydantic: { src: '/assets/tech-art/signalroute-pydantic.webp' },
    'scikit-learn': { src: '/assets/tech-art/signalroute-scikit-learn.webp' },
    'Gemini API': { src: '/assets/tech-art/signalroute-gemini.webp' },
    Pillow: { src: '/assets/tech-art/signalroute-pillow.webp' },
  },
};
// Technology names come from the supplied resume; icons are local Devicon assets where available.
export const technologyGroups: TechnologyGroup[] = [
  { id: 'languages', label: 'Languages', technologies: [
    { name: 'Java', icon: 'java' }, { name: 'Python', icon: 'python' }, { name: 'C', icon: 'c' },
    { name: 'C++', icon: 'cplusplus' }, { name: 'JavaScript', icon: 'javascript' }, { name: 'HTML', icon: 'html5' }
  ] },
  { id: 'frameworks', label: 'Frameworks', technologies: [
    { name: 'Spring Boot', icon: 'springboot' }, { name: 'Spring MVC', icon: 'springmvc' },
    { name: 'Spring Data JPA', icon: 'springdatajpa' }, { name: 'Spring Security', icon: 'springsecurity' },
    { name: 'React', icon: 'react' }, { name: 'WebSocket' },
    { name: 'Resilience4j' }, { name: 'REST APIs' }
  ] },
  { id: 'data', label: 'Data & messaging', technologies: [
    { name: 'PostgreSQL', icon: 'postgresql' }, { name: 'MySQL', icon: 'mysql' },
    { name: 'Oracle', icon: 'oracle' }, { name: 'Neon' },
    { name: 'Hibernate', icon: 'hibernate' }, { name: 'Kafka', icon: 'apachekafka' },
    { name: 'Redis', icon: 'redis' }
  ] },
  { id: 'cloud', label: 'Cloud & DevOps', technologies: [
    { name: 'Docker', icon: 'docker' }, { name: 'Kubernetes', icon: 'kubernetes' },
    { name: 'Google Cloud', icon: 'googlecloud' }, { name: 'Railway' },
    { name: 'Vercel', icon: 'vercel' }, { name: 'GitHub Actions', icon: 'githubactions' }
  ] },
  { id: 'tools', label: 'Tools', technologies: [
    { name: 'Git', icon: 'git' }, { name: 'Maven', icon: 'maven' },
    { name: 'Postman', icon: 'postman' }, { name: 'npm', icon: 'npm' }
  ] }
];
// Project claims follow the supplied resume; READMEs supply supporting product details.
export const projects: Project[] = [
  {
    "id": "roomly",
    "exit": "01",
    "title": "Roomly",
    "category": "FULL-STACK / RESERVATIONS",
    "pitch": "A hotel booking and operations platform where guests can find rooms, book stays, and manage reservations, while hotel teams handle inventory and bookings.",
    "stack": [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Spring Data JPA",
      "React",
      "PostgreSQL",
      "Razorpay",
      "Google Calendar API",
      "JWT",
      "Docker"
    ],
    "highlights": [
      "Built booking, inventory, and management dashboards with access tailored to four user roles.",
      "Protected accounts with JWT, BCrypt password hashing, and role-based access. Razorpay test payments use server-created orders and cryptographic signature verification.",
      "Calculated room prices using demand, occupancy, and booking urgency, with Google Calendar holiday data feeding a Strategy Pattern pricing engine.",
      "Prevented double-booking with pessimistic locking and transactional availability checks. In each of three tests, 100 concurrent requests competed for 10 rooms: 10 bookings succeeded, 90 were rejected, and no rooms were oversold."
    ],
    "metrics": [
      {
        "label": "User roles",
        "value": "4",
        "detail": "Guest and hotel operations access"
      },
      {
        "label": "Concurrent requests",
        "value": "100",
        "detail": "Competing for 10 rooms in each of 3 tests"
      },
      {
        "label": "Overselling",
        "value": "0",
        "detail": "Across all 3 concurrency tests"
      }
    ],
    "live": "https://roomly-xi.vercel.app",
    "repo": "https://github.com/AamirrH/Roomly"
  },
  {
    "id": "swiftship",
    "exit": "02",
    "title": "SwiftShip",
    "category": "DISTRIBUTED SYSTEMS / FULFILLMENT",
    "pitch": "A distributed order fulfillment platform that connects checkout, stock reservation, warehouse selection, and delivery tracking through an event-driven workflow.",
    "stack": [
      "Java",
      "Spring Boot",
      "React",
      "Spring Cloud Gateway",
      "Kafka",
      "PostgreSQL / PostGIS",
      "Redis",
      "WebSocket",
      "Resilience4j",
      "Spring AI / Gemini",
      "OpenRouteService",
      "Docker"
    ],
    "highlights": [
      "Connected 8+ Spring Boot microservices through Kafka to coordinate orders, inventory, warehouse assignment, routing, tracking, and notifications.",
      "Used JWT/OAuth2 and Spring Cloud Gateway for access control, with Resilience4j circuit breakers, retries, and rate limits to contain failures between services.",
      "Replaced application-side coordinate scans with indexed PostGIS distance queries, bringing nearest-warehouse selection latency to 100 ms.",
      "Combined OpenRouteService with Spring AI/Gemini to select road-aware delivery routes using ETA, distance, and delivery context, with a fallback when the routing API fails.",
      "Streamed tracking updates to 100 concurrent authenticated WebSocket clients at 4 ms p95 latency with 0% message loss. Redis stores the latest tracking state; Kafka and Resend support customer notifications."
    ],
    "metrics": [
      {
        "label": "Warehouse lookup",
        "value": "100",
        "detail": "ms ? indexed PostGIS queries"
      },
      {
        "label": "Tracking p95",
        "value": "4",
        "detail": "ms ? 100 concurrent authenticated clients"
      },
      {
        "label": "Message loss",
        "value": "0%",
        "detail": "WebSocket tracking test"
      }
    ],
    "live": "https://swift-ship-nu.vercel.app",
    "repo": "https://github.com/AamirrH/SwiftShip"
  },
  {
    "id": "signalroute",
    "exit": "03",
    "title": "SignalRoute AI",
    "category": "AI / DETERMINISTIC ROUTING",
    "pitch": "A command-line notification router that sorts WhatsApp text, images, and voice notes into notify, digest, or mute, using message context and recipient history.",
    "stack": [
      "Python",
      "Pandas",
      "Pydantic",
      "scikit-learn",
      "Gemini API",
      "Pillow"
    ],
    "highlights": [
      "Used Gemini for image and voice extraction, with a local deterministic policy engine making the final routing decisions.",
      "Built a safety gate for credential and OTP harvesting, payment-pressure scams, impersonation, and prompt injection. Personalization cannot override a safety veto.",
      "Retrieved relevant evidence from 400+ historical messages using recipient-scoped TF-IDF search. Evidence stays within the receiving user?s history and is checked against known message IDs.",
      "Scored 1.00 on action, message-type, and joint accuracy on the organizer?s labeled evaluation set, compared with 0.90, 0.90, and 0.80 for a schema-constrained Gemini reasoner.",
      "Validated the pipeline with 34 unit tests and placed 365th of 1,983 participants ? top 18% ? in HackerRank Orchestrate."
    ],
    "metrics": [
      {
        "label": "Evaluation accuracy",
        "value": "1.00",
        "detail": "Action, type, and joint ? organizer?s labeled set"
      },
      {
        "label": "Unit tests",
        "value": "34",
        "detail": "Pipeline validation"
      },
      {
        "label": "Orchestrate",
        "value": "Top 18%",
        "detail": "365th of 1,983 participants"
      }
    ],
    "repo": "https://github.com/AamirrH/SignalRoute-AI"
  }
];
export const content = {
  owner: { name: 'Aamir Hussain', initials: 'AH', role: 'CS STUDENT & SOFTWARE BUILDER', tagline: 'Drive Forever', intro: 'Building thoughtful software. Taking the scenic route.', education: 'Computer Science · Ramdeobaba University, Nagpur', availability: 'OPEN TO SDE OPPORTUNITIES', github: 'https://github.com/AamirrH', linkedin: 'https://linkedin.com/in/aamir-hussain-359513328', email: null as string | null, emailTodo: 'TODO: Add contact email', biography: 'I’m Aamir, a computer science student at Ramdeobaba University in Nagpur. I build full-stack applications and backend systems, with an interest in reliable software and the decisions behind it. I’m working toward an SDE role at a product company.' },
  brand: { name: 'ENDLESS ROAD', subline: 'A PORTFOLIO IN MOTION', route: 'AH / 01', direction: 'EASTBOUND', edition: 'NIGHT DRIVE — VOL. 01', coordinates: 'NAGPUR, INDIA', copyright: 'AAMIR HUSSAIN', status: 'ALL ROADS LEAD FORWARD' },
  nav: [{ id: 'projects', label: 'Projects', subtitle: 'SELECTED WORK' }, { id: 'about', label: 'About', subtitle: 'BEHIND THE WHEEL' }, { id: 'contact', label: 'Contact', subtitle: 'NEXT DESTINATION' }] satisfies { id: Section; label: string; subtitle: string }[],
  sectionNames: { home: 'The open road', projects: 'The work ahead', roomly: 'Exit 01 · Roomly', swiftship: 'Exit 02 · SwiftShip', signalroute: 'Exit 03 · SignalRoute AI', about: 'Behind the wheel', contact: 'Get in touch' } satisfies Record<Section, string>,
  hero: { eyebrow: 'A LITTLE CURIOUS. ALWAYS MOVING.', line1: 'Good things', line2: 'are up ahead.', description: 'Software, systems, and a few late-night ideas.', cta: 'Explore my work', hint: 'SCROLL TO TAKE THE NEXT EXIT', journey: 'THE JOURNEY', journeyDetail: '3 PROJECTS · ONE OPEN ROAD' },
  projects: { eyebrow: 'NEXT 3 EXITS', title: 'Built along the way.', description: 'Three stops ahead: reservations, distributed fulfillment, and safer notification routing. Scroll or use the arrows to explore each build.', signTitle: 'THE WORK AHEAD', signDetail: 'THREE PROJECTS / ONE OPEN ROAD', signHint: 'KEEP DRIVING', doorHint: 'The lit building door opens the live project', notes: 'Technical notes', board: 'PROJECT DIRECTORY', door: 'Open live project', back: 'All projects', live: 'Live project', repo: 'Source code', overview: 'Features', tech: 'Tech stack', exit: 'EXIT', next: 'Next project', previous: 'Previous project', indexLabel: 'Project exits', gaugeNote: 'Results are from project tests, not a live performance feed.' },
  about: { eyebrow: 'BEHIND THE WHEEL', title: 'Curiosity is the engine.', skillsTitle: 'SYSTEMS ON BOARD', educationTitle: 'EDUCATION', degree: 'B.Tech in Computer Science', school: 'Ramdeobaba University · Nagpur', years: '2024–2028', stackHint: 'Choose a system to explore', steeringLabel: 'Steering wheel. Drag to turn, or use the left and right arrow keys.', resume: 'Download résumé', resumeUrl: '/assets/documents/Resume_Aamir.pdf' },
  contact: { eyebrow: 'THE NEXT CHAPTER', title: 'Get in Touch', description: 'Have a product to build or a problem worth solving? Let’s see where the road goes.', github: 'GitHub', linkedin: 'LinkedIn', email: 'Send an email', home: 'Back to the open road' },
  controls: { quality: 'Quality', qualityAuto: 'Auto', qualityHigh: 'High', qualityMedium: 'Medium', qualityLow: 'Low', motionOn: 'Motion on', motionOff: 'Motion off', mute: 'Mute audio', unmute: 'Unmute audio', unavailable: 'Audio unavailable', plain: 'Plain mode', scene: 'Drive mode', next: 'Next section', previous: 'Previous section', palette: 'Change sky palette', skip: 'Skip to content', navigation: 'Main navigation', home: 'Go home', camera: 'CAM', sound: 'SOUND', on: 'ON', off: 'OFF', reduced: 'Reduced motion enabled', mode: 'Display mode' },
  gate: { eyebrow: 'YOUR NEXT DESTINATION IS AHEAD', title: 'Endless Road', subtitle: 'A portfolio by Aamir Hussain', ignite: 'PRESS TO IGNITE', starting: 'ENGINE STARTING', hint: 'A night drive through the things I build.', audio: 'SOUND OPTIONAL · HEADPHONES WELCOME', plain: 'Take the quiet route', keyLabel: 'Ignition key' },
  plain: { eyebrow: 'AAMIR HUSSAIN / PORTFOLIO', work: 'Selected projects', about: 'About me', contact: 'Get in touch' }
};

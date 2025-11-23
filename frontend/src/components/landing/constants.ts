export const bgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

export const featureItems = [
  { id: '01', title: 'Goal Alignment', desc: 'Defines the ultimate objective.' },
  { id: '02', title: 'Learning Style', desc: 'Video vs Text vs Code.' },
  { id: '03', title: 'Budget', desc: 'Tailors financial constraints.' },
  { id: '04', title: 'Time/Week', desc: 'Schedules based on availability.' },
  { id: '05', title: 'Skill Level', desc: 'Calibrates difficulty curve.' },
  { id: '06', title: 'Device Specs', desc: 'Optimizes tools for hardware.' },
  { id: '07', title: 'Preferred Tools', desc: 'Integrates with your stack.' },
  { id: '08', title: 'Project Type', desc: 'Focuses on real-world apps.' },
  { id: '09', title: 'Language', desc: 'Prioritizes specific syntax.' },
  { id: '10', title: 'Deadline', desc: 'Structures to meet target dates.' },
];

export const architecture = [
  { emoji: '👤', title: 'Profile → Draft', sub: '10-point intake', color: 'cyan' },
  { emoji: '🧠', title: '4 Agents → Roadmaps', sub: 'Strategy mix', color: 'purple' },
  { emoji: '📦', title: 'Sandbox Ops', sub: 'Docker MCP + Gemini', color: 'orange' },
  { emoji: '✅', title: 'Pick & Persist', sub: 'Share / refine / resume', color: 'emerald' },
];

export const engineCards = [
  {
    title: 'Secure Execution',
    desc: 'Isolated E2B Sandboxes provide a safe environment for agents to run code and test solutions.',
    icon: 'lock',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    hover: 'hover:bg-emerald-500/10',
  },
  {
    title: 'Replicable Env',
    desc: 'Docker ensures consistent, version-controlled environments for every learning module.',
    icon: 'servers',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    hover: 'hover:bg-blue-500/10',
  },
  {
    title: 'Gemini RAG',
    desc: 'Intelligent vectors allow agents to pull the most relevant information to construct learning steps.',
    icon: 'bolt',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    hover: 'hover:bg-purple-500/10',
  },
];

export const navLinks = ['Features', 'Architecture', 'Engine', 'Pricing'];
export const logos = ['Bolt', 'Oneargow', 'PupilSync', 'CodeFlow'];

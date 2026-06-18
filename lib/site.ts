export const site = {
  name: "Devanor Solutions",
  tagline: "Engineered for Smarter Electrical Design",
  description:
    "Devanor Solutions is a Zuken Partner providing E3.series software, training, consulting and expert support for smarter electrical design.",
  contact: {
    address: "IFZA Business Park, DDP, PO Box 342001, Dubai, United Arab Emirates",
    phone: "+971 585 697 040",
    phoneHref: "tel:+971585697040",
    whatsapp: "+971 585 697 040",
    whatsappHref: "https://wa.me/971585697040",
    email: "info@devanor.com",
    emailHref: "mailto:info@devanor.com",
  },
} as const;

export const nav = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About us", href: "/about" },
] as const;

export const e3Modules = [
  {
    name: "E3.schematic & E3.cable",
    description:
      "Design electrical control-system schematics and complete wiring and cabling, with intelligent, rules-driven editing.",
  },
  {
    name: "E3.topology",
    description:
      "Convert logical designs into physical representations through topology sheets that map real-world routing.",
  },
  {
    name: "E3.formboard",
    description:
      "Create 1:1 cable-harness drawings and full manufacturing documentation directly from your design data.",
  },
  {
    name: "E3.panel",
    description:
      "Lay out components for panel enclosures in 2D and 3D with automated checks and MCAD integration.",
  },
] as const;

export const services = [
  {
    name: "Helpdesk Support",
    description:
      "Direct access to E3.series experts for troubleshooting, guidance, and best-practice advice—keeping your projects moving and your team productive.",
  },
  {
    name: "Automation",
    description:
      "Tailored scripts that eliminate repetitive tasks, improve consistency and save valuable engineering time.",
  },
  {
    name: "Training",
    description:
      "Practical training designed to build expertise, improve confidence and help your team work more efficiently.",
  },
  {
    name: "Consulting",
    description:
      "Hands-on electrical and mechanical design support, helping your team create accurate drawings and complete projects with confidence.",
  },
] as const;

export const differentiators = [
  {
    title: "Deep E3.series Expertise",
    description:
      "Practical expertise across schematics, harness design and panel engineering.",
  },
  {
    title: "Electrical + Mechanical",
    description: "Combined industry experience that bridges the ECAD and MCAD worlds.",
  },
  {
    title: "Customised Solutions",
    description: "Solutions and training shaped around your engineering processes.",
  },
  {
    title: "Workflow Optimisation",
    description: "A relentless focus on removing friction and speeding up your design cycle.",
  },
] as const;

export const caseStudies = [
  {
    title: "Harness Documentation, Automated",
    client: "Industrial Equipment Manufacturer",
    summary:
      "Cut cable-harness documentation time dramatically by moving from manual drawings to E3.formboard with custom automation.",
    result: "60% faster manufacturing documentation",
  },
  {
    title: "ECAD/MCAD in One Flow",
    client: "Special Machinery Builder",
    summary:
      "Connected electrical and mechanical design with bidirectional E3.series workflows, eliminating costly rework.",
    result: "Zero re-spins from ECAD/MCAD mismatches",
  },
  {
    title: "Onboarding a New Engineering Team",
    client: "Power Systems Integrator",
    summary:
      "Tailored training programme that took a new team from zero to productive on E3.series in weeks.",
    result: "Productive in under 4 weeks",
  },
] as const;

export const e3Tutorials = [
  {
    title: "Getting Started with E3.schematic",
    level: "Beginner",
    description: "Create your first project, place symbols and draw your first connections.",
  },
  {
    title: "Working with E3.cable",
    level: "Intermediate",
    description: "Define cables, cores and connectors and keep wiring data consistent.",
  },
  {
    title: "Generating Formboard Drawings",
    level: "Intermediate",
    description: "Produce 1:1 harness drawings and manufacturing reports from your design.",
  },
  {
    title: "Automating Reports with Scripts",
    level: "Advanced",
    description: "Use the E3.series API to automate repetitive documentation tasks.",
  },
] as const;

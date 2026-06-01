export const site = {
  name: "Devanor Solutions",
  tagline: "Engineering Smarter Electrical & Mechanical Design",
  description:
    "Devanor Solutions is a Zuken partner delivering E3.Series software, training and expert support for electrical and mechanical design teams.",
  contact: {
    address: "FZA Business Park, DDP, PO Box 342001, Dubai, United Arab Emirates",
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
    name: "E3.Schematic & E3.Cable",
    description:
      "Design electrical control-system schematics and complete wiring and cabling, with intelligent, rules-driven editing.",
  },
  {
    name: "E3.Topology",
    description:
      "Convert logical designs into physical representations through topology sheets that map real-world routing.",
  },
  {
    name: "E3.Formboard",
    description:
      "Create 1:1 cable-harness drawings and full manufacturing documentation directly from your design data.",
  },
  {
    name: "E3.Panel",
    description:
      "Lay out components for panel enclosures in 2D and 3D with automated checks and MCAD integration.",
  },
] as const;

export const services = [
  {
    name: "Helpdesk Support",
    description:
      "Expert guidance for troubleshooting and day-to-day E3.Series questions, so your team is never blocked.",
  },
  {
    name: "Automation",
    description:
      "Custom scripts that streamline workflows, generate reports and remove repetitive manual work.",
  },
  {
    name: "Training",
    description:
      "Beginner to advanced courses, delivered online or on-site and tailored to your team's needs.",
  },
  {
    name: "Consulting",
    description:
      "Tailored business solutions and hands-on support to optimise your ECAD/MCAD design process.",
  },
] as const;

export const differentiators = [
  {
    title: "Deep E3.Series Expertise",
    description: "Over 7 years working hands-on with E3.Series across complex projects.",
  },
  {
    title: "Electrical + Mechanical",
    description: "Combined industry experience that bridges the ECAD and MCAD worlds.",
  },
  {
    title: "Customised Solutions",
    description: "Solutions and training shaped around how your team actually works.",
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
      "Cut cable-harness documentation time dramatically by moving from manual drawings to E3.Formboard with custom automation.",
    result: "60% faster manufacturing documentation",
  },
  {
    title: "ECAD/MCAD in One Flow",
    client: "Special Machinery Builder",
    summary:
      "Connected electrical and mechanical design with bidirectional E3.Series workflows, eliminating costly rework.",
    result: "Zero re-spins from ECAD/MCAD mismatches",
  },
  {
    title: "Onboarding a New Engineering Team",
    client: "Power Systems Integrator",
    summary:
      "Tailored training programme that took a new team from zero to productive on E3.Series in weeks.",
    result: "Productive in under 4 weeks",
  },
] as const;

export const e3Tutorials = [
  {
    title: "Getting Started with E3.Schematic",
    level: "Beginner",
    description: "Create your first project, place symbols and draw your first connections.",
  },
  {
    title: "Working with E3.Cable",
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
    description: "Use the E3.Series API to automate repetitive documentation tasks.",
  },
] as const;

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

// Internal tutorials page (the yellow "See tutorials" button links here).
export const demoVideosUrl = "/videos";

// Tutorial videos shown on /videos. Product demo videos live on each product
// page instead.
export type Tutorial = { title: string; videoUrl: string };

export const tutorials: Tutorial[] = [
  { title: "User Interface Layout", videoUrl: "https://www.loom.com/share/e5caf79ccef6491d9126bf0b4812f895" },
  { title: "Project and Sheets", videoUrl: "https://www.loom.com/share/501b49380e42477fbf7c3227e9dd83fb" },
  { title: "Component Search Configurations", videoUrl: "https://www.loom.com/share/7b7d2e8b2977445981e79b8abe8e44a5" },
  { title: "Connection Methods", videoUrl: "https://www.loom.com/share/36702593f30642aa80e1af6eaae3fe47" },
  { title: "Inserting and Changing Wires", videoUrl: "https://www.loom.com/share/40e7fa379d024987b13897ad7ae6920b" },
  { title: "Signal Cross-References", videoUrl: "https://www.loom.com/share/3288d29dc138421aa910688bf8f80bfd" },
  { title: "Sheet Interconnection", videoUrl: "https://www.loom.com/share/54dba11468fe4679b9de3f086f34ee7c" },
  { title: "Panel Cabinet", videoUrl: "https://www.loom.com/share/de27fb3e4bd541dc94d03c0b9c307211" },
  { title: "DIN Rails and Cable Ducts", videoUrl: "https://www.loom.com/share/a281065c6ba34c919c31e92ca1fd695f" },
  { title: "Inserting Component Models", videoUrl: "https://www.loom.com/share/0aa2446395584c74b1fe77109d09fb42" },
  { title: "Report Generation", videoUrl: "https://www.loom.com/share/d88249a75ef244198fe8accb63f52d28" },
  { title: "Export Drawing", videoUrl: "https://www.loom.com/share/71539ab968514b0bb83eed86135974c4" },
  { title: "How To Add & Configure Database", videoUrl: "https://www.loom.com/share/e99cc53eb4c44e6991d14816be026157" },
];

// Shared product-platform blurb (homepage carousel + products index).
export const productsBlurb =
  "Design electrical, wiring, and fluid systems with seamless MCAD integration and automated design checks.";

export type Product = {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  highlights: string[];
  /** Path under /public; omit to show the placeholder. */
  image?: string;
  /** YouTube/Vimeo link — Johan provides; empty hides the player. */
  videoUrl: string;
};

export const products: Product[] = [
  {
    slug: "e3-schematic",
    name: "E3.schematic",
    summary:
      "Generate circuit diagrams, terminal, equipment and cable lists, and connection tables in one object-oriented design environment.",
    detail:
      "E3.schematic is a Windows-based platform built for automation, power generation, panel building and machinery. Its object-oriented engineering and complete IEC/ISO symbol libraries help you produce consistent documentation while minimising errors, with flexible reports and manufacturing-ready output.",
    highlights: [
      "IEC/ISO symbol libraries with virtually defined equipment",
      "Variant and options management",
      "Integrated PLC interfaces and Excel data exchange",
      "Automated generation of lists, tables and reports",
      "Optional 3D panel layout, hydraulics and pneumatics",
    ],
    image: "/products/Schematic.webp",
    videoUrl: "https://www.loom.com/share/fcd2893080044baca3ba20b653251f01",
  },
  {
    slug: "e3-cable",
    name: "E3.cable",
    summary:
      "Design custom harnesses, hoses and plug connections for complex electromechanical products.",
    detail:
      "E3.cable is an object-oriented solution for designing cables, hoses, ducts, liners and bundles — presenting the same object across every document at once. Ideal for machinery, marine, automotive and aerospace, it streamlines the workflow from concept to manufacturing and connects electronics with the physical harness.",
    highlights: [
      "Manage hoses, ducts, liners and bundles centrally",
      "Full-scale nailboard manufacturing templates",
      "Includes E3.schematic design capabilities",
      "3D assembly coordination via E3.3D Routing Bridge",
      "End-to-end control from concept to production",
    ],
    image: "/products/CABLE.webp",
    videoUrl: "https://www.loom.com/share/10f79eee3399432895d8bda0ab70009f",
  },
  {
    slug: "e3-panel",
    name: "E3.panel",
    summary:
      "Lay out and wire control-panel enclosures in 2D and 3D with automated design checks.",
    detail:
      "E3.panel adds real 3D cabinet and panel layout to E3.series. Place components on mounting plates and rails, route wiring and ducts in 3D, and run automated design and manufacturing checks — keeping the panel layout in sync with the schematic at all times.",
    highlights: [
      "2D and 3D panel and enclosure layout",
      "Component placement on plates and DIN rails",
      "Automated clearance and design checks",
      "Wire and duct routing with fill levels",
      "Manufacturing outputs: drilling, labelling, wiring",
    ],
    image: "/products/PANEL.webp",
    videoUrl: "https://www.loom.com/share/49717c0524394dcfacdeaab53874613d",
  },
  {
    slug: "e3-formboard",
    name: "E3.formboard",
    summary:
      "Produce 1:1 harness manufacturing drawings (nailboards) directly from your E3.cable design.",
    detail:
      "E3.formboard is an add-on to E3.cable for creating fully functional 1:1 harness manufacturing documentation. It turns the electrical design into precise nailboards production teams can build from, with dynamic links back to the source design.",
    highlights: [
      "Harnesses at any scale",
      "Automatic wire lengths and bundle diameters",
      "Wire segregation and connection specs",
      "Production-ready, optimised documentation",
      "Clips, convolute and heat-shrink support",
      "Dynamic link to the E3.cable design",
    ],
    image: "/products/FORMBOARD.webp",
    videoUrl: "https://vimeo.com/760231915",
  },
  {
    slug: "e3-topology",
    name: "E3.topology",
    summary:
      "Distribute components across the system and evaluate harnesses on scaled topology drawings.",
    detail:
      "E3.topology lets you place equipment and plan routing at the same time. Position components in defined installation spaces, establish valid pathways between them, and the wires and cables for each harness are organised automatically — from first sketch to finished documentation.",
    highlights: [
      "Integrated with E3.cable",
      "Scaled topology drawings with installation spaces",
      "Valid routing pathway definition",
      "Automatic harness assignment from connections",
      "Plan and place equipment simultaneously",
    ],
    image: "/products/TOPOLOGY.webp",
    videoUrl: "",
  },
  {
    slug: "e3-3d-routing-bridge",
    name: "E3.3D Routing Bridge",
    summary:
      "Bridge electrical harness design and major MCAD systems to build and validate digital prototypes.",
    detail:
      "The E3.3D Routing Bridge connects E3.series harness design with leading mechanical CAD systems. Electrical and mechanical teams work in parallel in their own tools, then merge data to validate designs virtually — removing the need for costly physical prototypes.",
    highlights: [
      "Supports SOLIDWORKS, CATIA V5, Creo, NX, Solid Edge, Inventor",
      "Parallel mechanical and electrical workflows",
      "Virtual prototyping cuts physical-prototype cost",
      "Seamless ECAD/MCAD data integration",
      "Fewer errors through early digital integration",
    ],
    // TODO(media): swap to the new routing-bridge image once uploaded to /public/products.
    image: "/products/3D%20routing%20bridge.webp",
    videoUrl: "",
  },
  {
    slug: "e3-3d-transformer",
    name: "E3.3D Transformer",
    summary:
      "Transform 3D MCAD harness data into standardised electrical topology models.",
    detail:
      "E3.3D Transformer extracts harness routing from leading MCAD platforms and converts it into standardised electrical topology data — automating the MCAD-to-ECAD handoff with built-in validation and company-specific rules.",
    highlights: [
      "Up to 75% faster than other MCAD plugins",
      "Fewer MCAD↔ECAD revision cycles",
      "CATIA, NX, Creo, SolidWorks, Solid Edge, Inventor",
      "Exports standard KBL and VEC formats",
      "Rule-based, configurable automation",
      "Built-in connectivity validation",
    ],
    // TODO(media): swap to the new transformer image once uploaded to /public/products.
    image: "/products/3D%20routing%20bridge.webp",
    videoUrl: "",
  },
  {
    slug: "e3-viewer",
    name: "E3.viewer",
    summary:
      "Share complete E3.series projects as read-only — free for any stakeholder to view.",
    detail:
      "E3.viewer is a free, read-only module that opens full E3.series projects in the same interface as the editor. Distribute projects safely to production, service, suppliers and customers, with full navigation, search and printing but no editing.",
    highlights: [
      "View all documents and equipment properties",
      "Search with dynamic pan and zoom",
      "Cross-reference navigation",
      "Multi-language interface",
      "Professional printing",
      "Free to distribute",
    ],
    image: "/products/3DVIEWER.webp",
    videoUrl: "",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

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

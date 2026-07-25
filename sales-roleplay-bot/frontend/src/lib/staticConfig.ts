import type { ConfigOptions, Scenario } from "./types";

/**
 * Left-panel dropdown options and scenario list. This data is static (it
 * never changes at runtime), so it ships with the frontend bundle instead of
 * being fetched from the backend — the app now only talks to the backend for
 * the two things that actually require it: starting a session
 * (POST /api/session/start) and ending one (POST /api/session/:id/end).
 *
 * Mirrors personas/config-options.json and personas/scenarios.json, which
 * the backend's persona engine uses server-side for the same data.
 */
export const CONFIG_OPTIONS: ConfigOptions = {
  industries: ["Healthcare", "Finance", "Education", "Manufacturing", "Real Estate", "Retail", "Technology"],
  rolesByIndustry: {
    Healthcare: ["Practice Manager", "Hospital CFO", "Clinical Director", "IT Director"],
    Finance: ["CFO", "Compliance Officer", "VP of Operations", "Investment Manager"],
    Education: ["Superintendent", "Head of IT", "Dean of Admissions", "Procurement Lead"],
    Manufacturing: ["Plant Manager", "VP of Supply Chain", "Operations Director", "COO"],
    "Real Estate": ["Broker Owner", "Property Portfolio Manager", "Development Director", "Sales Director"],
    Retail: ["VP of Merchandising", "Store Operations Director", "E-commerce Manager", "CFO"],
    Technology: ["VP of Engineering", "Head of Product", "CTO", "IT Procurement Manager"],
  },
  personalities: [
    "Friendly",
    "Busy",
    "Analytical",
    "Aggressive",
    "Skeptical",
    "Price Sensitive",
    "Technical Buyer",
    "Decision Maker",
  ],
  companySizes: ["Startup", "Small Business", "Mid-Market", "Enterprise"],
  buyingStages: ["Just Exploring", "Actively Comparing", "Ready to Decide", "Renewal / Post-Purchase"],
  budgets: ["Tight", "Moderate", "Flexible", "Enterprise-Scale"],
  difficulties: ["Easy", "Medium", "Hard", "Expert", "Nightmare"],
};

export const SCENARIOS: Scenario[] = [
  {
    id: "cold-call",
    name: "Cold Call",
    description: "You're calling this customer out of the blue. They don't know you or your product yet.",
    openingStyle:
      "Answer as if you just picked up an unexpected call. You're mildly guarded and want to know who this is and why they're calling within the first few seconds. Give the rep very little to work with until they earn your attention.",
  },
  {
    id: "product-demo",
    name: "Product Demo",
    description:
      "You agreed to a scheduled demo because you're evaluating solutions. You expect the rep to show real value quickly.",
    openingStyle:
      "Open by referencing that you set aside time for this demo and expect them to get to the point. Ask pointed questions about how features map to your actual workflow.",
  },
  {
    id: "follow-up-call",
    name: "Follow-up Call",
    description: "You spoke with this rep before. Some time has passed and priorities may have shifted.",
    openingStyle:
      "Open by referencing the prior conversation vaguely and let the rep re-establish context. Reveal whether your priorities have changed only if asked well.",
  },
  {
    id: "pricing-negotiation",
    name: "Pricing Negotiation",
    description: "You're interested but focused entirely on price, terms, and getting the best deal.",
    openingStyle:
      "Open by acknowledging you like the product but immediately steer to price. Push back on the first number you hear, always.",
  },
  {
    id: "renewal-discussion",
    name: "Renewal Discussion",
    description:
      "You're an existing customer. Your contract is coming up and you're deciding whether to renew, downgrade, or churn.",
    openingStyle:
      "Open by referencing your current usage/experience with the product (mention at least one gripe or unused feature) before discussing renewal terms.",
  },
  {
    id: "enterprise-sales",
    name: "Enterprise Sales",
    description:
      "A complex, multi-stakeholder deal. You represent one voice in a larger buying committee and are cautious about risk.",
    openingStyle:
      "Open by making clear this decision isn't yours alone — mention procurement, security review, or other stakeholders early, and probe for enterprise-readiness (SLAs, security, integrations).",
  },
];

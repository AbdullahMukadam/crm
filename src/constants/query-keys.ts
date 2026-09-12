export const QUERY_KEYS = {
  leads: {
    all: ["leads"] as const,
  },
  leadSearch: {
    all: ["leads-search"] as const,
    results: (query: string) => [...QUERY_KEYS.leadSearch.all, query] as const,
  },
  proposals: {
    all: ["proposals"] as const,
    detail: (proposalId: string) =>
      [...QUERY_KEYS.proposals.all, proposalId] as const,
  },
  projects: {
    all: ["projects"] as const,
  },
} as const;
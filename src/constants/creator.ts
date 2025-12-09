
export const CREATOR_API_ENDPOINTS = {
  UPLOAD_IMAGE: '/api/creator/upload-image',
  FETCH_PROPOSALS: '/api/creator/fetch-proposals',
  CREATE_PROPOSAL: '/api/creator/create-proposal',
  SAVE_PROPOSAL_DATA: '/api/creator/save-proposal-data',
  GET_PROPOSAL: '/api/creator/get-proposal',
  DELETE_PROPOSAL: '/api/creator/delete-proposal',
  CREATE_BRANDING: '/api/creator/create-branding',
  FETCH_BRANDING: "/api/creator/fetch-branding",
  CREATE_LEAD: "/api/creator/save-lead",
  GENERATE_URL : "/api/creator/generate-url",
  FETCH_LEADS : "/api/creator/fetch-leads",
  DELETE_LEAD : "/api/creator/delete-leads",
  TRACK_VISIT : "/api/creator/track-visit",
  UPDATE_PROPOSAL_STATUS : "/api/creator/update-proposal-status",
  SEARCH_LEADS : "/api/creator/search-leads"
} as const;
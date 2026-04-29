export interface VerifiedProfile {
  platform: string;
  username: string;
  url: string;
  verified: boolean;
  bioExcerpt?: string;
}

export interface CrossLinkedAccount {
  platform: string;
  url: string;
  discoveredVia: string; // e.g. "Linked from LinkedIn contact section"
}

export interface IdentityGroup {
  groupName: string; // "Person A", "Person B"
  displayName: string;
  summary: string;
  matchedDetails: {
    location?: string | null;
    profession?: string | null;
    education?: string | null;
    interests?: string | null;
    company?: string | null;
  };
  verifiedProfiles: VerifiedProfile[];
  crossLinkedAccounts: CrossLinkedAccount[];
  verifiedDataPoints: string[]; // at least 3
  connectionExplanation: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface FinderReport {
  subject: {
    fullName: string;
    location: string | null;
    interests: string | null;
    profession: string | null;
    knownUsernames: string | null;
  };
  summary: string;
  groups: IdentityGroup[]; // empty if no confirmed match
  noConfirmedMatch: boolean;
  disclaimer: string;
}

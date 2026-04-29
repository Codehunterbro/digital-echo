export interface FinderProfile {
  platform: string;
  username: string;
  displayName: string;
  url: string;
  avatarHint: string;
  bio: string;
  location: string;
  followers: number | null;
  following: number | null;
  posts: number | null;
  lastActive: string;
  verified: boolean;
  confidence: number;
  matchingIndicators: string[];
  inconsistencies: string[];
  status: 'Shortlisted' | 'Eliminated' | 'Needs Review';
}

export interface FinderReport {
  subject: {
    fullName: string;
    location: string | null;
    interests: string | null;
    profession: string | null;
  };
  summary: string;
  overallConfidence: number;
  verdict: 'Confirmed Match' | 'Likely Match' | 'Possible Match' | 'No Confirmed Match';
  profiles: FinderProfile[];
  crossChecks: string[];
  recommendations: string[];
  disclaimer: string;
}

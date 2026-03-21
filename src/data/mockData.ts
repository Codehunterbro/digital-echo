export interface PersonData {
  name: string;
  username: string;
  avatar: string;
  riskScore: number;
  behavioral: BehavioralData;
  location: LocationData;
  personal: PersonalData;
  social: SocialPlatform[];
}

export interface BehavioralData {
  sleepPattern: string;
  activeHours: string;
  avgDailyScreenTime: string;
  sentiment: { label: string; value: number; color: string }[];
  websiteVisits: { site: string; frequency: string }[];
}

export interface LocationData {
  locality: string;
  city: string;
  country: string;
  timezone: string;
  isp: string;
  geoPatterns: string[];
}

export interface PersonalData {
  fullName: string;
  aliases: string[];
  bio: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface SocialPlatform {
  platform: string;
  username: string;
  confidence: number;
  followers: number;
  posts: number;
  lastActive: string;
  color: string;
  recentActivity: { type: string; content: string; date: string; engagement: number }[];
}

export const mockPerson: PersonData = {
  name: "Alex Mercer",
  username: "ghost_cipher",
  avatar: "AM",
  riskScore: 72,
  behavioral: {
    sleepPattern: "1:00 AM – 8:30 AM",
    activeHours: "10:00 AM – 2:00 AM",
    avgDailyScreenTime: "6.4 hrs",
    sentiment: [
      { label: "Neutral", value: 45, color: "hsl(210, 15%, 50%)" },
      { label: "Curious", value: 25, color: "hsl(170, 80%, 50%)" },
      { label: "Frustrated", value: 15, color: "hsl(0, 70%, 55%)" },
      { label: "Happy", value: 10, color: "hsl(40, 90%, 55%)" },
      { label: "Sarcastic", value: 5, color: "hsl(280, 70%, 55%)" },
    ],
    websiteVisits: [
      { site: "github.com", frequency: "Daily" },
      { site: "stackoverflow.com", frequency: "Daily" },
      { site: "hackernews", frequency: "3x/week" },
      { site: "arxiv.org", frequency: "Weekly" },
    ],
  },
  location: {
    city: "Berlin",
    country: "Germany",
    timezone: "CET (UTC+1)",
    coordinates: { lat: 52.52, lng: 13.405 },
    geoPatterns: [
      "Primarily active from European timezone",
      "Occasional late-night posts suggest travel to US West Coast",
      "Check-ins near university district",
    ],
  },
  personal: {
    fullName: "Alexander J. Mercer",
    aliases: ["ghost_cipher", "a.mercer_dev", "alexm_sec", "cipher_ghost"],
    bio: "Security researcher & open-source contributor. Breaking things to understand them.",
    email: "a.mercer@pr***mail.com",
    phone: "+49 *** *** 4821",
    avatarUrl: "",
  },
  social: [
    {
      platform: "Reddit",
      username: "ghost_cipher",
      confidence: 94,
      followers: 1247,
      posts: 342,
      lastActive: "2 hours ago",
      color: "hsl(16, 100%, 50%)",
      recentActivity: [
        { type: "Post", content: "Analysis of the latest CVE-2024-XXXX vulnerability", date: "2h ago", engagement: 847 },
        { type: "Comment", content: "The real issue is the lack of input validation on the API endpoint...", date: "5h ago", engagement: 124 },
        { type: "Post", content: "Open-source OSINT tool I've been working on", date: "1d ago", engagement: 2103 },
      ],
    },
    {
      platform: "GitHub",
      username: "a.mercer_dev",
      confidence: 98,
      followers: 3891,
      posts: 1247,
      lastActive: "30 min ago",
      color: "hsl(0, 0%, 75%)",
      recentActivity: [
        { type: "Commit", content: "fix: patch memory leak in scanner module", date: "30m ago", engagement: 12 },
        { type: "PR", content: "feat: add TLS fingerprinting support", date: "3h ago", engagement: 45 },
        { type: "Issue", content: "False positive in DNS resolution module", date: "1d ago", engagement: 8 },
      ],
    },
    {
      platform: "X (Twitter)",
      username: "cipher_ghost",
      confidence: 87,
      followers: 8421,
      posts: 2891,
      lastActive: "4 hours ago",
      color: "hsl(210, 10%, 80%)",
      recentActivity: [
        { type: "Tweet", content: "New zero-day disclosed. Patch your systems. Thread 🧵", date: "4h ago", engagement: 1247 },
        { type: "Reply", content: "This is exactly why we need better supply chain security...", date: "6h ago", engagement: 89 },
      ],
    },
    {
      platform: "LinkedIn",
      username: "alexander-mercer",
      confidence: 91,
      followers: 2147,
      posts: 89,
      lastActive: "1 day ago",
      color: "hsl(210, 80%, 50%)",
      recentActivity: [
        { type: "Article", content: "The Future of Application Security in 2024", date: "1d ago", engagement: 342 },
        { type: "Post", content: "Excited to speak at DEF CON this year", date: "3d ago", engagement: 891 },
      ],
    },
    {
      platform: "YouTube",
      username: "GhostCipher",
      confidence: 76,
      followers: 12400,
      posts: 47,
      lastActive: "3 days ago",
      color: "hsl(0, 100%, 50%)",
      recentActivity: [
        { type: "Video", content: "Reverse Engineering a Malware Sample - Live", date: "3d ago", engagement: 24000 },
        { type: "Video", content: "Bug Bounty Hunting Tutorial (Beginner)", date: "1w ago", engagement: 18700 },
      ],
    },
    {
      platform: "Instagram",
      username: "alex.mercer.sec",
      confidence: 62,
      followers: 891,
      posts: 124,
      lastActive: "5 days ago",
      color: "hsl(330, 80%, 55%)",
      recentActivity: [
        { type: "Photo", content: "Conference badge at Black Hat", date: "5d ago", engagement: 342 },
        { type: "Story", content: "Late night coding session", date: "1w ago", engagement: 89 },
      ],
    },
  ],
};

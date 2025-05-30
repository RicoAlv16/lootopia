export interface HuntStep {
  riddle: string;
  validationType: string;
  answer: string;
  hasMap: boolean;
}

export interface HuntLandmark {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface MapConfig {
  name: string;
  skin: string;
  zone: string;
  scale: number;
}

export interface HuntRewards {
  first: number;
  second: number;
  third: number;
}

export interface HuntForm {
  title: string;
  description: string;
  duration: number;
  worldType: string;
  mode: string;
  maxParticipants: number;
  participationFee: number;
  chatEnabled: boolean;
  interactiveMap: boolean;
  mapConfig: MapConfig;
  steps: HuntStep[];
  landmarks: HuntLandmark[];
  rewards: HuntRewards;
  searchDelay: number;
  searchCost: number;
}

export interface CreatedHunt {
  id: string;
  user: string;
  title: string;
  description: string;
  duration: number;
  worldType: string;
  mode: string;
  maxParticipants: number;
  participationFee: number;
  chatEnabled: boolean;
  interactiveMap: boolean;
  mapConfig: MapConfig;
  steps: HuntStep[];
  landmarks: HuntLandmark[];
  rewards: HuntRewards;
  searchDelay: number;
  searchCost: number;
  status: 'active' | 'draft' | 'private' | 'completed';
  participants: number;
  createdAt: Date;
}

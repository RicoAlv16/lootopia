export interface ActiveHunt {
  id: string;
  title: string;
  description: string;
  duration: number;
  worldType: string;
  mode: string;
  maxParticipants: number;
  participationFee: number;
  chatEnabled: boolean;
  interactiveMap: boolean;
  mapConfig: {
    name: string;
    skin: string;
    zone: string;
    scale: number;
  };
  steps: {
    title: string;
    description: string;
    riddle: string;
    validationType: string;
    answer: string;
    hasMap: boolean;
    latitude: number;
    longitude: number;
  }[];
  landmarks: {
    name: string;
    latitude: number;
    longitude: number;
    description: string;
  }[];
  rewards: {
    first: number;
    second: number;
    third: number;
  };
  searchDelay: number;
  searchCost: number;
  status: string;
  participants: number;
  user: {
    email: string;
    nickname: string;
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

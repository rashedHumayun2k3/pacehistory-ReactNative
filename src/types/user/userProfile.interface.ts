export interface UserProfile {
  id: number | null;
  profilePicture?: string | null;
  profileBannerPicture?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileName?: string | null;
  profileSummery?: string | null;
  totalFollowing?: string | null;
  totalFollowers?: string | null;
  email?: string | null;
  password?: string | null;
  socialLoginProvider?: string | null;
  preferredEventCategory?: string | null;
  achievements?: string | null;
  facebookHandle?: string | null;
  instagramHandle?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  district_State?: string | null;
  country?: string | null;
  totalRunsThisYear?: number | null;
  totalParticipatedEvents?: number | null;
  stravaAccessToken?: string | null;
  stravaRefreshToken?: string | null;
  isTrainer?: boolean | null;
  isActive?: boolean | null;
  historyOfLife?: string | null;
  imageProfilePicture?: string | null;
  imageProfileBanner?: string | null;
  sportsTrackingApp: string;
  sportsTrackingProfileLink: string | null;
  badges?: UserBadge[];
  medalPictureLinks?: string;
  runningWebsiteHistory?: string;
  prHistory?: string;
}

export interface UserBadge {
  achievementBadgeId: number;
  achievementCount: number;
}

export interface EventResult {
  resultId: number;
  eventId: number;
  userId: number;
  userName: string;
  eventName: string;
  eventYear: number;
  eventDate: string;
  raceDistance: string;
  bibNumber: string;
  raceCategory: string;
  categoryName: string;
  chipStart: string;
  finishTime: string;
  result: string;
  pace: string;
  personalComment: string;
  country: string;
  raceScore: number;
  isBigAchievement: boolean;
  isPersonalBest: boolean;
  isAgeGroupWinner: boolean;
  qualifiedForKona: boolean;
  difficulty: string;
  pointAgeGroupId: number;
  medalPictureLink: string;
  userProfilePicture: string;
  eventProfilePicture: string;
  laps: number;
  averageSpeed: string;
  chipTime: string;
  ageGroupRank: number;
  genderWiseRank: number;
  historyOfTheAchievement: string;
  runningAppId: number;
  runningRecordLink: string;
  eventResultLink: string;
  isPacer: boolean;
  isRaceAmbassador: boolean;
  imageEventFinisher: string;
  imageCertificate: string;
  imageMedalPicture: string;
}

export interface ParticipatedEventResult {
  resultId: number;
  userId: number;
  userName: string;
  eventId: number;
  eventCode?: string;
  eventName: string;
  eventYear: number;
  bibNumber: string;
  raceDistance: string;
  finishTime: string;
  pace: string;
  raceScore: number;
  isBigAchievement: boolean;
  isPersonalBest: boolean;
  isAgeGroupWinner: boolean;
  difficulty: string;
  personalComment: string;
  historyOfTheAchievement: string;
  trackingAppName: string;
  trackingRecordLink: string;
  eventResultLink: string;
  isPacer: boolean;
  isRaceAmbassador: boolean;
  imageEventFinisher: string;
  imageCertificate: string;
  imageMedalPicture: string;
  eventMadelId: number;
  ageGroupRank: number;
  genderWiseRank: number;
  elevationGain: number;
  elevationLoss: number;
  achievementBadgeId: number;
}

export interface UserEventSummary {
  totalFinishedRaces: number;
  totalRoadRunning: number;
  totalTrailRunning: number;
  totalUltraRunning: number;
  totalHalfIronman: number;
  totalFullIronman: number;
  totalLongestRaceDistance: number;
  highestElevationGain: number;
  totalBestPerformanceRace: number;
}

export interface UserMedals {
  eventMadelId?: number;
  eventId?: number;
  userId?: number;
  medelPictureLink?: string;
  eventYear: number;
  titleOfMadelPicture?: string;
  uploadedBy?: string;
  eventName?: string;
  usageCount?: number;
  uploadDate?: Date;
  isSpecial?: boolean;
}

export interface EventCertificate {
  resultId?: number;
  eventId?: number;
  eventName?: string;
  eventYear?: number;
  userId?: number;
  imageCertificate?: string;
}

export interface LikeForActivityLog {
  activityLogId: number;
  totalLike: number;
  isCurrentUserLiked: boolean;
}

export interface UserReaction {
  eventId: number;
  userId: number;
  actionType: string;
  totalInterestedCount: number;
  totalGoingCount: number;
  totalLike: number;
  timestamp?: string;
}

export enum UserActionType {
  Interested = 'Interested',
  Going = 'Going',
  Like = 'Like',
}

interface ShowItemExtra {
  facebook_handle?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  url1?: string;
  youtube_url?: string;
}

interface ShowItem {
  averageDuration: number;
  totalEpisodes: number;
  totalSubscriptions: number;
  subscribed: boolean;
  subscribedOn: string;
  artworkUrl: string;
  author: string;
  date: Date;
  description: string;
  descriptionHTML: string;
  link: string;
  rssFeedId: string;
  rssShowTitle: string;
  showId: string;
  title: string;
  primaryArtworkColor?: string;
  categoryIds?: string[];
  explicit: boolean;
  extra?: ShowItemExtra;
  totalStreams?: number;
  uniqueListeners?: number;
  monthlyListenData?: { x: string; y: number }[];
  followers?: UserItem[];
  topEpisodes?: EpisodeItem[];
  episodes?: EpisodeItem[];
  yearlyFollowData?: { x: string; y: number }[];
  featuredEpisodeId?: string;

  rss?: string;
  episodesById?: {
    [key: string]: EpisodeItem;
  };
  allEpisodeIds: string[];
  searchEpisodeIds: string[];

  claimedShow: ClaimedShowItems;
}

interface ReduxShowItem extends ShowItem {
  total?: number;
  episodeCursors?: {
    [key: number]: number;
  };
}

interface ClaimedShowItems extends ShowItem {
  stripeAccountId?: string;
  featuredEpisodeId: string;
  users: {
    [key: string]: {
      role: ClaimedShowRole;
      type: ClaimedShowType;
    };
  };
}

interface EpisodeItem {
  artworkUrl: string;
  author: string;
  categoryIds?: string[];
  calculatedDuration: number;
  primaryArtworkColor?: string;
  duration: number;
  date: Date;
  description: string;
  descriptionHTML: string;
  url: string;
  showTitle: string;
  episodeId: string;
  rssEpisodeTitle: string;
  showId: string;
  title: string;
  totalUpvoteCount: number;
  totalDownvoteCount: number;
  userRating: number;
  progress: number;
  numberOfComments: number;
  saved: boolean;
  downloadUrl?: string;
  downloadProgress?: number;
  completed?: boolean;
}

interface PlaylistItem {
  coverArtworkUrl: string;
  createdOn: Date;
  description: string;
  episodeIds: string[];
  playlistId: string;
  secret: boolean;
  title: string;
  userId: string;
  followed?: boolean;
  followerCount?: number;
}

interface UserItem {
  avatarUrl?: string;
  bio?: string;
  twitterId?: string;
  displayName: string;
  email: string;
  fcmToken?: string;
  handle?: string;
  onboarded?: boolean;
  streamUserToken?: string;
  userId: string;
  totalUserFollowers?: number;
  totalUserFollows?: number;
  totalListens?: number;
  totalKarma?: number;
  following?: boolean;
  isAuthedUser?: boolean;
  karma?: number;

  claimedShows?: string[];
}

interface ClipItem {
  clipId: string;
  createdOn: Date;
  endPosition: number;
  plainText: string;
  rootId: string;
  startPosition: number;
  type: string;
  userId: string;
  userRating: number;
  totalRating: number;
}

interface PostItem {
  postId: string;
  attachmentId?: string;
  attachmentType?: string;
  createdOn: Date;
  parentId: string;
  plainText: string;
  rootId: string;
  showId: string;
  type: string;
  userId: string;
  userRating?: number;
  totalRating?: number;
  startPosition?: number;
  endPosition?: number;
  numberOfComments?: number;
  categoryIds?: string[];
}

interface NotificationItem {
  createdOn: Date;
  followId: string;
  notificationId: string;
  read: boolean;
  rootId: string;
  title: string;
  type: string;
  userId: string;
  target?: string;
}

interface PostRatingItem {
  createdOn: Date;
  postId: string;
  postUserId: string;
  userId: string;
  value: number;
}

interface RatingItem {
  createdOn: Date;
  episodeId: string;
  showId: string;
  userId: string;
  value: number;
}

interface SpotlightItem {
  artworkUrl: string;
  contentType: string;
  createdOn: string;
  enabled: boolean;
  spotlightId: string;
  subtitle: string;
  targetId: string;
  title: string;
}

interface StationItem {
  createdOn: Date;
  episodeLimitPerShow: number;
  showIds: string[];
  sortMethod: string;
  stationId: string;
  title: string;
  userId: string;
}

interface TrackItem {
  listeningToId: string;
  payload: object;
  playbackState: string;
  rootId: string;
  routeName: string;
  subscribedOn: Date;
  type: string;
  userId: string;
}

interface StreamActivityItem {
  usersWhoRatedById: string[];
  verb: string;
  activityId: string;
  activityData: {
    userId: string;
  };
}

interface CommentItem {
  profile: UserItem;
  plainText: string;
  startPosition: number;
  endPosition: number;
  createdOn: Date;
  parentId: string;
  rootId: string;
  drawLine: boolean;
  totalRating: number;
  userRating: number;
  postId: string;
  clipId: string;
  commentUnavailable: boolean;
  type: string;
}

interface FeedListItem {
  podcast: EpisodeItem;
  sharerId?: string;
  userId: string;
  profile: UserItem;
  createdOn: Date;
  type: string;
  verb: string;
  value?: number;
  plainText?: string;
  startPosition?: number;
  endPosition?: number;
  comments?: CommentItem[];
  userRating?: number;
  totalRating?: number;
  postId?: string;
  clipId?: string;
  rootId?: string;
  sharedWith?: string[];
  usersWhoRatedById?: string[];
  featuredDisplayName: string;
  collapsedComments?: boolean;
  origin: {
    type: string;
    show?: {
      artworkUrl: string;
      title: string;
    };
    category: CategoryItem;
  };
  hideOrigin: boolean;
  replyIsAFollowedProfile: boolean;
}

interface CategoryItem {
  title: string;
  tintColor: string;
  categoryId: string;
  parentTitle: string;
  parentId: string;
  streamToken?: string;
  artworkUrl?: string;
}

interface CategoryItems {
  [key: string]: CategoryItem;
}

interface CategoryFollow {
  categoryFollowId: string;
  categoryId: string;
  categoryTitle: string;
  createdOn: Date;
  userId: string;
}

interface PaginatedResponse {
  items: any[];
  cursor: number;
  total: number;
}

interface ActionCreator {
  type: string;
  [key: string]: any;
}

interface ReactNavigationProp {
  goBack: () => void;
  dispatch: (val: any) => void;
}

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

declare module "*.png";
declare module "*.jpg";

declare module "react-native-circular-progress" {
  namespace CircularProgress {
    export interface CircularProgressProps {
      size: number | Animated.Value;
      width: number;
      backgroundWidth?: number;
      fill?: number;
      tintColor?: string;
      tintColorSecondary?: string;
      tintTransparency?: boolean;
      backgroundColor?: string;
      rotation?: number;
    }
  }
  // eslint-disable-next-line no-undef
  class CircularProgress extends React.Component<CircularProgressProps> {}
}

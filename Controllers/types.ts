// Controllers/types.ts
// Shapes of the data the server sends back. Dates arrive as ISO strings.

// ---------- Users ----------

export type User = {
  id: string;
  username?: string;
  email?: string;
};

// The small { id, username } object the server includes for the other person
export type UserSummary = {
  id: string;
  username: string;
};

// ---------- Friends ----------

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "BLOCKED";

// GET /friends/friend_requests
export type FriendRequest = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  requester?: User;
};

// ---------- Location shares ----------

export type LocationShareStatus = "REQUESTED" | "ACTIVE" | "ENDED" | "DECLINED";

// POST /request-location-share, PATCH /:id/accept, /:id/decline, /:id/end
export type LocationShare = {
  id: string;
  requesterId: string; // wants to see
  sharerId: string;    // being tracked
  status: LocationShareStatus;
  createdAt: string;
  endedAt: string | null;
};

// GET /location-share/requests
export type LocationShareRequest = LocationShare & {
  requester: UserSummary;
};

// Socket event "locationShare:accepted"
export type AcceptedShare = LocationShare & {
  sharer: UserSummary;
};
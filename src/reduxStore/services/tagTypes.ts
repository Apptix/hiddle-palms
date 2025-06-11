export const tagTypes = {
  notifications: "notifications",
  applications: "applications",
  authorization: "authorization",
  user: "user",
  users: "users",
  documents: "documents",
  metrics: "metrics"
} as const;

export type TTagTypeKeys = keyof typeof tagTypes;

export interface IGroup {
  groupID: number;
  groupName: string;
  description?: string | null;
  facebookURL?: string | null;
  instagramURL?: string | null;
  adminUserId: number;
  [key: string]: unknown;
}

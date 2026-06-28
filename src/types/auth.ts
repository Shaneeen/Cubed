export type UserRole = "super_admin" | "merchant";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  super_admin_id: string | null;
  created_at: string;
  updated_at: string;
};

import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const SUPER_ADMIN = {
  email: "superadmin@cubed.test",
  password: "SuperAdmin123!",
  fullName: "Cubed Super Admin",
  role: "super_admin",
};

const MERCHANT = {
  email: "merchant@cubed.test",
  password: "Merchant123!",
  fullName: "Cubed Test Merchant",
  role: "merchant",
};

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const users = data?.users ?? [];
    const match = users.find((user) => user.email?.toLowerCase() === email);

    if (match) {
      return match;
    }

    if (users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function ensureAuthUser({ email, password, fullName }) {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      }
    );

    if (error) {
      throw error;
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function ensureProfile({
  id,
  email,
  fullName,
  role,
  superAdminId = null,
}) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id,
      email: email.toLowerCase(),
      full_name: fullName,
      role,
      super_admin_id: superAdminId,
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    throw error;
  }
}

async function main() {
  const superAdminUser = await ensureAuthUser(SUPER_ADMIN);
  await ensureProfile({
    id: superAdminUser.id,
    email: SUPER_ADMIN.email,
    fullName: SUPER_ADMIN.fullName,
    role: SUPER_ADMIN.role,
  });

  const merchantUser = await ensureAuthUser(MERCHANT);
  await ensureProfile({
    id: merchantUser.id,
    email: MERCHANT.email,
    fullName: MERCHANT.fullName,
    role: MERCHANT.role,
    superAdminId: superAdminUser.id,
  });

  console.log("Seeded test accounts:");
  console.log(`super_admin: ${SUPER_ADMIN.email} / ${SUPER_ADMIN.password}`);
  console.log(`merchant: ${MERCHANT.email} / ${MERCHANT.password}`);
}

main().catch((error) => {
  console.error("Failed to seed test accounts.");
  console.error(error);
  process.exit(1);
});

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials"
      });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const admin = data[0];

    // Plain text password check for now
    if (admin.password !== password) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });

  } catch (err) {

    return res.status(500).json({
      error: "Server error"
    });

  }

}

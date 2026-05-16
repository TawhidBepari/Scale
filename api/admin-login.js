const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing fields"
      });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        email: data.email,
        role: data.role
      }
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

};

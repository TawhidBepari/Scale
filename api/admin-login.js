const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    );

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
      .maybeSingle();

    if (error) {
      console.error(error);

      return res.status(500).json({
        error: error.message
      });
    }

    if (!data) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    if (data.password !== password) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: data.id,
        email: data.email
      }
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: "Server error"
    });

  }

};

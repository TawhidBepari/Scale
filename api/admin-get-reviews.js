const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {

  if (req.method !== "GET") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }

  try {

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        services (
          title
        )
      `)
      .order("created_at", {
        ascending: false
      });

    if (error) {

      return res.status(500).json({
        error: error.message
      });

    }

    return res.status(200).json({
      success: true,
      reviews: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

};

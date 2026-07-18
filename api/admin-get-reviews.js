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

    console.log(
  "SERVICE KEY EXISTS:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log(
  "SERVICE KEY PREFIX:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,20)
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

  console.error(error);

  return res.status(500).json(error);

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

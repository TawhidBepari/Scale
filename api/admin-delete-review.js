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
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { id } = req.body;

    if(!id){

      return res.status(400).json({
        error: "Review ID required"
      });

    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if(error){

      console.error(error);

      return res.status(500).json(error);

    }

    return res.status(200).json({
      success: true
    });

  }

  catch(err){

    return res.status(500).json({
      error: err.message
    });

  }

};

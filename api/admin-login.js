const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {

  try {

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    return res.status(200).json({
      keyLength: key.length,
      startsWith: key.substring(0, 20),
      hasUrl: !!process.env.SUPABASE_URL
    });

  } catch(err) {

    return res.status(500).json({
      error: err.message
    });

  }

};

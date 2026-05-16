module.exports = async function handler(req, res) {

  return res.status(200).json({
    success: true,
    hasUrl: !!process.env.SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    urlPreview: process.env.SUPABASE_URL
      ? process.env.SUPABASE_URL.substring(0, 30)
      : null
  });

};

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[Supabase Error] يرجى التأكد من ضبط SUPABASE_URL و SUPABASE_KEY في ملف .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uncfniozdsyrudxpfaku.supabase.co"
const supabaseKey = "sb_publishable_Kl_lJVw1DiklDs2De6yZMg__EXxNQmk"

export const supabase = createClient(supabaseUrl, supabaseKey)
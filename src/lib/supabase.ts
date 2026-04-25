// supabaseClientとの接続
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBULIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBULIC_SUPABASE_ANON_KEY

export const supabase = createclient(supabaseUrl, supabaseAnonKey)


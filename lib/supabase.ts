import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bchahfdjolbnspwzgbbv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjaGFoZmRqb2xibnNwd3pnYmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMTQyMjMsImV4cCI6MjA1MjY5MDIyM30.HrRJKhnP9DsjKyVGLe-vVRs9Ntj7m3NAnm3nXXpFRkA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kcynemslulqiaivnnuvi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjeW5lbXNsdWxxaWFpdm5udXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTMzOTksImV4cCI6MjA1MTQyOTM5OX0.X3O29UMP1d_3LA6-B_Fzbqyr3wznE2EOzvie850ooZs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
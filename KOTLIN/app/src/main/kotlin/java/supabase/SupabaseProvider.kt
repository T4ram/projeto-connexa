package java.supabase

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.postgrest

object SupabaseProvider {
    val client: SupabaseClient by lazy {
        createSupabaseClient(
            supabaseUrl = "https://lqmhgkxbudftddkabhzb.supabase.co",
            supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbWhna3hidWRmdGRka2FiaHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzczMjQsImV4cCI6MjA3NDIxMzMyNH0.rxLmZOaGZSFbLR5msC1FsCvO-wlq5h3fTrwEy9p5s3U"
        ) {
            install(io.github.jan.supabase.gotrue.gotrue)
            install(io.github.jan.supabase.postgrest.postgrest)
        }
    }
}

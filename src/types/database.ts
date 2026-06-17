// This file will be auto-generated later via Supabase CLI
// `npx supabase gen types typescript --project-id "your-project-id" > src/types/database.ts`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          status: string
          created_at: string
        }
        Insert: any
        Update: any
      }
      // other tables will go here
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

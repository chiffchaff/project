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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          role: 'owner' | 'tenant'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone: string
          role: 'owner' | 'tenant'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          role?: 'owner' | 'tenant'
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          name: string
          location: string
          type: string
          rent: number
          due_date: number
          photos: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          location: string
          type: string
          rent: number
          due_date: number
          photos: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          location?: string
          type?: string
          rent?: number
          due_date?: number
          photos?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      property_amenities: {
        Row: {
          id: string
          property_id: string
          name: string
          included: boolean
          monthly_charge: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          included: boolean
          monthly_charge: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          included?: boolean
          monthly_charge?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
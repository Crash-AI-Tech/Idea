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
      ideas: {
        Row: {
          id: number
          title: string
          description: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          content: string
          user_id: string
          idea_id: number
          created_at: string
        }
        Insert: {
          id?: number
          content: string
          user_id: string
          idea_id: number
          created_at?: string
        }
        Update: {
          id?: number
          content?: string
          user_id?: string
          idea_id?: number
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: number
          user_id: string
          idea_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          idea_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          idea_id?: number
          created_at?: string
        }
      }
    }
  }
}
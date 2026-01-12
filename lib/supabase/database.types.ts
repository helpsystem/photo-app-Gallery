export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string;
          created_at: string;
          title: string | null;
          description: string | null;
          cloudinary_public_id: string;
          cloudinary_url: string;
          width: number;
          height: number;
          tags: string[] | null;
          category: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          cloudinary_public_id: string;
          cloudinary_url: string;
          width: number;
          height: number;
          tags?: string[] | null;
          category?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          cloudinary_public_id?: string;
          cloudinary_url?: string;
          width?: number;
          height?: number;
          tags?: string[] | null;
          category?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
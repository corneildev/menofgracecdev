export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string | null
          notes: string | null
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          country: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string | null
          notes?: string | null
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string | null
          notes?: string | null
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          chest: number | null
          created_at: string
          height: number | null
          hips: number | null
          id: string
          inseam: number | null
          label: string
          neck: number | null
          notes: string | null
          shoulder: number | null
          sleeve: number | null
          updated_at: string
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          label?: string
          neck?: number | null
          notes?: string | null
          shoulder?: number | null
          sleeve?: number | null
          updated_at?: string
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          label?: string
          neck?: number | null
          notes?: string | null
          shoulder?: number | null
          sleeve?: number | null
          updated_at?: string
          user_id?: string
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          fit: string | null
          id: string
          lapel: string | null
          lining: string | null
          monogram: string | null
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          size: string | null
          unit_price_fcfa: number
          unit_price_usd: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          fit?: string | null
          id?: string
          lapel?: string | null
          lining?: string | null
          monogram?: string | null
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity?: number
          size?: string | null
          unit_price_fcfa: number
          unit_price_usd: number
        }
        Update: {
          color?: string | null
          created_at?: string
          fit?: string | null
          id?: string
          lapel?: string | null
          lining?: string | null
          monogram?: string | null
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          size?: string | null
          unit_price_fcfa?: number
          unit_price_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_full_name: string
          customer_phone: string
          delivery_fcfa: number
          guest_email: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipping_address: string
          shipping_city: string
          shipping_country: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_session_id: string | null
          subtotal_fcfa: number
          subtotal_usd: number
          total_fcfa: number
          total_usd: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_full_name: string
          customer_phone: string
          delivery_fcfa?: number
          guest_email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address: string
          shipping_city: string
          shipping_country: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          subtotal_fcfa?: number
          subtotal_usd?: number
          total_fcfa?: number
          total_usd?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_full_name?: string
          customer_phone?: string
          delivery_fcfa?: number
          guest_email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: string
          shipping_city?: string
          shipping_country?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          subtotal_fcfa?: number
          subtotal_usd?: number
          total_fcfa?: number
          total_usd?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          position: number
          product_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          position?: number
          product_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          position?: number
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          colors: string[]
          created_at: string
          description: string | null
          details: string[]
          fabric_composition: string | null
          fabric_mill: string | null
          fabric_notes: string | null
          fabric_weight: string | null
          fits: string[]
          id: string
          is_published: boolean
          lapels: string[]
          linings: string[]
          monogram: boolean
          name: string
          price_eur: number
          price_fcfa: number
          price_usd: number
          short_description: string | null
          sizes: string[]
          slug: string
          sold_out_sizes: string[]
          stock: number
          story: string | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          colors?: string[]
          created_at?: string
          description?: string | null
          details?: string[]
          fabric_composition?: string | null
          fabric_mill?: string | null
          fabric_notes?: string | null
          fabric_weight?: string | null
          fits?: string[]
          id?: string
          is_published?: boolean
          lapels?: string[]
          linings?: string[]
          monogram?: boolean
          name: string
          price_eur: number
          price_fcfa: number
          price_usd: number
          short_description?: string | null
          sizes?: string[]
          slug: string
          sold_out_sizes?: string[]
          stock?: number
          story?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          colors?: string[]
          created_at?: string
          description?: string | null
          details?: string[]
          fabric_composition?: string | null
          fabric_mill?: string | null
          fabric_notes?: string | null
          fabric_weight?: string | null
          fits?: string[]
          id?: string
          is_published?: boolean
          lapels?: string[]
          linings?: string[]
          monogram?: boolean
          name?: string
          price_eur?: number
          price_fcfa?: number
          price_usd?: number
          short_description?: string | null
          sizes?: string[]
          slug?: string
          sold_out_sizes?: string[]
          stock?: number
          story?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      restock_alerts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          notified: boolean
          product_id: string | null
          product_name: string | null
          product_slug: string | null
          size: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          notified?: boolean
          product_id?: string | null
          product_name?: string | null
          product_slug?: string | null
          size?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          notified?: boolean
          product_id?: string | null
          product_name?: string | null
          product_slug?: string | null
          size?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      order_status:
        | "pending_payment"
        | "paid"
        | "in_production"
        | "ready_for_delivery"
        | "delivered"
        | "cancelled"
      payment_method:
        | "mtn_momo"
        | "moov_money"
        | "orange_money"
        | "wave"
        | "card"
        | "bank_transfer"
        | "cash_on_delivery"
        | "manual"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      product_category:
        | "suits"
        | "wedding_suits"
        | "shirts"
        | "trousers"
        | "belts"
        | "accessories"
        | "bespoke"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer"],
      order_status: [
        "pending_payment",
        "paid",
        "in_production",
        "ready_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_method: [
        "mtn_momo",
        "moov_money",
        "orange_money",
        "wave",
        "card",
        "bank_transfer",
        "cash_on_delivery",
        "manual",
      ],
      payment_status: ["pending", "paid", "failed", "refunded"],
      product_category: [
        "suits",
        "wedding_suits",
        "shirts",
        "trousers",
        "belts",
        "accessories",
        "bespoke",
      ],
    },
  },
} as const

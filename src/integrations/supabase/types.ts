export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
<<<<<<< HEAD
  | Json[]
=======
  | Json[];
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
<<<<<<< HEAD
    PostgrestVersion: "14.5"
  }
=======
    PostgrestVersion: "14.5";
  };
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  public: {
    Tables: {
      addresses: {
        Row: {
<<<<<<< HEAD
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
      corporate_inquiries: {
        Row: {
          company: string
          context: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          principals_range: string | null
          role: string | null
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          company: string
          context?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          principals_range?: string | null
          role?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          company?: string
          context?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          principals_range?: string | null
          role?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
          idempotency_key: string | null
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
          idempotency_key?: string | null
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
          idempotency_key?: string | null
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
      product_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          product_name: string | null
          product_slug: string | null
          size: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          product_name?: string | null
          product_slug?: string | null
          size?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          product_name?: string | null
          product_slug?: string | null
          size?: string | null
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      place_order: {
        Args: {
          p_customer: Json
          p_idempotency_key?: string
          p_items: Json
          p_payment: Database["public"]["Enums"]["payment_method"]
        }
        Returns: Json
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "customer"
=======
          address_line: string;
          city: string;
          country: string;
          created_at: string;
          full_name: string;
          id: string;
          is_default: boolean;
          label: string | null;
          notes: string | null;
          phone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address_line: string;
          city: string;
          country: string;
          created_at?: string;
          full_name: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          notes?: string | null;
          phone: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address_line?: string;
          city?: string;
          country?: string;
          created_at?: string;
          full_name?: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          notes?: string | null;
          phone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      corporate_inquiries: {
        Row: {
          company: string;
          context: string | null;
          country: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          principals_range: string | null;
          role: string | null;
          status: string;
          timeline: string | null;
          updated_at: string;
        };
        Insert: {
          company: string;
          context?: string | null;
          country?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          principals_range?: string | null;
          role?: string | null;
          status?: string;
          timeline?: string | null;
          updated_at?: string;
        };
        Update: {
          company?: string;
          context?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          principals_range?: string | null;
          role?: string | null;
          status?: string;
          timeline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      measurements: {
        Row: {
          chest: number | null;
          created_at: string;
          height: number | null;
          hips: number | null;
          id: string;
          inseam: number | null;
          label: string;
          neck: number | null;
          notes: string | null;
          shoulder: number | null;
          sleeve: number | null;
          updated_at: string;
          user_id: string;
          waist: number | null;
          weight: number | null;
        };
        Insert: {
          chest?: number | null;
          created_at?: string;
          height?: number | null;
          hips?: number | null;
          id?: string;
          inseam?: number | null;
          label?: string;
          neck?: number | null;
          notes?: string | null;
          shoulder?: number | null;
          sleeve?: number | null;
          updated_at?: string;
          user_id: string;
          waist?: number | null;
          weight?: number | null;
        };
        Update: {
          chest?: number | null;
          created_at?: string;
          height?: number | null;
          hips?: number | null;
          id?: string;
          inseam?: number | null;
          label?: string;
          neck?: number | null;
          notes?: string | null;
          shoulder?: number | null;
          sleeve?: number | null;
          updated_at?: string;
          user_id?: string;
          waist?: number | null;
          weight?: number | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          color: string | null;
          created_at: string;
          fit: string | null;
          id: string;
          lapel: string | null;
          lining: string | null;
          monogram: string | null;
          order_id: string;
          product_id: string | null;
          product_image: string | null;
          product_name: string;
          quantity: number;
          size: string | null;
          unit_price_fcfa: number;
          unit_price_usd: number;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          fit?: string | null;
          id?: string;
          lapel?: string | null;
          lining?: string | null;
          monogram?: string | null;
          order_id: string;
          product_id?: string | null;
          product_image?: string | null;
          product_name: string;
          quantity?: number;
          size?: string | null;
          unit_price_fcfa: number;
          unit_price_usd: number;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          fit?: string | null;
          id?: string;
          lapel?: string | null;
          lining?: string | null;
          monogram?: string | null;
          order_id?: string;
          product_id?: string | null;
          product_image?: string | null;
          product_name?: string;
          quantity?: number;
          size?: string | null;
          unit_price_fcfa?: number;
          unit_price_usd?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          customer_email: string;
          customer_full_name: string;
          customer_phone: string;
          delivery_fcfa: number;
          guest_email: string | null;
          id: string;
          idempotency_key: string | null;
          notes: string | null;
          order_number: string;
          payment_method: Database["public"]["Enums"]["payment_method"] | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          shipping_address: string;
          shipping_city: string;
          shipping_country: string;
          status: Database["public"]["Enums"]["order_status"];
          stripe_session_id: string | null;
          subtotal_fcfa: number;
          subtotal_usd: number;
          total_fcfa: number;
          total_usd: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          customer_email: string;
          customer_full_name: string;
          customer_phone: string;
          delivery_fcfa?: number;
          guest_email?: string | null;
          id?: string;
          idempotency_key?: string | null;
          notes?: string | null;
          order_number?: string;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          shipping_address: string;
          shipping_city: string;
          shipping_country: string;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_session_id?: string | null;
          subtotal_fcfa?: number;
          subtotal_usd?: number;
          total_fcfa?: number;
          total_usd?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          customer_email?: string;
          customer_full_name?: string;
          customer_phone?: string;
          delivery_fcfa?: number;
          guest_email?: string | null;
          id?: string;
          idempotency_key?: string | null;
          notes?: string | null;
          order_number?: string;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          shipping_address?: string;
          shipping_city?: string;
          shipping_country?: string;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_session_id?: string | null;
          subtotal_fcfa?: number;
          subtotal_usd?: number;
          total_fcfa?: number;
          total_usd?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      product_events: {
        Row: {
          created_at: string;
          event_type: string;
          id: string;
          metadata: Json | null;
          product_name: string | null;
          product_slug: string | null;
          size: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_type: string;
          id?: string;
          metadata?: Json | null;
          product_name?: string | null;
          product_slug?: string | null;
          size?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_type?: string;
          id?: string;
          metadata?: Json | null;
          product_name?: string | null;
          product_slug?: string | null;
          size?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          created_at: string;
          id: string;
          is_primary: boolean;
          position: number;
          product_id: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          position?: number;
          product_id: string;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          position?: number;
          product_id?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"];
          colors: string[];
          created_at: string;
          description: string | null;
          details: string[];
          fabric_composition: string | null;
          fabric_mill: string | null;
          fabric_notes: string | null;
          fabric_weight: string | null;
          fits: string[];
          id: string;
          is_published: boolean;
          lapels: string[];
          linings: string[];
          monogram: boolean;
          name: string;
          price_eur: number;
          price_fcfa: number;
          price_usd: number;
          short_description: string | null;
          sizes: string[];
          slug: string;
          sold_out_sizes: string[];
          stock: number;
          story: string | null;
          updated_at: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["product_category"];
          colors?: string[];
          created_at?: string;
          description?: string | null;
          details?: string[];
          fabric_composition?: string | null;
          fabric_mill?: string | null;
          fabric_notes?: string | null;
          fabric_weight?: string | null;
          fits?: string[];
          id?: string;
          is_published?: boolean;
          lapels?: string[];
          linings?: string[];
          monogram?: boolean;
          name: string;
          price_eur: number;
          price_fcfa: number;
          price_usd: number;
          short_description?: string | null;
          sizes?: string[];
          slug: string;
          sold_out_sizes?: string[];
          stock?: number;
          story?: string | null;
          updated_at?: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["product_category"];
          colors?: string[];
          created_at?: string;
          description?: string | null;
          details?: string[];
          fabric_composition?: string | null;
          fabric_mill?: string | null;
          fabric_notes?: string | null;
          fabric_weight?: string | null;
          fits?: string[];
          id?: string;
          is_published?: boolean;
          lapels?: string[];
          linings?: string[];
          monogram?: boolean;
          name?: string;
          price_eur?: number;
          price_fcfa?: number;
          price_usd?: number;
          short_description?: string | null;
          sizes?: string[];
          slug?: string;
          sold_out_sizes?: string[];
          stock?: number;
          story?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          city: string | null;
          country: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      restock_alerts: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          notified: boolean;
          product_id: string | null;
          product_name: string | null;
          product_slug: string | null;
          size: string | null;
          whatsapp: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          notified?: boolean;
          product_id?: string | null;
          product_name?: string | null;
          product_slug?: string | null;
          size?: string | null;
          whatsapp?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          notified?: boolean;
          product_id?: string | null;
          product_name?: string | null;
          product_slug?: string | null;
          size?: string | null;
          whatsapp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "restock_alerts_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_guest_order_confirmation: {
        Args: {
          p_access_token: string;
          p_order_id: string;
        };
        Returns: Json;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      place_order: {
        Args: {
          p_customer: Json;
          p_idempotency_key?: string;
          p_items: Json;
          p_payment: Database["public"]["Enums"]["payment_method"];
        };
        Returns: Json;
      };
    };
    Enums: {
      app_role: "admin" | "customer";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      order_status:
        | "pending_payment"
        | "paid"
        | "in_production"
        | "ready_for_delivery"
        | "delivered"
<<<<<<< HEAD
        | "cancelled"
=======
        | "cancelled";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      payment_method:
        | "mtn_momo"
        | "moov_money"
        | "orange_money"
        | "wave"
        | "card"
        | "bank_transfer"
        | "cash_on_delivery"
<<<<<<< HEAD
        | "manual"
      payment_status: "pending" | "paid" | "failed" | "refunded"
=======
        | "manual";
      payment_status: "pending" | "paid" | "failed" | "refunded";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      product_category:
        | "suits"
        | "wedding_suits"
        | "shirts"
        | "trousers"
        | "belts"
        | "accessories"
        | "bespoke"
        | "business_suits"
<<<<<<< HEAD
        | "executive_suits"
        | "shoes"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
=======
        | "executive_suits";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
<<<<<<< HEAD
    schema: keyof DatabaseWithoutInternals
=======
    schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
<<<<<<< HEAD
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
=======
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
<<<<<<< HEAD
        Row: infer R
      }
      ? R
      : never
    : never
=======
        Row: infer R;
      }
      ? R
      : never
    : never;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
<<<<<<< HEAD
    schema: keyof DatabaseWithoutInternals
=======
    schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
<<<<<<< HEAD
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
=======
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
<<<<<<< HEAD
        Insert: infer I
      }
      ? I
      : never
    : never
=======
        Insert: infer I;
      }
      ? I
      : never
    : never;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
<<<<<<< HEAD
    schema: keyof DatabaseWithoutInternals
=======
    schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
<<<<<<< HEAD
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
=======
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
<<<<<<< HEAD
        Update: infer U
      }
      ? U
      : never
    : never
=======
        Update: infer U;
      }
      ? U
      : never
    : never;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
<<<<<<< HEAD
    schema: keyof DatabaseWithoutInternals
=======
    schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
<<<<<<< HEAD
  schema: keyof DatabaseWithoutInternals
=======
  schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
<<<<<<< HEAD
    : never
=======
    : never;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
<<<<<<< HEAD
    schema: keyof DatabaseWithoutInternals
=======
    schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
<<<<<<< HEAD
  schema: keyof DatabaseWithoutInternals
=======
  schema: keyof DatabaseWithoutInternals;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
<<<<<<< HEAD
    : never
=======
    : never;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

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
        "business_suits",
        "executive_suits",
<<<<<<< HEAD
        "shoes",
      ],
    },
  },
} as const
=======
      ],
    },
  },
} as const;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

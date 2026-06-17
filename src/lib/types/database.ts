export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type OrderStatus = "pendente" | "aceito" | "preparando" | "saiu" | "entregue" | "cancelado";
export type PaymentMethod = "pix" | "credito" | "debito" | "dinheiro";
export type UserRole = "cliente" | "admin" | "motoboy";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          address_default: string | null;
          cashback_balance: number;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          address_default?: string | null;
          cashback_balance?: number;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          address_default?: string | null;
          cashback_balance?: number;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          image_url: string | null;
          stock_qty: number;
          stock_min: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          category: string;
          image_url?: string | null;
          stock_qty?: number;
          stock_min?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          image_url?: string | null;
          stock_qty?: number;
          stock_min?: number;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          total: number;
          payment_method: PaymentMethod;
          change_for: number | null;
          delivery_address: string;
          motoboy_id: string | null;
          notes: string | null;
          driver_lat: number | null;
          driver_lng: number | null;
          driver_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          total: number;
          payment_method: PaymentMethod;
          change_for?: number | null;
          delivery_address: string;
          motoboy_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: OrderStatus;
          motoboy_id?: string | null;
          notes?: string | null;
          driver_lat?: number | null;
          driver_lng?: number | null;
          driver_updated_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_motoboy_id_fkey";
            columns: ["motoboy_id"];
            isOneToOne: false;
            referencedRelation: "motoboys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          qty: number;
          price_at_time: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          qty: number;
          price_at_time: number;
        };
        Update: never;
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
          }
        ];
      };
      motoboys: {
        Row: {
          id: string;
          name: string;
          phone: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          active?: boolean;
        };
        Relationships: [];
      };
      stock_alerts: {
        Row: {
          id: string;
          product_id: string;
          triggered_at: string;
          resolved: boolean;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          triggered_at?: string;
          resolved?: boolean;
          resolved_at?: string | null;
        };
        Update: {
          resolved?: boolean;
          resolved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stock_alerts_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      user_role: UserRole;
    };
  };
}

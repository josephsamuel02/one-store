/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../DB/supabase";

export const COMPLETED_ORDER_RETENTION_DAYS = 30;
const RETENTION_MS = COMPLETED_ORDER_RETENTION_DAYS * 24 * 60 * 60 * 1000;

export function getOrderCompletedTimestamp(order: any): number | null {
  if (!order || Number(order.orderLevel) !== 3) return null;

  const rawDate =
    order.completed_at ??
    order.completedAt ??
    order.products?.[0]?.deliveryInfo?.completedAt ??
    order.created_at;

  if (!rawDate) return null;
  const parsed = new Date(rawDate).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export function isCompletedOrderExpired(order: any, now = Date.now()): boolean {
  if (Number(order?.orderLevel) !== 3) return false;
  const completedTs = getOrderCompletedTimestamp(order);
  if (completedTs == null) return false;
  return now - completedTs >= RETENTION_MS;
}

export function getDaysUntilOrderDeletion(order: any, now = Date.now()): number | null {
  const completedTs = getOrderCompletedTimestamp(order);
  if (completedTs == null) return null;
  const remainingMs = RETENTION_MS - (now - completedTs);
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
}

export async function purgeExpiredCompletedOrders(orders: any[]): Promise<any[]> {
  // 1. Trigger server-side DB cleanup RPC if installed in Supabase
  try {
    await supabase.rpc("cleanup_expired_completed_orders");
  } catch {
    // Ignore if SQL migration hasn't been executed yet
  }

  // 2. Delete any remaining expired completed orders directly & filter UI state
  const now = Date.now();
  const expiredIds: string[] = [];
  const activeOrders: any[] = [];

  for (const order of orders) {
    if (isCompletedOrderExpired(order, now)) {
      if (order?.id != null) expiredIds.push(String(order.id));
    } else {
      activeOrders.push(order);
    }
  }

  if (expiredIds.length > 0) {
    const { error } = await supabase.from("order").delete().in("id", expiredIds);
    if (error) {
      console.warn("Could not delete expired completed orders via RLS:", error.message);
    }
  }

  return activeOrders;
}

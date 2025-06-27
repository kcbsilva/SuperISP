// src/app/subscribers/page.tsx
'use client';

import { ListSubscribers } from '@/components/subscribers/ListSubscribers';

/**
 * Main Subscribers page
 * – shows the list (search, filters, pagination, stats)
 * – Add / Update / Remove modals are handled within ListSubscribers
 *   or in future via props callbacks if you extend it.
 */
export default function SubscribersPage() {
  return <ListSubscribers />;
}

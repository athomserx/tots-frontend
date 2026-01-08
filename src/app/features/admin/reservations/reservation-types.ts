/**
 * Reservation type enum
 * Block type is used for blocking spaces and are created by admin
 * Booking type is used for reservations
 */
export enum ReservationType {
  Block = 'block',
  Booking = 'client',
}

export interface Reservation {
  id: number;
  userId: number;
  spaceId: number;
  start: string;
  end: string;
  eventName?: string;
  type: ReservationType;
  createdAt: string;
  updatedAt: string;
}

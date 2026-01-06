/**
 * Reservation type enum
 * Block type is used for blocking spaces and are created by admin
 * Client type is used for reservations that are created by client
 */
export enum ReservationType {
  Block = 'block',
  Client = 'client',
}

export interface Reservation {
  id: number;
  userId: number;
  spaceId: number;
  start: string;
  end: string;
  type: ReservationType;
  createdAt: string;
  updatedAt: string;
}

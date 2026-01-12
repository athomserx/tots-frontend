export interface TimeSlot {
  start: string;
  end: string;
  startTime: string;
  endTime: string;
}

export interface AvailableDay {
  date: string;
  dayOfWeek: number;
  slots: TimeSlot[];
}

export interface AvailableSlotsResponse {
  data: AvailableDay[];
  meta: {
    totalDays: number;
    totalSlots: number;
  };
}

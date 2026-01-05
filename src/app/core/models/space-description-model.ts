type SpaceDescription = {
  value: string;
  label: string;
};

export const SPACE_TYPES: SpaceDescription[] = [
  { value: 'conference_room', label: 'Conference Room' },
  { value: 'huddle_room', label: 'Huddle Room' },
  { value: 'private_office', label: 'Private Office' },
  { value: 'hot_desk', label: 'Hot Desk' },
  { value: 'phone_booth', label: 'Phone Booth' },
  { value: 'training_room', label: 'Training Room' },
] as const;

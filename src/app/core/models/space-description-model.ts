type SpaceDescription = {
  value: string;
  label: string;
};

export const SPACE_TYPES: SpaceDescription[] = [
  { value: 'auditorio', label: 'Auditorio' },
  { value: 'sala_de_reuniones', label: 'Sala de Reuniones' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'laboratorio ', label: 'Laboratorio' },
] as const;

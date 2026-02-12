export type Measurement = {
  id: string;
  siteId: string;
  reading: number;
  takenAt: Date;
};

export type CreateMeasurement = Omit<Measurement, 'id'>;

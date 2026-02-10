export enum SiteType {
  WELL = 'WELL',
  PROCESSING_PLANT = 'PROCESSING_PLANT',
  REFINERY = 'REFINERY',
}

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Site = {
  name: string;
  emissionLimit: number;
  totalEmissionsToDate: number;
  siteType: SiteType;
  coordinates: Coordinate;
  isCompliant: boolean;
};

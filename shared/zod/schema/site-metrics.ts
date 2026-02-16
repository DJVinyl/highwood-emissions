import { Site } from './site';
import { Measurement } from './measurement';

export type SiteMetrics = {
  site: Site;
  measurements: Measurement[];
};

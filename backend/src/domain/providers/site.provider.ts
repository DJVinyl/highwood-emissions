import { inject, injectable } from 'inversify';
import { CreateSite, SiteMetrics } from '@highwood/shared';

import { asyncLogger as logger } from '../../lib/logger';
import { ErrorCode, HighwoodError } from '../../lib/highwood-error';
import { SiteRepository } from '../../repository/site.repository';
import { MeasurementRepository } from '../../repository/measurement.repository';

@injectable()
class SiteProvider {
  constructor(
    @inject(SiteRepository) private sitesRepository: SiteRepository,
    @inject(MeasurementRepository) private measurementRepository: MeasurementRepository,
  ) {}

  public async getSites() {
    logger.info('SiteProvider.getSites');

    try {
      const results = await this.sitesRepository.findAll();
      return results;
    } catch (error) {
      const highwoodError = new HighwoodError(ErrorCode.DATABASE_ERROR, 'Error finding Sites', error);
      logger.error({ error: highwoodError }, `${highwoodError.message}`);

      throw highwoodError;
    }
  }

  public async createSite(site: CreateSite) {
    logger.info(site, 'SiteProvider.createSite');
    const isCompliant = site.totalEmissionsToDate <= site.emissionLimit;

    try {
      return this.sitesRepository.insert({ ...site, isCompliant });
    } catch (error) {
      const highwoodError = new HighwoodError(ErrorCode.DATABASE_ERROR, 'Error creating site', error);
      logger.error({ error: highwoodError }, `${highwoodError.message}`);

      throw highwoodError;
    }
  }

  public async getSiteMetrics(siteId: string): Promise<SiteMetrics> {
    logger.info({ siteId }, 'SiteProvider.getSiteMetrics');
    const site = await this.sitesRepository.findOne(siteId);

    if (!site) {
      const highwoodError = new HighwoodError(ErrorCode.DATABASE_ERROR, 'Error finding Site Metrics');
      logger.error({ error: highwoodError }, `${highwoodError.message}`);

      throw highwoodError;
    }

    const siteMeasurements = await this.measurementRepository.getAllMeasurementsForSite(siteId);

    return { site, measurements: siteMeasurements };
  }
}

export { SiteProvider };

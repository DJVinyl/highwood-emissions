import { reveal, stub } from 'jest-auto-stub';

import { SiteType } from '../../../src/domain/entities/site';
import { SiteProvider } from '../../../src/domain/providers/site.provider';
import { SiteRepository } from '../../../src/repository/site.repository';

describe('SiteProvider', () => {
  const stubSiteRepository = stub<SiteRepository>();
  const provider = new SiteProvider(stubSiteRepository);
  const site = {
    name: 'I should use fishery+faker',
    emissionLimit: 321,
    totalEmissionsToDate: 3,
    siteType: SiteType.WELL,
    coordinates: {
      latitude: 10,
      longitude: 15,
    },
    isCompliant: true,
  };

  afterEach(jest.resetAllMocks);

  describe('createIndustrialSite', () => {
    it('should call sitesRepository.createIndustrialSite', async () => {
      await provider.createSite(site);

      expect(stubSiteRepository.insert).toHaveBeenCalledTimes(1);
      expect(stubSiteRepository.insert).toHaveBeenCalledWith(site);
    });

    it('should calculate the site compliance', async () => {
      const nonCompliantSite = {
        name: 'I should use fishery+faker',
        emissionLimit: 3,
        totalEmissionsToDate: 3312,
        siteType: SiteType.WELL,
        coordinates: {
          latitude: 10,
          longitude: 15,
        },
        isCompliant: true,
      };

      await provider.createSite(nonCompliantSite);

      expect(stubSiteRepository.insert).toHaveBeenCalledTimes(1);
      expect(stubSiteRepository.insert).toHaveBeenCalledWith({ ...nonCompliantSite, isCompliant: false });
    });
  });

  describe('getSiteMetrics', () => {
    it('should call siteRepository to find site', async () => {
      reveal(stubSiteRepository).findOne.mockResolvedValueOnce({
        ...site,
        id: 'id',
      });

      await provider.getSiteMetrics('siteId');

      expect(stubSiteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(stubSiteRepository.findOne).toHaveBeenCalledWith('siteId');
    });

    it('should return the site', async () => {
      reveal(stubSiteRepository).findOne.mockResolvedValueOnce({
        ...site,
        id: 'id',
      });

      await provider.getSiteMetrics('siteId');

      expect(stubSiteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(stubSiteRepository.findOne).toHaveBeenCalledWith('siteId');
    });

    it('should throw an error when no site is found', async () => {});
  });
});

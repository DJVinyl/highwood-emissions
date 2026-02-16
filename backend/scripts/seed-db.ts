import { faker } from '@faker-js/faker';
import { SiteType } from '@highwood/shared';

import { createPostGresDataSource } from '../src/configuration/database';
import { sitesTable } from '../src/repository/schema/site.schema';
import { measurementTable } from '../src/repository/schema/measurement.schema';

async function main() {
  const db = await createPostGresDataSource();
  console.log('Beginning Seed');

  const siteIds = Array.from({ length: 10 }).map(() => ({ id: faker.string.uuid() }));

  const siteSeed = [];
  for (const siteId of siteIds) {
    const measurementSeed = Array.from({ length: faker.number.int({ min: 5, max: 15 }) }).map(() => ({
      id: faker.string.uuid(),
      siteId: siteId.id,
      reading: faker.number.int({ min: 1, max: 500 }),
      takenAt: faker.date.past(),
    }));

    await db.insert(measurementTable).values(measurementSeed);

    const totalEmissions = measurementSeed.reduce((acc, currentValue) => acc + currentValue.reading, 0);

    siteSeed.push({
      id: siteId.id,
      name: faker.person.jobArea(),
      siteType: faker.helpers.enumValue(SiteType),
      emissionLimit: faker.number.int({ min: 1000, max: 8000 }),
      totalEmissionsToDate: totalEmissions,
      coordinates: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      isCompliant: true,
    });
  }

  await db.insert(sitesTable).values(siteSeed);
}

(async () => await main())();

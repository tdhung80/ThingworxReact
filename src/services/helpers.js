import faker from "faker";

export default function createRowData(count, startId) {
  startId = startId || 0;
  return [...Array(count).keys()].map(index => {
    return {
      id: startId + index,
      avartar: faker.image.avatar(),
      county: faker.address.county(),
      email: faker.internet.email(),
      title: faker.name.prefix(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      street: faker.address.streetName(),
      zipCode: faker.address.zipCode(),
      date: faker.date.past().toLocaleDateString(),
      jobTitle: faker.name.jobTitle(),
      catchPhrase: faker.company.catchPhrase(),
      companyName: faker.company.companyName(),
      jobArea: faker.name.jobArea(),
      jobType: faker.name.jobType()
    };
  });
}

const createChildRows = (count, startId) => {
  return [...Array(count).keys()].map(i => createRowData(i, startId || 0));
};

export function createRowDataWithSubrows(count, maxSubRowCount) {
  return [...Array(count).keys()].map(i => {
    const subRowCount = Math.floor((maxSubRowCount || 3) * Math.random());
    const teamMembers = createChildRows(subRowCount, count + i * subRowCount);
    return { ...createRowData(i), teamMembers };
  });
}

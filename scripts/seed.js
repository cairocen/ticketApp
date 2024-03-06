const { db } = require('@vercel/postgres');
const {
  tickets,
  sites,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedTickets(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "tickets" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier TEXT NOT NULL,
    site_code TEXT NOT NULL,
    site_name TEXT NOT NULL,
    technician_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    image_url TEXT,
    notification_emails TEXT ARRAY,
    status VARCHAR(255) NOT NULL
  );
`;

    console.log(`Created "tickets" table`);

    // Insert data into the "tickets" table
    const insertedTickets = await Promise.all(
      tickets.map(
        (ticket) => client.sql`
        INSERT INTO tickets (identifier, site_code, site_name, technician_name, contact_name, contact_phone, image_url, notification_emails, status)
        VALUES (${ticket.identifier}, ${ticket.site_code}, ${ticket.site_name}, ${ticket.technician_name}, ${ticket.contact_name}, ${ticket.contact_phone}, ${ticket.image_url}, ${ticket.notification_emails}, ${ticket.status})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedTickets.length} tickets`);

    return {
      createTable,
      tickets: insertedTickets,
    };
  } catch (error) {
    console.error('Error seeding tickets:', error);
    throw error;
  }
}

async function seedSites(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "sites" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_code TEXT NOT NULL,
    site_name TEXT NOT NULL,
    department TEXT NOT NULL,
    municipality TEXT NOT NULL,
    village TEXT NOT NULL,
    bandwidth INT NOT NULL,
    service_value INT NOT NULL,
    penalty_deduction INT NOT NULL,
    payment_value INT NOT NULL
  );
`;

    console.log(`Created "sites" table`);

    // Insert data into the "sites" table
    const insertedSites = await Promise.all(
      sites.map(
        (site) => client.sql`
        INSERT INTO sites (site_code, site_name, department, municipality, village, bandwidth, service_value, penalty_deduction, payment_value)
        VALUES (${site.site_code}, ${site.site_name}, ${site.department}, ${site.municipality}, ${site.village}, ${site.bandwidth}, ${site.service_value}, ${site.penalty_deduction}, ${site.payment_value})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedSites.length} sites`);

    return {
      createTable,
      sites: insertedSites,
    };
  } catch (error) {
    console.error('Error seeding sites:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedSites(client);
  await seedTickets(client);
  await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
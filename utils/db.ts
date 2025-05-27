// db.ts
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
  user: "prizrak",
  password: "123456",
  database: "login",
  hostname: "localhost",
  port: 5432,
});

await client.connect();

export default client;

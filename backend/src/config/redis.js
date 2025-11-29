import { createClient } from "redis";

let client = null;

export async function getRedis() {
  if (!client) {
    client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
    console.log("Redis connected.");
  }

  return client;
}

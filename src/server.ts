import http from "http";
import { createAppInstance } from "./app";
import { IDatabase } from "./repositories/interfaces/IDatabase";
import { MongoDB } from "./repositories/MongoDB";
import seedDatabase from "./middlewares/seedData.middleware";
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";
dotenv.config();
dotenv.config({ path: `.env.${env}` });

const port: number = normalizePort(process.env.PORT) || 3000;

export async function startServer() {
  const app = createAppInstance();
  app.set("port", port);

  // Connect to the database
  const database: IDatabase = new MongoDB(
    process.env.MONGODB_URI || "mongodb://localhost:27017/open-fabric"
  );
  await database.connect();

  // Uncomment the following line when you want to seed the database
  // await seedDatabase();

  const server = http.createServer(app);
  server.listen(port);
  server.on("error", onError);
  server.on("listening", () => onListening(server));
}

function normalizePort(val: string | undefined): number | undefined {
  const portNumber = parseInt(val || "", 10);
  if (isNaN(portNumber)) {
    return undefined;
  } else if (portNumber >= 0) {
    return portNumber;
  } else {
    return undefined;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(server: http.Server): void {
  const addr = server.address();
  if (addr) {
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  }
}

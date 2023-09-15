import { startServer } from "./server";
import { createAppInstance } from "./app";

const app = createAppInstance();

startServer();
export default app;

import express, { Application, Request } from "express";
import morgan from "morgan";
import appointmentsRouter from "./routes/appointments.routes";
import usersRouter from "./routes/users.routes";
import availabilityRouter from "./routes/availability.routes";
import servicesRouter from "./routes/services.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requireAuth } from "./middleware/auth";
import { createRateLimiter } from "./middleware/rateLimiter";
import { getClientType } from "./utils/clientType";

morgan.token("clientType", (req) => getClientType(req as Request));

export function createApp(): Application {
  const app = express();

  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms [client=:clientType]", {
      skip: () => process.env.NODE_ENV === "test",
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use(createRateLimiter());

  app.use(requireAuth);

  app.use("/appointments", appointmentsRouter);
  app.use("/users", usersRouter);
  app.use("/availability", availabilityRouter);
  app.use("/services", servicesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

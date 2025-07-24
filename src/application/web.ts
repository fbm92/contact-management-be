import express from "express";
import { publicRouter } from "../router/public-api";
import { apiRouter } from "../router/api";
import { errorMiddleWare } from "../middleware/error-middleware";
import cors from "cors";

export const web = express();
web.use(express.json());
web.use(
  cors({
    origin : "*",
    credentials : true
  })
);

web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleWare);

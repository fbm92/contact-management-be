import { NextFunction, Request, response, Response } from "express";
import { array, ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { Prisma } from "@prisma/client";

export const errorMiddleWare = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    const err = JSON.parse(error.message);
    let result  = ""
    for (let i = 0; i < err.length; i++) {
      result += `Path : ${err[i].path[0]} : ${err[i].message} <br>`
      // result.push({
      //   message : err[i].message,
      //   path : err[i].path[0]
      // })
    }
    res.status(400).json({
      // errors: JSON.stringify(result),
      errors : result
    });
  }
  else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};

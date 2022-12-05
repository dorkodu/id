import { NextFunction, Request, Response } from "express";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => any
export const handleErrors = (func: RouteHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(func(req, res, next))
    .catch(() => { res.status(500).send(); });
}
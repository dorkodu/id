import { NextFunction, Request, Response } from "express";

async function auth(req: Request, res: Response, next: NextFunction) {

}

async function temporaryAuth(req: Request, res: Response, next: NextFunction) {

}

async function login(req: Request, res: Response, next: NextFunction) {

}

async function signup(req: Request, res: Response, next: NextFunction) {

}

async function logout(req: Request, res: Response, next: NextFunction) {

}

export default { auth, temporaryAuth, login, signup, logout };
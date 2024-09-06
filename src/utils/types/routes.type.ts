import { Express } from "express";

interface Routes {
    listen(app: Express): boolean;
}

export {
	Routes
};

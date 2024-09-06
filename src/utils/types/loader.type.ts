import { Express } from "express";


export interface Loader {
	load(app: Express): Promise<boolean>;
}

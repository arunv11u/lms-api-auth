import { Repository } from "./repository.type";

export interface UnitOfWork {
	start(): Promise<void>;
	getAllRepositoryNames(): string[];
	getRepository(
		repositoryName: string
		// eslint-disable-next-line max-len
	): Repository;
	complete(): Promise<void>;
	dispose(): Promise<void>;
}



export abstract class Interactor {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract execute(): Promise<any>;
}
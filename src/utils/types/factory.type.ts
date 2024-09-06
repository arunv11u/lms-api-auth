

export abstract class Factory {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract make(objectName: string): any;
	abstract getAll(): string[];
}
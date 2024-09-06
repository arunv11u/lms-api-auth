import { DocsCountList } from "../../utils";

export class DocsCountListImpl<T> implements DocsCountList<T> {
	docs: T[] = [];
	count: number;
}

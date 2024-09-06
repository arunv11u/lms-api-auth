import { ResponseHandlerImpl } from "../response-handler";


export function getResponseHandler() {
	return new ResponseHandlerImpl();
}

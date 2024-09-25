/* eslint-disable indent */
import { GenericError } from "../errors";
import { ErrorCodes } from "../types";


enum Extensions {
	JPG = "jpg",
	JPEG = "jpeg",
	PNG = "png"
}

enum MimeTypes {
	JPG = "image/jpg",
	JPEG = "image/jpeg",
	PNG = "image/png"
}


function getExtensionFromMimeType(mimeType: string): string {
	let extension: string;

	switch (mimeType) {
		case MimeTypes.JPEG: {
			extension = Extensions.JPEG;
			break;
		}

		case MimeTypes.JPG: {
			extension = Extensions.JPG;
			break;
		}

		case MimeTypes.PNG: {
			extension = Extensions.PNG;
			break;
		}

		default: {
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Mimetype is invalid"),
				errorCode: 500
			});
		}
	}

	return extension;
}

export {
	Extensions,
	MimeTypes,
	getExtensionFromMimeType
};
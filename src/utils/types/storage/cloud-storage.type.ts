

interface UploadPreSignedURLFields {
	key: string;
	bucket: string;
	"X-Amz-Algorithm": string;
	"X-Amz-Credential": string;
	"X-Amz-Date": string;
	Policy: string;
	"X-Amz-Signature": string;
}

interface UploadPreSignedURLResponse {
	url: string;
	fields: UploadPreSignedURLFields;
}

abstract class CloudStorage {
	abstract get baseFilePath(): string;

	abstract set bucketName(bucketName: string);

	abstract set regionName(regionName: string);

	abstract set accessKeyId(accessKeyId: string);

	abstract set secretAccessKey(secretAccessKey: string);

	abstract set protocol(protocol: string);

	abstract set hostname(hostname: string);

	abstract set apiVersion(apiVersion: string);

	abstract set signatureVersion(signatureVersion: string);

	abstract set forcePathStyle(forcePathStyle: boolean);

	abstract init(): boolean;

	abstract getPreSignedUrlForUploading(
		key: string,
		expires: number, // seconds
		contentLength: number // bytes
	): Promise<UploadPreSignedURLResponse>;

	abstract getSignedUrlForRetrieving(
		key: string,
		expires: number // seconds
	): Promise<string>;

	abstract getObject(
		key: string
	): Promise<Buffer | null>;

	abstract deleteObject(
		key: string
	): Promise<void>;
}

export {
	UploadPreSignedURLResponse,
	CloudStorage
};
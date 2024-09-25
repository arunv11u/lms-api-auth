import { AWSError } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import {
	CloudStorage,
	ErrorCodes,
	UploadPreSignedURLResponse
} from "../types";
import {
	GenericError,
	StorageConnectionError
} from "../errors";



class S3Storage implements CloudStorage {
	private _storage: S3 | null = null;
	private _bucketName: string | null = null;
	private _regionName: string | null = null;
	private _accessKeyId: string | null = null;
	private _secretAccessKey: string | null = null;
	private _protocol: string | null = null;
	private _hostname: string | null = null;
	private _apiVersion: string | null = null;
	private _signatureVersion: string | null = null;
	private _forcePathStyle = false;
	private _baseFilePath: string | null = null;


	get baseFilePath() {
		if (!this._baseFilePath)
			throw new StorageConnectionError("S3 storage, cannot get baseFilePath before setting it");

		return this._baseFilePath;
	}

	set bucketName(bucketName: string) {
		this._bucketName = bucketName;
	}

	set regionName(regionName: string) {
		this._regionName = regionName;
	}

	set accessKeyId(accessKeyId: string) {
		this._accessKeyId = accessKeyId;
	}

	set secretAccessKey(secretAccessKey: string) {
		this._secretAccessKey = secretAccessKey;
	}

	set protocol(protocol: string) {
		this._protocol = protocol;
	}

	set hostname(hostname: string) {
		this._hostname = hostname;
	}

	set apiVersion(apiVersion: string) {
		this._apiVersion = apiVersion;
	}

	set signatureVersion(signatureVersion: string) {
		this._signatureVersion = signatureVersion;
	}

	set forcePathStyle(forcePathStyle: boolean) {
		this._forcePathStyle = forcePathStyle;
	}

	init(): boolean {
		if (!this._bucketName)
			throw new StorageConnectionError("S3 storage, bucket name is required to be set before init");
		if (!this._regionName)
			throw new StorageConnectionError("S3 storage, region name is required to be set before init");
		if (!this._protocol)
			throw new StorageConnectionError("S3 storage, protocol is required to be set before init");
		if (!this._hostname)
			throw new StorageConnectionError("S3 storage, hostname is required to be set before init");
		if (!this._apiVersion)
			throw new StorageConnectionError("S3 storage, apiVersion is required to be set before init");
		if (!this._signatureVersion)
			throw new StorageConnectionError("S3 storage, signatureVersion is required to be set before init");

		if (this._forcePathStyle)
			this._baseFilePath = `${this._protocol}://${this._hostname}/${this._bucketName}/`;
		else
			this._baseFilePath = `${this._protocol}://${this._bucketName}.${this._hostname}/`;

		let credentials = null;
		if (
			this._accessKeyId &&
			this._secretAccessKey
		) {
			credentials = {
				accessKeyId: this._accessKeyId,
				secretAccessKey: this._secretAccessKey
			};
		}

		this._storage = new S3({
			region: this._regionName ? this._regionName : undefined,
			credentials: credentials,
			endpoint: `${this._protocol}://${this._hostname}/`,
			apiVersion: this._apiVersion, // 2006-03-01, 2012-10-17
			signatureVersion: this._signatureVersion,
			s3ForcePathStyle: this._forcePathStyle
		});

		return true;
	}

	async getPreSignedUrlForUploading(
		key: string,
		expires: number,
		contentLength: number
	): Promise<UploadPreSignedURLResponse> {
		const storage = this._storage;
		const bucketName = this._bucketName;
		if (!storage)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 storage must be set before getting upload signed url"),
				errorCode: 500
			});

		if (!bucketName)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 bucketName must be set before getting upload signed url"),
				errorCode: 500
			});

		const url = await new Promise<UploadPreSignedURLResponse>(
			(resolve, reject) => {

				storage.createPresignedPost({
					Bucket: this._bucketName ? this._bucketName : undefined,
					Fields: {
						key: key
					},
					Expires: expires,
					Conditions: [
						["content-length-range", 0, contentLength]
					]
				}, (err, data) => {
					if (err) return reject(err);

					resolve(data as unknown as UploadPreSignedURLResponse);
				});
			});

		return url;
	}

	async getSignedUrlForRetrieving(
		key: string,
		expires: number
	): Promise<string> {
		if (!this._storage)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 storage must be set before getting read signed url for private object"),
				errorCode: 500
			});

		const url = await this._storage.getSignedUrlPromise("getObject", {
			Bucket: this._bucketName,
			Key: key,
			Expires: expires
		});

		return url;
	}

	async getObject(key: string): Promise<Buffer | null> {
		const storage = this._storage;
		const bucketName = this._bucketName;

		if (!storage)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 storage must be set before geting object"),
				errorCode: 500
			});

		if (!bucketName)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 bucketName must be set before geting object"),
				errorCode: 500
			});

		const data = await storage.getObject(
			{
				Bucket: bucketName,
				Key: key
			}
		).promise();

		if(data) return data.Body as Buffer;

		return null;
	}

	async deleteObject(
		key: string
	): Promise<void> {
		const storage = this._storage;
		const bucketName = this._bucketName;

		if (!storage)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 storage must be set before deleting object"),
				errorCode: 500
			});

		if (!bucketName)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("S3 bucketName must be set before deleting object"),
				errorCode: 500
			});

		await new Promise((resolve, reject) => {
			storage.deleteObject({
				Bucket: bucketName,
				Key: key
			}, (err: AWSError, data: S3.DeleteObjectOutput) => {
				if (err) return reject(err);

				resolve(data);
			});
		});
	}
}

export {
	S3Storage
};
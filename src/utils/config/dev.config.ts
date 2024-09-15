export const devConfig = {
	port: 3000,
	postgresURL: "postgresql://ep-cold-fog-a4kw7wqj.us-east-1.aws.neon.tech",
	postgresDatabaseName: "authentication",
	accessTokenExpiration: 1 * 60 * 60,
	refreshTokenExpiration: 2 * 24 * 60 * 60,
	messagingConsumerGroupId: "authentication-service-group",
	bootstrapKafkaBroker: "my-cluster-kafka-bootstrap.default.svc.cluster.local:9092"
};
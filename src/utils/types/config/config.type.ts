/* eslint-disable @typescript-eslint/no-explicit-any */
import { Environment } from "./environment.type";

interface DefaultConfig {
    prodConfig: Record<string, any>;
    stagingConfig?: Record<string, any>;
    devConfig?: Record<string, any>;
    testConfig?: Record<string, any>;
}

interface Config {
    set(environment: Environment, config: DefaultConfig): void;
}

export {
	DefaultConfig,
	Config
};

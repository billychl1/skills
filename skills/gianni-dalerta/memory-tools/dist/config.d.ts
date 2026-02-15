/**
 * Configuration Schema for Memory-as-Tools Plugin
 */
import { type Static } from '@sinclair/typebox';
import { MEMORY_CATEGORIES, VECTOR_DIMS } from './types.js';
export declare const embeddingConfigSchema: import("@sinclair/typebox").TObject<{
    apiKey: import("@sinclair/typebox").TString;
    model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"text-embedding-3-small">, import("@sinclair/typebox").TLiteral<"text-embedding-3-large">]>>;
}>;
export declare const memoryToolsConfigSchema: import("@sinclair/typebox").TObject<{
    embedding: import("@sinclair/typebox").TObject<{
        apiKey: import("@sinclair/typebox").TString;
        model: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"text-embedding-3-small">, import("@sinclair/typebox").TLiteral<"text-embedding-3-large">]>>;
    }>;
    dbPath: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    autoInjectInstructions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    decayCheckInterval: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export type MemoryToolsConfig = Static<typeof memoryToolsConfigSchema>;
export declare function parseConfig(raw: unknown): MemoryToolsConfig;
export { MEMORY_CATEGORIES, VECTOR_DIMS };
//# sourceMappingURL=config.d.ts.map
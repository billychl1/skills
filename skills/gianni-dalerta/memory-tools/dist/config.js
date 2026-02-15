/**
 * Configuration Schema for Memory-as-Tools Plugin
 */
import { Type } from '@sinclair/typebox';
import { MEMORY_CATEGORIES, VECTOR_DIMS } from './types.js';
export const embeddingConfigSchema = Type.Object({
    apiKey: Type.String(),
    model: Type.Optional(Type.Union([
        Type.Literal('text-embedding-3-small'),
        Type.Literal('text-embedding-3-large'),
    ])),
});
export const memoryToolsConfigSchema = Type.Object({
    embedding: embeddingConfigSchema,
    dbPath: Type.Optional(Type.String()),
    autoInjectInstructions: Type.Optional(Type.Boolean()),
    decayCheckInterval: Type.Optional(Type.Number()),
});
/**
 * Expand environment variables in a string.
 * Supports ${VAR_NAME} syntax.
 */
function expandEnvVars(value) {
    return value.replace(/\$\{([^}]+)\}/g, (_, varName) => {
        return process.env[varName] ?? '';
    });
}
export function parseConfig(raw) {
    const config = (raw ?? {});
    // Handle missing or empty embedding config
    const embedding = (config.embedding ?? {});
    let apiKey = embedding.apiKey;
    // Support environment variable expansion
    if (apiKey) {
        apiKey = expandEnvVars(apiKey);
    }
    // Fall back to OPENAI_API_KEY env var if not configured
    if (!apiKey) {
        apiKey = process.env.OPENAI_API_KEY;
    }
    if (!apiKey) {
        throw new Error('Missing OpenAI API key. Set embedding.apiKey in config, use ${OPENAI_API_KEY}, or set OPENAI_API_KEY environment variable.');
    }
    const model = embedding.model || 'text-embedding-3-small';
    return {
        embedding: {
            apiKey,
            model: model,
        },
        dbPath: config.dbPath || '~/.openclaw/memory/tools',
        autoInjectInstructions: config.autoInjectInstructions !== false,
        decayCheckInterval: config.decayCheckInterval ?? 24,
    };
}
export { MEMORY_CATEGORIES, VECTOR_DIMS };
//# sourceMappingURL=config.js.map
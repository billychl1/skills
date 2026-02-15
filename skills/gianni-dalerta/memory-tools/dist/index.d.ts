/**
 * OpenClaw Memory-as-Tools Plugin
 *
 * Agent-controlled memory with confidence scoring, decay, and semantic search.
 * The agent decides WHEN to store/retrieve memories (AgeMem pattern).
 *
 * Key features:
 * - Six memory tools: store, update, forget, search, summarize, list
 * - Hybrid SQLite + LanceDB storage
 * - Confidence scoring (how accurate)
 * - Importance scoring (how critical)
 * - Decay/expiration for temporal memories
 * - Auto-inject standing instructions at conversation start
 */
import type { OpenClawPluginApi } from './plugin-types.js';
declare const memoryToolsPlugin: {
    id: string;
    name: string;
    description: string;
    kind: "memory";
    register(api: OpenClawPluginApi): void;
};
export default memoryToolsPlugin;
export * from './types.js';
export { MemoryStore } from './store.js';
export { EmbeddingProvider } from './embeddings.js';
export { createMemoryTools } from './tools.js';
//# sourceMappingURL=index.d.ts.map
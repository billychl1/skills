/**
 * Memory-as-Tools Type Definitions
 *
 * Core types for the agent-controlled memory system with
 * confidence scoring, decay, and semantic search.
 */
export declare const MEMORY_CATEGORIES: readonly ["fact", "preference", "event", "relationship", "context", "instruction", "decision", "entity"];
export type MemoryCategory = typeof MEMORY_CATEGORIES[number];
export interface Memory {
    id: string;
    content: string;
    category: MemoryCategory;
    confidence: number;
    importance: number;
    createdAt: number;
    updatedAt: number;
    lastAccessedAt: number;
    decayDays: number | null;
    sourceChannel?: string;
    sourceMessageId?: string;
    tags: string[];
    supersedes?: string;
    deletedAt?: number;
    deleteReason?: string;
}
export interface MemorySearchResult {
    memory: Memory;
    score: number;
}
export interface CreateMemoryInput {
    content: string;
    category: MemoryCategory;
    confidence?: number;
    importance?: number;
    decayDays?: number | null;
    tags?: string[];
    sourceChannel?: string;
    sourceMessageId?: string;
}
export interface UpdateMemoryInput {
    content?: string;
    confidence?: number;
    importance?: number;
    decayDays?: number | null;
    tags?: string[];
}
export interface SearchOptions {
    query?: string;
    category?: MemoryCategory;
    tags?: string[];
    minConfidence?: number;
    minImportance?: number;
    limit?: number;
    excludeDecayed?: boolean;
    includeDeleted?: boolean;
}
export interface ListOptions {
    category?: MemoryCategory;
    sortBy?: 'createdAt' | 'updatedAt' | 'importance' | 'confidence' | 'lastAccessedAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}
export interface PluginConfig {
    embedding: {
        apiKey: string;
        model?: string;
    };
    dbPath?: string;
    autoInjectInstructions?: boolean;
    decayCheckInterval?: number;
}
export declare const VECTOR_DIMS: Record<string, number>;
export declare function vectorDimsForModel(model: string): number;
//# sourceMappingURL=types.d.ts.map
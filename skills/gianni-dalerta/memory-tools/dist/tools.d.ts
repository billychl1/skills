/**
 * Memory Tools
 *
 * The six agent-controlled memory operations:
 * - memory_store: Save new memories
 * - memory_update: Modify existing memories
 * - memory_forget: Delete memories
 * - memory_search: Semantic search
 * - memory_summarize: Get topic summary
 * - memory_list: Browse all memories
 */
import type { MemoryStore } from './store.js';
import { type MemoryCategory } from './types.js';
export declare function createMemoryTools(store: MemoryStore): {
    memory_store: {
        name: string;
        label: string;
        description: string;
        parameters: import("@sinclair/typebox").TObject<{
            content: import("@sinclair/typebox").TString;
            category: import("@sinclair/typebox").TUnsafe<"fact" | "preference" | "event" | "relationship" | "context" | "instruction" | "decision" | "entity">;
            confidence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            importance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            decayDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            tags: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            supersedes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        execute(_toolCallId: string, params: {
            content: string;
            category: MemoryCategory;
            confidence?: number;
            importance?: number;
            decayDays?: number;
            tags?: string[];
            supersedes?: string;
        }, ctx?: {
            messageChannel?: string;
        }): Promise<{
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                action: string;
                existingId: string;
                existingContent: string;
                similarity: number;
                id?: undefined;
                category?: undefined;
                confidence?: undefined;
                supersededId?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                action: string;
                id: string;
                category: "fact" | "preference" | "event" | "relationship" | "context" | "instruction" | "decision" | "entity";
                confidence: number;
                supersededId: string | undefined;
                existingId?: undefined;
                existingContent?: undefined;
                similarity?: undefined;
            };
        }>;
    };
    memory_update: {
        name: string;
        label: string;
        description: string;
        parameters: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TString;
            content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            confidence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            importance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        execute(_toolCallId: string, params: {
            id: string;
            content?: string;
            confidence?: number;
            importance?: number;
        }): Promise<{
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                error: string;
                action?: undefined;
                id?: undefined;
                content?: undefined;
                confidence?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                action: string;
                id: string;
                content: string;
                confidence: number;
                error?: undefined;
            };
        }>;
    };
    memory_forget: {
        name: string;
        label: string;
        description: string;
        parameters: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            query: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        execute(_toolCallId: string, params: {
            id?: string;
            query?: string;
            reason?: string;
        }): Promise<{
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                error: string;
                action?: undefined;
                id?: undefined;
                found?: undefined;
                candidates?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                action: string;
                id: string;
                error?: undefined;
                found?: undefined;
                candidates?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                found: number;
                error?: undefined;
                action?: undefined;
                id?: undefined;
                candidates?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                action: string;
                candidates: {
                    id: string;
                    content: string;
                    score: number;
                }[];
                error?: undefined;
                id?: undefined;
                found?: undefined;
            };
        }>;
    };
    memory_search: {
        name: string;
        label: string;
        description: string;
        parameters: import("@sinclair/typebox").TObject<{
            query: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<"fact" | "preference" | "event" | "relationship" | "context" | "instruction" | "decision" | "entity">>;
            tags: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            minConfidence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        execute(_toolCallId: string, params: {
            query?: string;
            category?: MemoryCategory;
            tags?: string[];
            minConfidence?: number;
            limit?: number;
        }): Promise<{
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                count: number;
                memories?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                count: number;
                memories: {
                    id: string;
                    content: string;
                    category: "fact" | "preference" | "event" | "relationship" | "context" | "instruction" | "decision" | "entity";
                    confidence: number;
                    importance: number;
                    score: number;
                    tags: string[];
                }[];
            };
        }>;
    };
    memory_summarize: {
        name: string;
        label: string;
        description: string;
        parameters: import("@sinclair/typebox").TObject<{
            topic: import("@sinclair/typebox").TString;
            maxMemories: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        execute(_toolCallId: string, params: {
            topic: string;
            maxMemories?: number;
        }): Promise<{
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                memoryCount: number;
                categories?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                memoryCount: number;
                categories: {
                    [k: string]: string[];
                };
            };
        }>;
    };
    memory_list: {
        name: string;
        label: string;
        description: string;
        parameters: import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<"fact" | "preference" | "event" | "relationship" | "context" | "instruction" | "decision" | "entity">>;
            sortBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<"createdAt" | "updatedAt" | "importance" | "confidence" | "lastAccessedAt">>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            offset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        execute(_toolCallId: string, params: {
            category?: MemoryCategory;
            sortBy?: "createdAt" | "updatedAt" | "importance" | "confidence" | "lastAccessedAt";
            limit?: number;
            offset?: number;
        }): Promise<{
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                total: number;
                count: number;
                memories?: undefined;
            };
        } | {
            content: {
                type: "text";
                text: string;
            }[];
            details: {
                total: number;
                count: number;
                memories: {
                    id: string;
                    content: string;
                    category: "fact" | "preference" | "event" | "relationship" | "context" | "instruction" | "decision" | "entity";
                    confidence: number;
                    importance: number;
                    createdAt: number;
                }[];
            };
        }>;
    };
};
export type MemoryTools = ReturnType<typeof createMemoryTools>;
//# sourceMappingURL=tools.d.ts.map
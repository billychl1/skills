/**
 * Hybrid Memory Store
 *
 * SQLite (via sql.js/WASM) for metadata (fast queries, debuggable, no native deps)
 * LanceDB for vectors (semantic search)
 */
import type { Memory, MemorySearchResult, CreateMemoryInput, UpdateMemoryInput, SearchOptions, ListOptions, MemoryCategory } from './types.js';
import { EmbeddingProvider } from './embeddings.js';
export declare class MemoryStore {
    private db;
    private vectorDb;
    private vectorTable;
    private embeddings;
    private vectorDim;
    private dbPath;
    private dbFilePath;
    private initPromise;
    private sqliteInitPromise;
    constructor(dbPath: string, embeddings: EmbeddingProvider, vectorDim: number);
    /**
     * Initialize the database. Call this before using sync methods.
     * Async methods will auto-initialize, but this is useful for tests
     * or when you need to use sync methods without calling async ones first.
     */
    init(): Promise<void>;
    /**
     * Ensure SQLite is initialized (lazy async init for sql.js WASM)
     */
    private ensureSqlite;
    private initSqlite;
    /**
     * Persist database to disk
     */
    private save;
    private ensureVectorDb;
    private initVectorDb;
    create(input: CreateMemoryInput): Promise<Memory>;
    /**
     * Async get - initializes database if needed
     */
    getAsync(id: string): Promise<Memory | null>;
    /**
     * Sync get - requires ensureSqlite() to have been called first
     */
    get(id: string): Memory | null;
    private getFromDb;
    update(id: string, updates: UpdateMemoryInput): Promise<Memory>;
    delete(id: string, reason?: string): Promise<void>;
    search(opts: SearchOptions): Promise<MemorySearchResult[]>;
    /**
     * Async version of list
     */
    listAsync(opts?: ListOptions): Promise<{
        total: number;
        items: Memory[];
    }>;
    /**
     * Sync list - requires database to be initialized
     */
    list(opts?: ListOptions): {
        total: number;
        items: Memory[];
    };
    private listFromDb;
    findDuplicates(content: string, threshold?: number): Promise<MemorySearchResult[]>;
    /**
     * Async version of touchMany
     */
    touchManyAsync(ids: string[]): Promise<void>;
    /**
     * Sync touchMany - requires database to be initialized
     */
    touchMany(ids: string[]): void;
    private touchManyInDb;
    /**
     * Async version of count
     */
    countAsync(): Promise<number>;
    /**
     * Sync count - requires database to be initialized
     */
    count(): number;
    private countFromDb;
    /**
     * Async version of getByCategory
     */
    getByCategoryAsync(category: MemoryCategory, limit?: number): Promise<Memory[]>;
    /**
     * Sync getByCategory - requires database to be initialized
     */
    getByCategory(category: MemoryCategory, limit?: number): Memory[];
    private getByCategoryFromDb;
    /**
     * Helper to run a query and get all results as objects
     */
    private queryAll;
    /**
     * Helper to run a query and get first result as object
     */
    private queryOne;
    private rowToMemory;
    close(): void;
}
//# sourceMappingURL=store.d.ts.map
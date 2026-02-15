/**
 * Embedding Provider
 *
 * Handles text -> vector embedding via OpenAI API
 */
export declare class EmbeddingProvider {
    private client;
    private model;
    constructor(apiKey: string, model?: string);
    embed(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
//# sourceMappingURL=embeddings.d.ts.map
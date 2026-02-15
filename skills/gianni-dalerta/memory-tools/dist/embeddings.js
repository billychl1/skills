/**
 * Embedding Provider
 *
 * Handles text -> vector embedding via OpenAI API
 */
import OpenAI from 'openai';
export class EmbeddingProvider {
    client;
    model;
    constructor(apiKey, model = 'text-embedding-3-small') {
        this.client = new OpenAI({ apiKey });
        this.model = model;
    }
    async embed(text) {
        const response = await this.client.embeddings.create({
            model: this.model,
            input: text,
        });
        return response.data[0].embedding;
    }
    async embedBatch(texts) {
        if (texts.length === 0)
            return [];
        const response = await this.client.embeddings.create({
            model: this.model,
            input: texts,
        });
        return response.data
            .sort((a, b) => a.index - b.index)
            .map(d => d.embedding);
    }
}
//# sourceMappingURL=embeddings.js.map
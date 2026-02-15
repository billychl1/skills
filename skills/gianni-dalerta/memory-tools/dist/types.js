/**
 * Memory-as-Tools Type Definitions
 *
 * Core types for the agent-controlled memory system with
 * confidence scoring, decay, and semantic search.
 */
export const MEMORY_CATEGORIES = [
    'fact', // "User's dog is named Rex"
    'preference', // "User prefers dark mode"
    'event', // "User has dentist appointment Tuesday"
    'relationship', // "User's sister is named Sarah"
    'context', // "User is working on a React project"
    'instruction', // "Always respond in Spanish"
    'decision', // "We decided to use PostgreSQL"
    'entity', // Contact info, phone numbers, emails
];
// Vector dimensions for different embedding models
export const VECTOR_DIMS = {
    'text-embedding-3-small': 1536,
    'text-embedding-3-large': 3072,
};
export function vectorDimsForModel(model) {
    return VECTOR_DIMS[model] ?? 1536;
}
//# sourceMappingURL=types.js.map
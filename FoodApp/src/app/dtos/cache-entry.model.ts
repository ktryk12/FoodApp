// cache-entry.model.ts

export class CacheEntry<T> {
  constructor(public data: T, public lastUpdated: Date) { }
}

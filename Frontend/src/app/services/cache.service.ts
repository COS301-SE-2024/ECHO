import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CacheService
{
  private cache: Map<string, any> = new Map();

  set(key: string, data: any): void
  {
    this.cache.set(key, data);
  }

  get(key: string): any
  {
    return this.cache.get(key);
  }

  has(key: string): boolean
  {
    return this.cache.has(key);
  }

  clear(): void
  {
    this.cache.clear();
  }
}

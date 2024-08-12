import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class ConnectionService
{
  private dbName = "AuthDB";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object)
  {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser)
    {
      this.initDB();
    }
  }

  private initDB(): Promise<void>
  {
    if (!this.isBrowser)
    {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) =>
    {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => reject("Error opening database");

      request.onsuccess = (event) =>
      {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) =>
      {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore("auth", { keyPath: "key" });
      };
    });
  }

  setItem(key: string, value: any): Promise<void>
  {
    if (!this.isBrowser)
    {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) =>
    {
      const transaction = this.db?.transaction(["auth"], "readwrite");
      const store = transaction?.objectStore("auth");
      const request = store?.put({ key, value });

      request!.onerror = () => reject("Error storing data");
      request!.onsuccess = () => resolve();
    });
  }

  getItem(key: string): Promise<any>
  {
    if (!this.isBrowser)
    {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) =>
    {
      const transaction = this.db?.transaction(["auth"], "readonly");
      const store = transaction?.objectStore("auth");
      const request = store?.get(key);

      request!.onerror = () => reject("Error retrieving data");
      request!.onsuccess = () => resolve(request!.result?.value);
    });
  }

  removeItem(key: string): Promise<void>
  {
    if (!this.isBrowser)
    {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) =>
    {
      const transaction = this.db?.transaction(["auth"], "readwrite");
      const store = transaction?.objectStore("auth");
      const request = store?.delete(key);

      request!.onerror = () => reject("Error removing data");
      request!.onsuccess = () => resolve();
    });
  }
}

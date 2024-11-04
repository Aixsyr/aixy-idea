class aCache {
    storage: Storage;

    constructor(storage: Storage, storageType: 'sessionStorage' | 'localStorage') {
        if (!this.isStorageAvailable(storage)) {
            console.warn(`${storageType} 不可用，将在内存中存储`);
            this.storage = this.createMemoryStorage();
        } else {
            this.storage = storage;
        }
    }

    isStorageAvailable(storage: Storage): boolean {
        try {
            const testKey = '__storage_test__';
            storage.setItem(testKey, testKey);
            storage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    createMemoryStorage(): Storage {
        let memoryStorage: { [key: string]: string } = {};
        return {
            setItem(key: string, value: string) {
                memoryStorage[key] = value;
            },
            getItem(key: string) {
                return memoryStorage[key] || null;
            },
            removeItem(key: string) {
                delete memoryStorage[key];
            },
            clear() {
                memoryStorage = {};
            },
            key(index: number) {
                const keys = Object.keys(memoryStorage);
                return keys[index] || null;
            },
            get length() {
                return Object.keys(memoryStorage).length;
            }
        };
    }

    set(key: string, value: string): void {
        if (!this.storage) {
            return;
        }
        if (key != null && value != null) {
            this.storage.setItem(key, value);
        }
    }

    get(key: string): string | null {
        if (!this.storage) {
            return null;
        }
        if (key == null) {
            return null;
        }
        return this.storage.getItem(key);
    }

    setJSON(key: string, jsonValue: any): void {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue));
        }
    }

    getJSON(key: string): any {
        const value = this.get(key);
        if (value != null) {
            return JSON.parse(value);
        }
    }

    remove(key: string): void {
        this.storage.removeItem(key);
    }
}

class RamCache {
    private memoryStorage: { [key: string]: any } = {};

    set(key: string, value: any): void {
        this.memoryStorage[key] = value;
    }

    get(key: string): any {
        return this.memoryStorage[key] || null;
    }

    remove(key: string): void {
        delete this.memoryStorage[key];
    }

    clear(): void {
        this.memoryStorage = {};
    }

    key(index: number): string | null {
        const keys = Object.keys(this.memoryStorage);
        return keys[index] || null;
    }

    get length(): number {
        return Object.keys(this.memoryStorage).length;
    }
}

const ramCache = new RamCache();
const sessionCache = new aCache(sessionStorage, 'sessionStorage');
const localCache = new aCache(localStorage, 'localStorage');

export { aCache, RamCache, ramCache, sessionCache, localCache };
// src/indexedDB.js
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('appDatabase', 1);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        };
    });
}

export async function saveConfig(key, value) {
    const db = await openDatabase();
    const transaction = db.transaction('settings', 'readwrite');
    const store = transaction.objectStore('settings');
    store.put({ key, value });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

export async function getConfig(key) {
    const db = await openDatabase();
    const transaction = db.transaction('settings', 'readonly');
    const store = transaction.objectStore('settings');

    return new Promise((resolve, reject) => {
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result ? request.result.value : null);
        };

        request.onerror = () => reject(request.error);
    });
}

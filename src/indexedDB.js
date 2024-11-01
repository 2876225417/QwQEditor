// src/indexedDB.js

export function openDatabase() {
    return new Promise((resolve, reject) => {
        // 升级版本号（如从 1 升级到 2）以触发 onupgradeneeded 事件
        const request = indexedDB.open('appDatabase', 2); // 将版本号从 1 改为 2

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // 创建 settings 对象存储
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
            // 创建 books 对象存储
            if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
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

export async function saveBooks(books) {
    const db = await openDatabase();
    const transaction = db.transaction('books', 'readwrite');
    const store = transaction.objectStore('books');

    // 清空现有书籍数据，并等待清空完成
    const clearRequest = store.clear();
    await new Promise((resolve, reject) => {
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
    });

    // 添加新的书籍数据
    books.forEach((book) => {
        store.put(book);
    });

    // 返回一个 Promise，确保事务完成后再返回
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}


export async function getBooks() {
    const db = await openDatabase();
    const transaction = db.transaction('books', 'readonly');
    const store = transaction.objectStore('books');

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => reject(request.error);
    });
}

export async function saveDownloadPath(path){
    return saveConfig("downloadPath", path);
}

export async function getDownloadPath(){
    return getConfig("downloadPath");
}



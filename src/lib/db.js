/**
 * Simple IndexedDB wrapper for evidence attachments
 */

const DB_NAME = 'cisv81-evidence-db';
const DB_VERSION = 1;
const STORE_NAME = 'attachments';

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveAttachment(id, file, safeguardId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const attachment = {
      id,
      safeguardId,
      name: file.name,
      type: file.type,
      size: file.size,
      data: file, // Blobs are supported in IDB
      createdAt: new Date().toISOString()
    };

    const request = store.put(attachment);
    request.onsuccess = () => resolve(attachment);
    request.onerror = () => reject(request.error);
  });
}

export async function getAttachmentsBySafeguard(safeguardId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const all = request.result;
      resolve(all.filter(a => a.safeguardId === safeguardId));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteAttachment(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const STORE_DIR = `${FileSystem.documentDirectory ?? ''}app-store`;

async function ensureStoreDir() {
  if (!FileSystem.documentDirectory || Platform.OS === 'web') {
    return;
  }

  const info = await FileSystem.getInfoAsync(STORE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(STORE_DIR, { intermediates: true });
  }
}

function buildFilePath(key: string) {
  return `${STORE_DIR}/${key}.json`;
}

export const persistentStore = {
  async getItem<T>(key: string): Promise<T | null> {
    if (Platform.OS === 'web') {
      const raw = globalThis.localStorage?.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }

    if (!FileSystem.documentDirectory) {
      return null;
    }

    await ensureStoreDir();
    const path = buildFilePath(key);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) {
      return null;
    }

    const content = await FileSystem.readAsStringAsync(path);
    return JSON.parse(content) as T;
  },

  async setItem<T>(key: string, value: T) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(key, JSON.stringify(value));
      return;
    }

    if (!FileSystem.documentDirectory) {
      return;
    }

    await ensureStoreDir();
    const path = buildFilePath(key);
    await FileSystem.writeAsStringAsync(path, JSON.stringify(value));
  },

  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(key);
      return;
    }

    if (!FileSystem.documentDirectory) {
      return;
    }

    const path = buildFilePath(key);
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
      await FileSystem.deleteAsync(path, { idempotent: true });
    }
  },
};

export class IndexDB {
  /** @type {IDBDatabase | undefined} */
  db;

  /**
   * Initializes an IndexDB wrapper configuration.
   * @param {string} dbName - Name of the IndexedDB database.
   * @param {number} dbVersion - Version number of the database schema.
   * @param {string} storeName - Default object store name.
   */
  constructor(dbName, dbVersion, storeName) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
  }

  /**
   * Creates an instance and waits until the database connection is ready.
   * @param {string} dbName - Name of the IndexedDB database.
   * @param {number} dbVersion - Version number of the database schema.
   * @param {string} storeName - Default object store name.
   * @returns {Promise<IndexDB>} Initialized IndexDB instance.
   */
  static async create(dbName, dbVersion, storeName) {
    const instance = new IndexDB(dbName, dbVersion, storeName);
    instance.db = await instance.openDatabase();
    return instance;
  }

  /**
   * Opens the IndexedDB database and creates the object store on upgrade if missing.
   * @returns {Promise<IDBDatabase>} Open IDBDatabase instance.
   */
  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Executes an IndexedDB request inside a transaction.
   * @param {"readonly" | "readwrite"} mode - Transaction access mode.
   * @param {(store: IDBObjectStore) => IDBRequest} operation - Store operation to run.
   * @param {string} [storeName] - Target object store name.
   * @returns {Promise<any>} Result of the IndexedDB request.
   */
  #run(mode, operation, storeName = this.storeName) {
    if (!this.db) {
      return Promise.reject(
        new Error('Database not initialized. Use IndexDB.create(...) first.')
      );
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = operation(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  /**
   * Inserts or updates a record, generating an `id` if one isn't provided.
   * @param {Record<string, any>} data - Record to save.
   * @param {string} [storeName] - Target object store name.
   * @returns {Promise<IDBValidKey>} Key of the saved record.
   */
  save(data, storeName = this.storeName) {
    const record = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
    };
    return this.#run('readwrite', (store) => store.put(record), storeName);
  }

  /**
   * Retrieves all records from the object store.
   * @param {string} [storeName] - Target object store name.
   * @returns {Promise<Array<any>>} All stored records.
   */
  getAll(storeName = this.storeName) {
    return this.#run('readonly', (store) => store.getAll(), storeName);
  }

  /**
   * Retrieves a single record by its key/ID.
   * @param {IDBValidKey} id - Record identifier.
   * @param {string} [storeName] - Target object store name.
   * @returns {Promise<any>} Matching record, or `undefined` if not found.
   */
  get(id, storeName = this.storeName) {
    return this.#run('readonly', (store) => store.get(id), storeName);
  }

  /**
   * Deletes a record by its key/ID.
   * @param {IDBValidKey} id - Record identifier.
   * @param {string} [storeName] - Target object store name.
   * @returns {Promise<boolean>} `true` once deletion completes.
   */
  async del(id, storeName = this.storeName) {
    await this.#run('readwrite', (store) => store.delete(id), storeName);
    return true;
  }

  /**
   * Closes the active database connection and clears the reference.
   */
  close() {
    this.db?.close();
    this.db = undefined;
  }
}

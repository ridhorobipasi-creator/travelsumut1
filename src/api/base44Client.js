// Mock Base44 Client for Local Development
// Menyimulasikan server dan database secara luring di memori browser

function generateId() {
  return 'mock-' + Math.random().toString(36).substr(2, 9);
}

class MockEntity {
  constructor(entityName) {
    this.entityName = entityName;
  }

  // Helper untuk membaca dari LocalStorage
  _read() {
    const data = localStorage.getItem(`NusantaraDB_${this.entityName}`);
    return data ? JSON.parse(data) : [];
  }

  // Helper untuk menulis ke LocalStorage
  _write(data) {
    localStorage.setItem(`NusantaraDB_${this.entityName}`, JSON.stringify(data));
  }

  async list(options = {}) {
    await new Promise(r => setTimeout(r, 400)); // Simulasi latensi jaringan
    let data = this._read();
    
    // Asumsi status filter (jika ada seperti status='published')
    if (options.status) {
      data = data.filter(item => item.status === options.status);
    }
    
    return { data, total: data.length };
  }

  async get(id, options = {}) {
    await new Promise(r => setTimeout(r, 200));
    const item = this._read().find(i => i.id === id);
    if (!item) throw new Error("404 Not Found");
    return item;
  }

  async create(payload) {
    await new Promise(r => setTimeout(r, 600));
    const items = this._read();
    const newItem = {
      ...payload,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    items.unshift(newItem); // Taruh di paling atas
    this._write(items);
    return newItem;
  }

  async update(id, payload) {
    await new Promise(r => setTimeout(r, 500));
    const items = this._read();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error("404 Not Found");
    
    items[index] = { ...items[index], ...payload, updated_at: new Date().toISOString() };
    this._write(items);
    return items[index];
  }

  async delete(id) {
    await new Promise(r => setTimeout(r, 400));
    const items = this._read();
    const filtered = items.filter(i => i.id !== id);
    if (items.length === filtered.length) throw new Error("404 Not Found");
    this._write(filtered);
    return { success: true };
  }
}

export const base44 = {
  entities: {
    Package: new MockEntity('Package'),
    Booking: new MockEntity('Booking'),
    Region: new MockEntity('Region'),
    Rental: new MockEntity('Rental'),
    CustomTrip: new MockEntity('CustomTrip'),
    Article: new MockEntity('Article'),
    Review: new MockEntity('Review'),
    User: new MockEntity('User')
  }
};

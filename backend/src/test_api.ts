const API_BASE = 'http://localhost:4000/api';

async function runTests() {
  console.log('=== MEMULAI PENGUJIAN OTOMATIS ENDPOINT API (FASE 3) ===\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}`);
      console.error(`   Detail:`, err.message);
      failed++;
    }
  }

  // 1. GET /api/universitas
  await test('1. GET /api/universitas -> 200, minimal 1 data', async () => {
    const res = await fetch(`${API_BASE}/universitas`);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Status ${res.status}, data tidak sesuai`);
    }
  });

  // 2. GET /api/barang tanpa filter
  await test('2. GET /api/barang -> 200, ada data dan meta paginasi', async () => {
    const res = await fetch(`${API_BASE}/barang`);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.data) || !data.meta) {
      throw new Error(`Status ${res.status}, format respons salah`);
    }
  });

  // 3. GET /api/barang?id_universitas=abc -> 400
  await test('3. GET /api/barang?id_universitas=abc -> 400 Bad Request', async () => {
    const res = await fetch(`${API_BASE}/barang?id_universitas=abc`);
    if (res.status !== 400) {
      throw new Error(`Harusnya 400 tapi status ${res.status}`);
    }
  });

  // 4. GET /api/barang?search=zzzzzz -> 200, data kosong
  await test('4. GET /api/barang?search=zzzzzz -> 200, data: []', async () => {
    const res = await fetch(`${API_BASE}/barang?search=zzzzzz`);
    const data = await res.json();
    if (res.status !== 200 || data.data.length !== 0) {
      throw new Error(`Harusnya data kosong, tapi ada ${data.data?.length}`);
    }
  });

  // 5. GET /api/barang/999999 -> 404
  await test('5. GET /api/barang/999999 -> 404 Not Found', async () => {
    const res = await fetch(`${API_BASE}/barang/999999`);
    if (res.status !== 404) {
      throw new Error(`Harusnya 404 tapi status ${res.status}`);
    }
  });

  // 6. POST valid (Jual dengan harga > 0 dan pin)
  let createdBarangId: number = 0;
  await test('6. POST /api/barang valid -> 201 Created', async () => {
    const payload = {
      nama_barang: 'Meja Lipat Belajar Portable',
      deskripsi: 'Kondisi mulus warna kayu jati muda, kokoh.',
      jenis_transaksi: 'Jual',
      harga: 65000,
      kondisi: 'Sangat Baik',
      id_kategori: 3, // Perabot Kos
      id_universitas: 1, // ITB
      nama_lengkap: 'Fajar Nugraha',
      email: 'fajar@students.itb.ac.id',
      no_whatsapp: '081298765432',
      pin: '5678'
    };
    const res = await fetch(`${API_BASE}/barang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || !data.data?.id_barang) {
      throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    }
    createdBarangId = data.data.id_barang;
  });

  // 7. POST tanpa nama_barang -> 400
  await test('7. POST tanpa nama_barang -> 400 Bad Request', async () => {
    const res = await fetch(`${API_BASE}/barang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deskripsi: 'Deskripsi lengkap tanpa nama barang.',
        jenis_transaksi: 'Jual',
        harga: 50000,
        kondisi: 'Layak Pakai',
        id_kategori: 1,
        id_universitas: 1,
        nama_lengkap: 'Test User',
        email: 'test@mail.com',
        no_whatsapp: '081234567890',
        pin: '1234'
      })
    });
    if (res.status !== 400) {
      throw new Error(`Harusnya 400 tapi status ${res.status}`);
    }
  });

  // 8. POST Jual dengan harga 0 -> 400
  await test('8. POST Jual dengan harga 0 -> 400 Bad Request', async () => {
    const res = await fetch(`${API_BASE}/barang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_barang: 'Buku Bekas Murah',
        deskripsi: 'Deskripsi buku bekas kuliah.',
        jenis_transaksi: 'Jual',
        harga: 0,
        kondisi: 'Layak Pakai',
        id_kategori: 1,
        id_universitas: 1,
        nama_lengkap: 'Test User',
        email: 'test@mail.com',
        no_whatsapp: '081234567890',
        pin: '1234'
      })
    });
    if (res.status !== 400) {
      throw new Error(`Harusnya 400 tapi status ${res.status}`);
    }
  });

  // 9. POST Hibah dengan harga 5000 -> 400
  await test('9. POST Hibah dengan harga 5000 -> 400 Bad Request', async () => {
    const res = await fetch(`${API_BASE}/barang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_barang: 'Pulpen Gratis',
        deskripsi: 'Diberikan gratis tapi harga diisi.',
        jenis_transaksi: 'Hibah',
        harga: 5000,
        kondisi: 'Layak Pakai',
        id_kategori: 4,
        id_universitas: 1,
        nama_lengkap: 'Test User',
        email: 'test@mail.com',
        no_whatsapp: '081234567890',
        pin: '1234'
      })
    });
    if (res.status !== 400) {
      throw new Error(`Harusnya 400 tapi status ${res.status}`);
    }
  });

  // 10. PUT dengan PIN salah -> 403 Forbidden
  await test('10. PUT /api/barang/:id dengan PIN salah -> 403 Forbidden', async () => {
    const res = await fetch(`${API_BASE}/barang/${createdBarangId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: '9999', // PIN salah
        status: 'Terjual'
      })
    });
    if (res.status !== 403) {
      throw new Error(`Harusnya 403 tapi status ${res.status}`);
    }
  });

  // 11. PUT dengan PIN benar -> 200 OK
  await test('11. PUT /api/barang/:id dengan PIN benar -> 200 OK', async () => {
    const res = await fetch(`${API_BASE}/barang/${createdBarangId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: '5678', // PIN benar
        status: 'Terjual'
      })
    });
    const data = await res.json();
    if (res.status !== 200 || data.data?.status !== 'Terjual') {
      throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 12. PUT ID tidak ada -> 404
  await test('12. PUT /api/barang/999999 -> 404 Not Found', async () => {
    const res = await fetch(`${API_BASE}/barang/999999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: '1234',
        nama_barang: 'Buku Baru'
      })
    });
    if (res.status !== 404) {
      throw new Error(`Harusnya 404 tapi status ${res.status}`);
    }
  });

  // 13. DELETE dengan PIN salah -> 403 Forbidden
  await test('13. DELETE /api/barang/:id dengan PIN salah -> 403 Forbidden', async () => {
    const res = await fetch(`${API_BASE}/barang/${createdBarangId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '0000' })
    });
    if (res.status !== 403) {
      throw new Error(`Harusnya 403 tapi status ${res.status}`);
    }
  });

  // 14. DELETE dengan PIN benar -> 204 No Content
  await test('14. DELETE /api/barang/:id dengan PIN benar -> 204 No Content', async () => {
    const res = await fetch(`${API_BASE}/barang/${createdBarangId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '5678' })
    });
    if (res.status !== 204) {
      throw new Error(`Harusnya 204 tapi status ${res.status}`);
    }
  });

  // 15. DELETE ID tidak ada -> 404 Not Found
  await test('15. DELETE /api/barang/999999 -> 404 Not Found', async () => {
    const res = await fetch(`${API_BASE}/barang/999999`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' })
    });
    if (res.status !== 404) {
      throw new Error(`Harusnya 404 tapi status ${res.status}`);
    }
  });

  console.log(`\n=== HASIL AKHIR: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) process.exit(1);
}

runTests();

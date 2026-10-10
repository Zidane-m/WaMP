-- CampusPreloved — Skema PostgreSQL
-- Jalankan: psql -d campuspreloved -f database/schema.sql
-- Catatan MySQL: ganti SERIAL -> INT AUTO_INCREMENT, NUMERIC -> DECIMAL,
-- dan CHECK (... IN (...)) -> ENUM(...).

DROP TABLE IF EXISTS barang    CASCADE;
DROP TABLE IF EXISTS pengguna  CASCADE;
DROP TABLE IF EXISTS kategori  CASCADE;
DROP TABLE IF EXISTS universitas CASCADE;

CREATE TABLE universitas (
    id_universitas    SERIAL PRIMARY KEY,
    nama_universitas  VARCHAR(100) NOT NULL UNIQUE,
    kota              VARCHAR(50)  NOT NULL
);

CREATE TABLE pengguna (
    id_pengguna     SERIAL PRIMARY KEY,
    id_universitas  INT          NOT NULL
                    REFERENCES universitas (id_universitas) ON UPDATE CASCADE ON DELETE RESTRICT,
    nama_lengkap    VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    nim             VARCHAR(30),
    no_whatsapp     VARCHAR(20)  NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE kategori (
    id_kategori    SERIAL PRIMARY KEY,
    nama_kategori  VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE barang (
    id_barang        SERIAL PRIMARY KEY,
    id_pengguna      INT           NOT NULL
                     REFERENCES pengguna (id_pengguna) ON UPDATE CASCADE ON DELETE CASCADE,
    id_kategori      INT           NOT NULL
                     REFERENCES kategori (id_kategori) ON UPDATE CASCADE ON DELETE RESTRICT,
    nama_barang      VARCHAR(150)  NOT NULL,
    deskripsi        TEXT          NOT NULL,
    harga            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (harga >= 0),
    -- Penyesuaian atas spesifikasi: pembeda Jual / Barter / Hibah
    jenis_transaksi  VARCHAR(10)   NOT NULL DEFAULT 'Jual'
                     CHECK (jenis_transaksi IN ('Jual', 'Barter', 'Hibah')),
    kondisi          VARCHAR(30)   NOT NULL
                     CHECK (kondisi IN ('Sangat Baik', 'Layak Pakai', 'Perlu Perbaikan Sedikit')),
    status           VARCHAR(10)   NOT NULL DEFAULT 'Tersedia'
                     CHECK (status IN ('Tersedia', 'Terjual')),
    gambar_url       VARCHAR(255),
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    -- harga > 0 hanya untuk Jual; Barter/Hibah harus 0
    CONSTRAINT chk_harga_jenis CHECK (
        (jenis_transaksi = 'Jual' AND harga > 0) OR
        (jenis_transaksi <> 'Jual' AND harga = 0)
    )
);

CREATE INDEX idx_pengguna_universitas ON pengguna (id_universitas);
CREATE INDEX idx_barang_pengguna      ON barang (id_pengguna);
CREATE INDEX idx_barang_kategori      ON barang (id_kategori);
CREATE INDEX idx_barang_status        ON barang (status);
CREATE INDEX idx_barang_created_at    ON barang (created_at DESC);

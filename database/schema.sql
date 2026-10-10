-- CampusPreloved — Skema Basis Data MySQL (Laragon / Production)
-- Database: campuspreloved
-- Jalankan di HeidiSQL atau MySQL CLI:
--   CREATE DATABASE IF NOT EXISTS campuspreloved;
--   USE campuspreloved;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS barang;
DROP TABLE IF EXISTS pengguna;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS universitas;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabel Master Universitas
CREATE TABLE universitas (
    id_universitas    INT AUTO_INCREMENT PRIMARY KEY,
    nama_universitas  VARCHAR(100) NOT NULL UNIQUE,
    kota              VARCHAR(50)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Pengguna (Penjual)
CREATE TABLE pengguna (
    id_pengguna     INT AUTO_INCREMENT PRIMARY KEY,
    id_universitas  INT          NOT NULL,
    nama_lengkap    VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    nim             VARCHAR(30)  NULL,
    no_whatsapp     VARCHAR(20)  NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pengguna_universitas
        FOREIGN KEY (id_universitas) REFERENCES universitas (id_universitas)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Master Kategori
CREATE TABLE kategori (
    id_kategori    INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori  VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Barang Preloved & Barter
CREATE TABLE barang (
    id_barang        INT AUTO_INCREMENT PRIMARY KEY,
    id_pengguna      INT           NOT NULL,
    id_kategori      INT           NOT NULL,
    nama_barang      VARCHAR(150)  NOT NULL,
    deskripsi        TEXT          NOT NULL,
    harga            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    jenis_transaksi  VARCHAR(10)   NOT NULL DEFAULT 'Jual',
    kondisi          VARCHAR(30)   NOT NULL,
    status           VARCHAR(10)   NOT NULL DEFAULT 'Tersedia',
    gambar_url       VARCHAR(255)  NULL,
    pin_keamanan     VARCHAR(60)   NOT NULL, -- Hash bcrypt dari PIN 4-6 digit
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_barang_pengguna
        FOREIGN KEY (id_pengguna) REFERENCES pengguna (id_pengguna)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_barang_kategori
        FOREIGN KEY (id_kategori) REFERENCES kategori (id_kategori)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_barang_jenis
        CHECK (jenis_transaksi IN ('Jual', 'Barter', 'Hibah')),
    CONSTRAINT chk_barang_kondisi
        CHECK (kondisi IN ('Sangat Baik', 'Layak Pakai', 'Perlu Perbaikan Sedikit')),
    CONSTRAINT chk_barang_status
        CHECK (status IN ('Tersedia', 'Terjual')),
    CONSTRAINT chk_harga_jenis
        CHECK (
            (jenis_transaksi = 'Jual' AND harga > 0) OR
            (jenis_transaksi <> 'Jual' AND harga = 0)
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indeks untuk optimasi query katalog dan filter
CREATE INDEX idx_pengguna_universitas ON pengguna (id_universitas);
CREATE INDEX idx_barang_pengguna      ON barang (id_pengguna);
CREATE INDEX idx_barang_kategori      ON barang (id_kategori);
CREATE INDEX idx_barang_status        ON barang (status);
CREATE INDEX idx_barang_created_at    ON barang (created_at DESC);

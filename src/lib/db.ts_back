import sqlite from "better-sqlite3";

export const db = sqlite("main.db");

// db.exec(`CREATE TABLE IF NOT EXISTS user (
//     id TEXT NOT NULL PRIMARY KEY,
//     username TEXT NOT NULL UNIQUE,
//     email TEXT NOT NULL UNIQUE,
//     password_hash TEXT NOT NULL,
//     is_admin INTEGER NOT NULL DEFAULT 0
// )`);

// db.exec(`CREATE TABLE IF NOT EXISTS session (
//     id TEXT NOT NULL PRIMARY KEY,
//     expires_at INTEGER NOT NULL,
//     user_id TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES user(id)
// )`);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS posts (
//     id TEXT PRIMARY KEY NOT NULL,
//     title TEXT NOT NULL,
//     slug TEXT NOT NULL UNIQUE,
//     description TEXT NOT NULL,
//     body TEXT NOT NULL,
//     tags TEXT,
//     image_url TEXT,
//     gallery TEXT,
//     status INTEGER DEFAULT 1,
//     created_at DATETIME DEFAULT current_timestamp
//   );
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS tags (
//     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
//     title TEXT NOT NULL,
//     rate INTEGER DEFAULT 0
//   )
// `);

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  is_admin: number;
}

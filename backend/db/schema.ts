export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS conversations (
    id          TEXT PRIMARY KEY,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id              TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender          TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
    text            TEXT NOT NULL,
    timestamp       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );
`;
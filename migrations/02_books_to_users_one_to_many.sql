\c library;

ALTER TABLE books ADD COLUMN user_id INT REFERENCES users(id);
ALTER TABLE users DROP COLUMN book_id;
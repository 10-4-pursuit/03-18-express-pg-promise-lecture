\c library

CREATE TABLE books_locations (
  id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id),
  location_id INT REFERENCES locations(id),
  quantity INT NOT NULL
);
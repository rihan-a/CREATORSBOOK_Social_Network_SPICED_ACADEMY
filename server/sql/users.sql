DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS collabs;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    img_url VARCHAR,
    bio VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    reset_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS collabs;

CREATE TABLE collabs(
id SERIAL PRIMARY KEY,
sender_id INTEGER NOT NULL REFERENCES users(id),
recipient_id INTEGER NOT NULL REFERENCES users(id),
accepted BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
id SERIAL PRIMARY KEY,
sender_id INT NOT NULL REFERENCES users(id),
message TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);



DROP TABLE IF EXISTS posts;

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    creator_id INT NOT NULL REFERENCES users(id),
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sketches(
    id SERIAL PRIMARY KEY,
    sketch text NOT NULL,
    creator_1_id INT NOT NULL REFERENCES users(id),
    creator_2_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS aiprompts;


CREATE TABLE aiprompts(
    id SERIAL PRIMARY KEY,
    count INT NOT NULL,
    creator_id INT NOT NULL UNIQUE,
    prompt text NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
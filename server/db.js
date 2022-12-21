// Import node modules
const spicedPg = require("spiced-pg");
require("dotenv").config();

const { DATABASE_URL } = process.env;


const db = spicedPg(`${DATABASE_URL}`);

// function to create user profile into the USERS table
function createUser({ firstName, lastName, email, password, createdAt }) {
    return db
        .query(
            `INSERT INTO users (first_name, last_name, email, password, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
            [firstName, lastName, email, password, createdAt]
        )
        .then((result) => result.rows[0]);
}


function getCreatorByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((result) => result.rows[0]);
}

function getCreatorById(id) {
    return db
        .query("SELECT first_name, last_name, img_url, bio ,id FROM users WHERE id = $1", [id])
        .then((result) => result.rows[0]);
}




function getCreatorsByIds(ids) {
    return db
        .query(`SELECT first_name, last_name, img_url,id FROM users WHERE id IN (${ids.join(',')})`)
        .then((result) => result.rows);
}

// Reset password codes 
function addResetCode({ email, reset_code }) {
    return db.query(
        `INSERT INTO reset_codes (email, reset_code)
        VALUES ($1, $2)
        ON CONFLICT (email)
        DO UPDATE SET reset_code=$2, created_at=CURRENT_TIMESTAMP
        RETURNING *`,
        [email, reset_code]
    );
}

// Verify reset password codes within 10 mins
function verifyResetCode({ email, reset_code }) {
    return db.query(
        `SELECT * FROM reset_codes 
        WHERE email = $1 AND reset_code = $2
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
        [email, reset_code]
    );
}

// update the user password after reset
function updatePasswordByEmail({ password, email }) {
    return db.query(
        `UPDATE users SET password = $1  WHERE email = $2
            RETURNING *`,
        [password, email]
    );
}


function saveProfileImg({ id, img_url }) {
    return db.query(
        `UPDATE users SET img_url=$2 WHERE id=$1 RETURNING *`,
        [id, img_url]
    );
}

function saveProfileBio({ id, bio }) {
    return db.query(`UPDATE users SET bio=$2 WHERE id=$1 RETURNING *`, [
        id,
        bio,
    ]);
}


function getCreators() {
    return db
        .query("SELECT first_name, last_name, img_url, bio, id FROM users ORDER BY created_at DESC LIMIT 12")
        .then((result) => result.rows);
}

function getCreatorsByName(searchQuery) {

    return db
        .query(`SELECT first_name, last_name, img_url, bio, id FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY created_at DESC`, [
            searchQuery + "%",
        ])
        .then((result) => {
            return result.rows;
        })
        .catch((err) => console.log(err));
}

// COLLABS - CHECK - REQUEST - ACCEPT - DELETE

function collaborations(userId, recipientId, collabState) {

    switch (collabState) {
        case "check":
            console.log("checking");
            return db
                .query("SELECT * FROM collabs WHERE (sender_id=$1 AND recipient_id =$2) OR (sender_id=$2 AND recipient_id =$1)",
                    [userId, recipientId])
                .then((result) => result.rows).catch(err => console.log(err));

        case "collab":
            return db
                .query(`INSERT INTO collabs (sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING *`, [userId, recipientId])
                .then((result) => result.rows).catch(err => console.log(err));

        case "accept":
            return db
                .query(`UPDATE collabs SET accepted = true
       WHERE (sender_id=$1 AND recipient_id =$2) OR (sender_id=$2 AND recipient_id =$1)  
        `, [userId, recipientId])
                .then((result) => result.rows).catch(err => console.log(err));

        case "cancel":
        case "end":
            return db
                .query(`DELETE FROM collabs
       WHERE (sender_id=$1 AND recipient_id =$2) OR (sender_id=$2 AND recipient_id =$1)  
        `, [userId, recipientId])
                .then((result) => result.rows).catch(err => console.log(err));

        default:
            console.log("default stage");
    }
}


// WIP to be tested
function getPossibleCollabs(id) {
    return db
        .query(
            `SELECT first_name, last_name, img_url, bio, users.id, accepted, sender_id
    FROM users JOIN collabs
    ON (accepted = false AND recipient_id = $1 AND users.id = collabs.sender_id)
    OR (accepted= false AND sender_id = $1 AND users.id = collabs.recipient_id)
    OR (accepted= true AND recipient_id = $1 AND users.id = collabs.sender_id)
    OR (accepted = true AND sender_id = $1 AND users.id = collabs.recipient_id)
    ORDER BY first_name ASC
    `, [id])
        .then((result) => result.rows).catch(err => console.log(err));
}

function insertMessage({ sender_id, message }) {
    return db
        .query(
            `INSERT INTO messages (sender_id, message)
        VALUES ($1, $2)
        RETURNING *;
        `, [sender_id, message]).then((result) => result.rows).catch(err => console.log(err));
}


function getMessages() {
    return db
        .query(
            `SELECT first_name, last_name, img_url, sender_id, message, messages.id, 
        TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS created_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id
        ORDER BY messages.created_at DESC
        LIMIT 20`)
        .then((result) => result.rows)
        .catch(err => console.log(err));
}

function getLastMessageById({ id }) {
    return db
        .query(
            `SELECT first_name, last_name, img_url, sender_id, message, messages.id, 
        TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS created_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id
        WHERE messages.id = $1;`, [id])
        .then((result) => result.rows)
        .catch(err => console.log(err));
}


// POSTS
//--------------------------------------------------------------------->
// function to save images data to the database
function savePostData({ url, creator_id, title, desc }) {
    return db
        .query(
            `INSERT INTO posts (url, creator_id, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [url, creator_id, title, desc]
        ).then(result => {
            return result.rows[0];
        });
}
// Get last Post data + Creators data 
function getLastPostById(id) {
    return db
        .query(
            `SELECT first_name, last_name, img_url, url, title, description, posts.id, 
        TO_CHAR(posts.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS created_at
        FROM users
        JOIN posts
        ON posts.creator_id = users.id
        WHERE posts.id = $1;`, [id])
        .then((result) => result.rows)
        .catch(err => console.log(err));
}

// Get last 10 posts with their creators data
function getPostsData() {
    return db
        .query(
            `SELECT first_name, last_name, img_url, url, title, description, posts.id, 
        TO_CHAR(posts.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS created_at
        FROM users
        JOIN posts
        ON posts.creator_id = users.id
        ORDER BY posts.created_at DESC
        LIMIT 20`)
        .then((result) => result.rows)
        .catch(err => console.log(err));
}



function storeSketchData({ sketch, creator_1_id, creator_2_id }) {
    return db
        .query(
            `INSERT INTO sketches (sketch, creator_1_id, creator_2_id)
    VALUES ($1, $2, $3)`,
            [sketch, creator_1_id, creator_2_id]
        )
        .then((result) => result.rows[0]);
}


function getSketchData(creator_id) {
    return db
        .query(
            `SELECT first_name,last_name,img_url, id, sketch, creator_1_id, creator_2_id
    FROM users JOIN sketches
    ON sketches.creator_1_id = $1 OR sketches.creator_2_id = $1
    `, [creator_id])
        .then((result) => result.rows).catch(err => console.log(err));
}

// function to insert AI prompts and count into db
function insertPrompt({ count, creator_id, prompt }) {
    return db
        .query(
            `INSERT INTO aiprompts ( count,creator_id, prompt)
        VALUES ($1, $2, $3)
        ON CONFLICT (creator_id)
        DO UPDATE SET count=$1, created_at=CURRENT_TIMESTAMP
    RETURNING *`,
            [count, creator_id, prompt]
        )
        .then((result) => result.rows[0]);
}


function getAiCount(creator_id) {
    return db
        .query("SELECT * FROM aiprompts WHERE creator_id = $1", [creator_id])
        .then((result) => result.rows[0]);
}





//-------------------------------------------------------------------->
module.exports = {
    createUser,
    getCreatorById,
    getCreatorsByIds,
    getCreatorByEmail,
    addResetCode,
    verifyResetCode,
    updatePasswordByEmail,
    saveProfileImg,
    saveProfileBio,
    getCreators,
    getCreatorsByName,
    collaborations,
    getPossibleCollabs,
    insertMessage,
    getMessages,
    getLastMessageById,
    savePostData,
    getPostsData,
    getLastPostById,
    storeSketchData,
    getSketchData,
    insertPrompt,
    getAiCount

};

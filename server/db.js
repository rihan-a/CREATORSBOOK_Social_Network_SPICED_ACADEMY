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
        .query("SELECT first_name, last_name, img_url, bio FROM users WHERE id = $1", [id])
        .then((result) => result.rows[0]);
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
        .query("SELECT first_name, last_name, img_url, bio, id FROM users ORDER BY created_at DESC LIMIT 6")
        .then((result) => result.rows);
}

function getCreatorsByName(searchQuery) {

    return db
        .query(`SELECT * FROM users WHERE first_name  ILIKE $1 `, [
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
                .then((result) => result.rows);

        case "collab":
            return db
                .query(`INSERT INTO collabs (sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING *`, [userId, recipientId])
                .then((result) => result.rows);

        case "accept":
            return db
                .query(`UPDATE collabs SET accepted = true
       WHERE (sender_id=$1 AND recipient_id =$2) OR (sender_id=$2 AND recipient_id =$1)  
        `, [userId, recipientId])
                .then((result) => result.rows);

        case "cancel":
        case "end":
            return db
                .query(`DELETE FROM collabs
       WHERE (sender_id=$1 AND recipient_id =$2) OR (sender_id=$2 AND recipient_id =$1)  
        `, [userId, recipientId])
                .then((result) => result.rows);

        default:
            console.log("default stage");
    }
}





//-------------------------------------------------------------------->
module.exports = {
    createUser,
    getCreatorById,
    getCreatorByEmail,
    addResetCode,
    verifyResetCode,
    updatePasswordByEmail,
    saveProfileImg,
    saveProfileBio,
    getCreators,
    getCreatorsByName,
    collaborations
};

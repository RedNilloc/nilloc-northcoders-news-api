const db = require("../db/connection");

const fetchTopics = () => {
return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows
});
};

const fetchArticleId = (id) => {
return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
.then((result) => {
    const rows = result.rows
    if (rows.length === 0) {
        return Promise.reject({ message: "I'm sorry, Dave, I'm afraid I can't find that article"});
        } else {
            return rows[0]
        };
});
};



module.exports = { fetchTopics, fetchArticleId }    
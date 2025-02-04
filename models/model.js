const db = require("../db/connection");

const fetchTopics = () => {
return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows
});
};

const fetchArticleId = (id) => {
return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
.then((result) => {
    const rows = result.rows
    if (rows.length === 0) {
        return Promise.reject({ message: "I'm sorry, Dave, I'm afraid I can't find that"});
        } else {
            return rows[0]
        };
});
};

const fetchArticles = () => {
    return db.query(`
        SELECT articles.title, articles.topic, articles.author, 
        articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
          COUNT(articles.article_id) 
          AS comment_count 
          FROM articles 
          LEFT JOIN comments ON comments.article_id = articles.article_id 
          GROUP BY comments.article_id, articles.article_id
          ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows
    });
}

const fetchComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
                    ORDER BY created_at DESC;`, [id])
    .then((result) => {
        const rows = result.rows
        if (rows.length === 0) {
            return Promise.reject({ message: "I'm sorry, Dave, I'm afraid I can't find that"});
        } else {
            return rows
        }
        });
    };
module.exports = { fetchTopics, fetchArticleId, fetchArticles, fetchComments }    


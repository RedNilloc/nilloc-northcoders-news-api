const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

const fetchArticleId = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      const rows = result.rows;
      if (rows.length === 0) {
        return Promise.reject({
          message: "I'm sorry, Dave, I'm afraid I can't find that",
        });
      } else {
        return rows[0];
      }
    });
};

const fetchArticles = () => {
  return db
    .query(
      `
        SELECT articles.title, articles.topic, articles.author, 
        articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
          COUNT(articles.article_id) 
          AS comment_count 
          FROM articles 
          LEFT JOIN comments ON comments.article_id = articles.article_id 
          GROUP BY comments.article_id, articles.article_id
          ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
                    ORDER BY created_at DESC;`,
      [id]
    )
    .then((result) => {
      const rows = result.rows;
      if (id & (rows.length === 0)) {
        return Promise.reject({
          message: "I'm sorry, Dave, I'm afraid I can't find that",
        });
      } else {
        return rows;
      }
    });
};
const addComment = (username, body, id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) 
      VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const updateArticle = (newvote, id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [newvote, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const removeComment = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          message: "I'm sorry, Dave, I'm afraid I can't find that",
        });
      } else return result.rows[0];
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

module.exports = {
  fetchTopics,
  fetchArticleId,
  fetchArticles,
  fetchComments,
  addComment,
  updateArticle,
  removeComment,
  fetchUsers,
};

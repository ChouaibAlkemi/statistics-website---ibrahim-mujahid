const { query } = require('../config/db');

class Assessment {
  static async create({ userId, answers, totalScore, aggressionLevel }) {
    const text = `
      INSERT INTO assessments (user_id, answers, total_score, aggression_level)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [userId, answers, totalScore, aggressionLevel];
    const res = await query(text, values);
    return res.rows[0];
  }

  static async find({ userId }) {
    const text = `
      SELECT * FROM assessments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const values = [userId];
    const res = await query(text, values);
    return res.rows.map(row => ({
        _id: row.id,
        id: row.id,
        userId: row.user_id,
        answers: row.answers,
        totalScore: row.total_score,
        aggressionLevel: row.aggression_level,
        createdAt: row.created_at
    }));
  }
  
  // For Admin Dashboard
  static async findAll() {
      // Join with users to get user info
      const text = `
        SELECT a.*, u.name as user_name, u.email as user_email 
        FROM assessments a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
      `;
      const res = await query(text);
      return res.rows.map(row => ({
          _id: row.id,
          id: row.id,
          userId: row.user_id ? { name: row.user_name, email: row.user_email } : null,
          answers: row.answers,
          totalScore: row.total_score,
          aggressionLevel: row.aggression_level,
          createdAt: row.created_at
      }));
  }

  static async countDocuments() {
      const res = await query('SELECT COUNT(*) FROM assessments');
      return parseInt(res.rows[0].count);
  }

  static async getStats() {
      const totalRes = await query('SELECT COUNT(*) FROM assessments');
      const statsRes = await query(`
         SELECT aggression_level, COUNT(*) as count 
         FROM assessments 
         GROUP BY aggression_level
      `);
      return {
          total: parseInt(totalRes.rows[0].count),
          breakdown: statsRes.rows.reduce((acc, curr) => {
              acc[curr.aggression_level] = parseInt(curr.count);
              return acc;
          }, {})
      };
  }
}

module.exports = Assessment;

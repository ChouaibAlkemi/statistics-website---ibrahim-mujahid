const { query } = require('../config/db');

class Feedback {
  // Mock countDocuments for generating ID sort of
  static async countDocuments() {
    const res = await query('SELECT COUNT(*) FROM feedback');
    return parseInt(res.rows[0].count);
  }

  static async create({ anonymousName, totalScore, aggressionLevel, feedbackText, answers }) {
    const text = `
      INSERT INTO feedback (anonymous_name, total_score, aggression_level, feedback_text, answers)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [anonymousName, totalScore, aggressionLevel, feedbackText, answers];
    const res = await query(text, values);
    return res.rows[0];
  }

  static async find(condition = {}) {
    let text = 'SELECT * FROM feedback';
    const values = [];
    
    if (condition.approved) {
      text += ' WHERE approved = true';
    }

    const res = await query(text, values);
    // Sort logic is rudimentary here, better handled in specific query methods
    return res.rows.map(row => ({
        _id: row.id,
        anonymousName: row.anonymous_name,
        totalScore: row.total_score,
        aggressionLevel: row.aggression_level,
        feedbackText: row.feedback_text,
        approved: row.approved,
        createdAt: row.created_at
    }));
  }

  // Helper for stats
  static async getStats() {
     const totalRes = await query('SELECT COUNT(*) FROM feedback');
     const statsRes = await query(`
        SELECT aggression_level, COUNT(*) as count 
        FROM feedback 
        GROUP BY aggression_level
     `);
     return {
        totalCount: parseInt(totalRes.rows[0].count),
        stats: statsRes.rows.map(r => ({ _id: r.aggression_level, count: parseInt(r.count) }))
     };
  }

  static async findByIdAndUpdate(id, update) {
    if (update.approved) {
        const res = await query('UPDATE feedback SET approved = TRUE WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    }
  }

  static async findByIdAndDelete(id) {
    const res = await query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
}

module.exports = Feedback;

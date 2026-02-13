const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findOne({ email }) {
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }

  static async findById(id) {
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async create({ name, email, password, role = 'user' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const res = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role]
    );
    return res.rows[0];
  }

  static async matchPassword(enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword);
  }
}

module.exports = User;

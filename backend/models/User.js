import db from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
    /**
     * create a new user
     */
    static async create({ email, password, name }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, hashedPassword]
        );
        return result.rows[0];
    }

    /**
     * find a user by email
     */
    static async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    /**
     * find a user by id
     */
    static async findById(id) {
        const result = await db.query(
            'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    /**
     * Update user
     */
    static async update(id, updates) {
        const {name, email} = updates;
        const result = await db.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, updated_at',
            [name, email, id]
        );
        return result.rows[0];
    }

    /**
     * Update password
     */
    static async updatePassword(id, password) {
        const result = await db.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [password, id]
        );
        return result.rows[0];
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Delete user
     */
    static async delete(id) {
        await db.query(
            'DELETE FROM users WHERE id = $1',
            [id]
        );
    }

}

export default User;
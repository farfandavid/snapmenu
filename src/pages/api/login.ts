import type { APIRoute } from 'astro';
import db from '../../db/db';
import { userValidators, validateEmail, validatePassword } from '../../validators/userValidators';
import type { IErrorUser } from '../../types/Error';
import User from '../../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request }) => {
    const { email, password } = await request.json();
    const errors: IErrorUser = {};
    validateEmail(email) != null ? errors.email = validateEmail(email) : null;
    validatePassword(password) != null ? errors.password = validatePassword(password) : null;
    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ errors }), { headers: { 'content-type': 'application/json' } });
    }

    try {
        db.connectDB();
        const user = await User.findOne({ email });
        if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { headers: { 'content-type': 'application/json' } });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { headers: { 'content-type': 'application/json' } });
        const token = jwt.sign({ id: user._id }, import.meta.env.JWT_SECRET, { expiresIn: '1h' });
        db.disconnectDB();
        return new Response(JSON.stringify({ token, id: user._id }), { headers: { 'content-type': 'application/json' }, status: 200 });
    }
    catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { headers: { 'content-type': 'application/json' }, status: 500 });
    }
}

/* const loginUser = async (req, res) => {
    if (!req.is('application/json')) return res.status(400).json({ message: 'Bad request' });
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, id: user._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
} */
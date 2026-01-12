'use server';

import { promises as fs } from 'fs';
import path from 'path';

const usersPath = path.join(process.cwd(), 'data', 'users.json');

// Helper to read users
async function readUsers() {
    try {
        const data = await fs.readFile(usersPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper to write users
async function writeUsers(users: any[]) {
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}

export async function getUser(email: string) {
    const users = await readUsers();
    return users.find((u: any) => u.email === email);
}

export async function getAllUsers() {
    return await readUsers();
}

export async function createUser(userData: any) {
    const users = await readUsers();

    if (users.find((u: any) => u.email === userData.email)) {
        throw new Error('User already exists');
    }

    const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'editor', // Default role
        ...userData
    };

    users.push(newUser);
    await writeUsers(users);
    return newUser;
}

export async function updateUserRole(userId: string, newRole: string) {
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);

    if (index !== -1) {
        users[index].role = newRole;
        await writeUsers(users);
        return users[index];
    }
    throw new Error('User not found');
}

export async function changePassword(userId: string, newPass: string) {
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);

    if (index !== -1) {
        users[index].password = newPass; // In a real app, hash this!
        await writeUsers(users);
        return true;
    }
    throw new Error('User not found');
}

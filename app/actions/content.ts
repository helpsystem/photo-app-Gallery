'use server';

import fs from 'fs/promises';
import path from 'path';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

export async function getContent() {
    const data = await fs.readFile(contentPath, 'utf8');
    return JSON.parse(data);
}

export async function updateContent(section: string, newData: any) {
    const currentData = await getContent();
    const updatedData = { ...currentData, [section]: { ...currentData[section], ...newData } };
    await fs.writeFile(contentPath, JSON.stringify(updatedData, null, 2));
    return updatedData;
}

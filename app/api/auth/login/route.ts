import { NextResponse } from 'next/server';
import { getUser } from '@/app/actions/users';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    try {
        const user = await getUser(email);

        if (user && user.password === password) {
            const response = NextResponse.json({ success: true, user: { name: user.name, role: user.role, email: user.email, id: user.id } }, { status: 200 });

            // Convert user object to string for cookie (mostly for ID/Role access in middleware/client)
            const sessionData = JSON.stringify({ id: user.id, role: user.role, name: user.name });

            response.cookies.set('admin_session', sessionData, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }
    } catch (e) {
        console.error(e);
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}

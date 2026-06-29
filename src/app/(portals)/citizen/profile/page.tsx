export const dynamic = "force-dynamic";
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ProfileDashboard } from '@/components/profile/ProfileDashboard';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) {
        return <div className="text-white p-8">Unauthorized</div>;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    return (
        <div className="min-h-screen bg-[#070D19] py-8">
            <ProfileDashboard user={user} />
        </div>
    );
}

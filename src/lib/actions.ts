"use server"

import prisma from './prisma';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';

export async function getMockUser() {
    const cookieStore = await cookies();
    const role = cookieStore.get('mock_role')?.value || 'MEMBER';

    let userId = '';
    let nickname = '';

    if (role === 'ADMIN') {
        userId = 'mock-admin-id';
        nickname = 'Test ADMIN';
    } else {
        nickname = cookieStore.get('mock_nickname')?.value || 'User_' + Math.floor(Math.random() * 1000);
        userId = `mock-member-${nickname.replace(/\s+/g, '-').toLowerCase()}`;
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        user = await prisma.user.create({
            data: { id: userId, name: nickname, email: `${userId}@test.com`, role }
        });
    }

    return { ...user, role };
}

export async function setNickname(formData: FormData) {
    const nickname = formData.get('nickname') as string;
    if (nickname) {
        const cookieStore = await cookies();
        cookieStore.set('mock_nickname', nickname);
        revalidatePath('/');
    }
}

export async function getNickname() {
    const cookieStore = await cookies();
    return cookieStore.get('mock_nickname')?.value || '';
}

export async function toggleRole() {
    const cookieStore = await cookies();
    const currentRole = cookieStore.get('mock_role')?.value || 'MEMBER';
    const newRole = currentRole === 'MEMBER' ? 'ADMIN' : 'MEMBER';
    cookieStore.set('mock_role', newRole);
    revalidatePath('/');
}

export async function getCurrentRole() {
    const cookieStore = await cookies();
    return cookieStore.get('mock_role')?.value || 'MEMBER';
}

export async function getProposalsForMonth(year: number, month: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return prisma.proposal.findMany({
        where: {
            targetDate: {
                gte: startDate,
                lte: endDate,
            }
        },
        include: {
            movie: true,
            votes: {
                include: {
                    user: true
                }
            },
        }
    });
}

export async function proposeMovie(title: string, targetDate: Date) {
    const user = await getMockUser();

    // Create or find movie
    let movie = await prisma.movie.findFirst({ where: { title } });
    if (!movie) {
        movie = await prisma.movie.create({
            data: { title, synopsis: 'A great movie picked by the club.' }
        });
    }

    // Create proposal
    await prisma.proposal.create({
        data: {
            movieId: movie.id,
            userId: user.id,
            targetDate,
            status: 'VOTING'
        }
    });

    revalidatePath('/');
}

export async function voteForProposal(proposalId: string) {
    const user = await getMockUser();

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
        where: {
            proposalId_userId: { proposalId, userId: user.id }
        }
    });

    if (existingVote) {
        // Remove vote
        await prisma.vote.delete({ where: { id: existingVote.id } });
    } else {
        // Add vote
        await prisma.vote.create({
            data: { proposalId, userId: user.id }
        });
    }

    // Check threshold (e.g., 3 votes)
    const voteCount = await prisma.vote.count({ where: { proposalId } });
    if (voteCount >= 3) {
        await prisma.proposal.update({
            where: { id: proposalId },
            data: { status: 'PRELIMINARY' }
        });
    } else {
        // Revert if fell below threshold
        const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
        if (proposal?.status === 'PRELIMINARY') {
            await prisma.proposal.update({
                where: { id: proposalId },
                data: { status: 'VOTING' }
            });
        }
    }

    revalidatePath('/');
}

export async function updateProposal(proposalId: string, status: string, targetDate: Date) {
    const user = await getMockUser();
    if (user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    await prisma.proposal.update({
        where: { id: proposalId },
        data: {
            status,
            targetDate
        }
    });

    revalidatePath('/');
}

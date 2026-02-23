"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { CalendarCell } from './CalendarCell';
import { getProposalsForMonth } from '@/lib/actions';
import { ProposeMovieModal } from './ProposeMovieModal';
import { AdminEditModal } from './AdminEditModal';
import { VoteModal } from './VoteModal';

export function CalendarGrid({ role }: { role: string }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [proposals, setProposals] = useState<{ id: string, targetDate: Date | string, status: string, movie: { title: string }, votes: { id: string }[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<any>(null);

    useEffect(() => {
        async function loadProposals() {
            setLoading(true);
            try {
                const data = await getProposalsForMonth(currentDate.getFullYear(), currentDate.getMonth());
                setProposals(data);
            } catch (error) {
                console.error("Failed to load proposals", error);
            } finally {
                setLoading(false);
            }
        }
        loadProposals();
    }, [currentDate]);

    async function loadProposals() {
        setLoading(true);
        try {
            const data = await getProposalsForMonth(currentDate.getFullYear(), currentDate.getMonth());
            setProposals(data);
        } catch (error) {
            console.error("Failed to load proposals", error);
        } finally {
            setLoading(false);
        }
    }

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Create an array with empty slots for padding the first row, then the actual days
    const days = Array.from({ length: 42 }, (_, i) => {
        const dayNumber = i - firstDay + 1;
        return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div className="responsive-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{year}년 {month + 1}월</h2>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <Button variant="ghost" size="sm" onClick={handlePrevMonth} style={{ fontSize: '1.2rem', padding: '0.5rem 0.75rem' }}>&lt;</Button>
                        <Button variant="ghost" size="sm" onClick={handleNextMonth} style={{ fontSize: '1.2rem', padding: '0.5rem 0.75rem' }}>&gt;</Button>
                    </div>
                </div>
                <div className="responsive-calendar-actions">
                    <Button variant="secondary" onClick={handleToday} style={{
                        marginRight: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)'
                    }}>Today</Button>
                    <Button variant="primary" onClick={() => { setSelectedDate(undefined); setIsModalOpen(true); }}>+ Propose Movie</Button>
                </div>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading calendar...</div>}

            {!loading && (
                <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <div className="calendar-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '1px',
                        background: 'var(--border-subtle)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => {
                            let color = 'var(--text-secondary)';
                            if (idx === 0) color = '#ef4444'; // Sun (Red)
                            if (idx === 6) color = '#3b82f6'; // Sat (Blue)
                            return (
                                <div key={day} className="calendar-day-header" style={{
                                    background: 'var(--bg-surface)',
                                    padding: '0.75rem',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    color: color
                                }}>
                                    {day}
                                </div>
                            );
                        })}

                        {days.map((dayNumber, index) => {
                            const dateStr = dayNumber ? new Date(year, month, dayNumber).toISOString().split('T')[0] : null;
                            const dayProposals = dateStr ? proposals.filter(p => new Date(p.targetDate).toISOString().split('T')[0] === dateStr) : [];
                            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index % 7];

                            return (
                                <CalendarCell
                                    key={index}
                                    dayNumber={dayNumber}
                                    dayName={dayName}
                                    proposals={dayProposals}
                                    isToday={dayNumber === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()}
                                    role={role}
                                    onProposalClick={(proposal: any) => {
                                        setSelectedProposal(proposal);
                                        if (role === 'ADMIN') {
                                            setIsAdminModalOpen(true);
                                        } else {
                                            setIsVoteModalOpen(true);
                                        }
                                    }}
                                    onClick={() => {
                                        if (dateStr) {
                                            setSelectedDate(dateStr);
                                            setIsModalOpen(true);
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
            <ProposeMovieModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    loadProposals();
                }}
                defaultDate={selectedDate}
            />
            <AdminEditModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                onSuccess={() => {
                    setIsAdminModalOpen(false);
                    loadProposals();
                }}
                proposal={selectedProposal}
            />
            <VoteModal
                isOpen={isVoteModalOpen}
                onClose={() => setIsVoteModalOpen(false)}
                onSuccess={() => {
                    setIsVoteModalOpen(false);
                    loadProposals();
                }}
                proposal={selectedProposal}
            />
        </div>
    );
}

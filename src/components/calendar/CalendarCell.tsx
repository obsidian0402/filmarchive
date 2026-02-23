"use client";

import React from 'react';

interface Proposal {
    id: string;
    movie: { title: string };
    status: string;
    votes: { id: string }[];
}

interface CalendarCellProps {
    dayNumber: number | null;
    dayName?: string;
    proposals: Proposal[];
    isToday?: boolean;
    role?: string;
    onClick?: () => void;
    onProposalClick?: (proposal: Proposal) => void;
}

export function CalendarCell({ dayNumber, dayName, proposals, isToday, role, onClick, onProposalClick }: CalendarCellProps) {
    if (dayNumber === null) {
        return <div className="calendar-cell empty-cell" style={{ background: 'var(--bg-base)' }} />;
    }

    return (
        <div className="calendar-cell" style={{
            background: 'var(--bg-base)',
            minHeight: '120px',
            padding: '0.5rem',
            transition: 'background var(--transition-fast)',
            border: isToday ? '1px solid var(--accent-primary)' : '1px solid transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            cursor: onClick ? 'pointer' : 'default'
        }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-base)'}
            onClick={onClick}
        >

            {/* Render Proposals */}
            <div className="proposals-container">
                {proposals.map(proposal => {
                    let colorVar = 'var(--status-voting)';
                    let bgVar = 'rgba(234, 179, 8, 0.1)';

                    if (proposal.status === 'PRELIMINARY') {
                        colorVar = 'var(--status-preliminary)';
                        bgVar = 'rgba(249, 115, 22, 0.1)';
                    } else if (proposal.status === 'SCHEDULED') {
                        colorVar = 'var(--status-scheduled)';
                        bgVar = 'rgba(16, 185, 129, 0.1)';
                    }

                    return (
                        <div
                            key={proposal.id}
                            className="proposal-badge"
                            title={proposal.movie.title}
                            style={{
                                marginTop: '0.25rem',
                                fontSize: '0.75rem',
                                background: bgVar,
                                color: colorVar,
                                padding: '0.25rem 0.5rem',
                                borderLeft: `2px solid ${colorVar}`,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                                borderRadius: '0 4px 4px 0'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onProposalClick) onProposalClick(proposal);
                            }}
                        >
                            {proposal.movie.title}
                            {proposal.status !== 'SCHEDULED' && ` (${proposal.votes.length})`}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

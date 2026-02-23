"use client";

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { voteForProposal } from '@/lib/actions';

interface VoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    proposal: {
        id: string;
        movie: { title: string };
        votes: { user: { name: string } }[];
    } | null;
}

export function VoteModal({ isOpen, onClose, onSuccess, proposal }: VoteModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVote = async () => {
        if (!proposal) return;
        setIsSubmitting(true);
        try {
            await voteForProposal(proposal.id);
            onSuccess();
        } catch (error) {
            console.error("Error voting:", error);
            alert("Failed to vote.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!proposal) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Vote for ${proposal.movie.title}`}>
            <div style={{ padding: '0.5rem 0' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Do you want to vote for (or remove your vote from) <strong>{proposal.movie.title}</strong>?
                </p>

                {proposal.votes.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', background: 'var(--bg-base)', padding: '1rem', borderRadius: '6px' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            Current Voters ({proposal.votes.length})
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                            {proposal.votes.map((v, i) => (
                                <li key={i} style={{ display: 'inline-block', marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'var(--border-subtle)', borderRadius: '4px' }}>
                                    {v.user.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="button" variant="primary" onClick={handleVote} disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Toggle Vote'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

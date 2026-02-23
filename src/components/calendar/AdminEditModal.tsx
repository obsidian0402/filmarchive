"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { updateProposal } from '@/lib/actions';

interface AdminEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    proposal: {
        id: string;
        movie: { title: string };
        targetDate: Date | string;
        status: string;
    } | null;
}

export function AdminEditModal({ isOpen, onClose, onSuccess, proposal }: AdminEditModalProps) {
    const [targetDate, setTargetDate] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (proposal) {
            const date = new Date(proposal.targetDate);
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            setTargetDate(`${y}-${m}-${d}`);
            setStatus(proposal.status);
        }
    }, [proposal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proposal || !targetDate || !status) return;

        setIsSubmitting(true);
        try {
            await updateProposal(proposal.id, status, new Date(targetDate));
            onSuccess();
        } catch (error) {
            console.error("Error updating proposal:", error);
            alert("Failed to update proposal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!proposal) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit: ${proposal.movie.title}`}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Target Date
                    </label>
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-base)',
                            padding: '0.5rem',
                            borderRadius: '6px'
                        }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-base)',
                            padding: '0.6rem',
                            borderRadius: '6px'
                        }}
                    >
                        <option value="VOTING">VOTING</option>
                        <option value="PRELIMINARY">PRELIMINARY</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                    </select>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

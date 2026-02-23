"use client";

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { proposeMovie } from '@/lib/actions';

interface ProposeMovieModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultDate?: string;
}

export function ProposeMovieModal({ isOpen, onClose, onSuccess, defaultDate }: ProposeMovieModalProps) {
    const [title, setTitle] = useState('');
    const [targetDate, setTargetDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form if defaultDate changes while modal is open/opening
    React.useEffect(() => {
        if (defaultDate) setTargetDate(defaultDate);
    }, [defaultDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetDate) return;

        setIsSubmitting(true);
        try {
            await proposeMovie(title, new Date(targetDate));
            setTitle(''); // reset
            onSuccess();
        } catch (error) {
            console.error("Error proposing movie:", error);
            alert("Failed to propose movie.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Propose a Movie">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Movie Title</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-base)',
                            color: 'var(--text-primary)',
                            fontFamily: 'inherit'
                        }}
                        placeholder="e.g. Inception"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Target Date</label>
                    <input
                        type="date"
                        required
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-base)',
                            color: 'var(--text-primary)',
                            fontFamily: 'inherit',
                            colorScheme: 'dark'
                        }}
                    />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Proposing...' : 'Propose'}
                    </Button>
                </div>

            </form>
        </Modal>
    );
}

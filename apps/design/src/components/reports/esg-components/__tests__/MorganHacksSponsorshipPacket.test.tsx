import React from 'react';
import { render, screen } from '@testing-library/react';
import { MorganHacksSponsorshipPacket } from '../MorganHacksSponsorshipPacket';

describe('MorganHacksSponsorshipPacket', () => {
    it('renders the component with correct title', () => {
        render(<MorganHacksSponsorshipPacket />);

        expect(screen.getByText('MorganHacks 2026')).toBeInTheDocument();
    });

    it('displays the event dates', () => {
        render(<MorganHacksSponsorshipPacket />);

        expect(screen.getByText('April 11th – 12th, 2026')).toBeInTheDocument();
    });

    it('shows the event theme', () => {
        render(<MorganHacksSponsorshipPacket />);

        expect(screen.getByText('A Futuristic Tech City in a Dystopian Setting')).toBeInTheDocument();
    });

    it('displays design goals', () => {
        render(<MorganHacksSponsorshipPacket />);

        expect(screen.getByText('Eye-catching and professional')).toBeInTheDocument();
        expect(screen.getByText('Easy to read and well-organized')).toBeInTheDocument();
    });

    it('renders previous sponsors', () => {
        render(<MorganHacksSponsorshipPacket />);

        expect(screen.getByText('Google')).toBeInTheDocument();
        expect(screen.getByText('Microsoft')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('has call to action buttons', () => {
        render(<MorganHacksSponsorshipPacket />);

        expect(screen.getByText('Become a Sponsor')).toBeInTheDocument();
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });
});

// src/test/JobCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import JobCard from '../components/JobCard.jsx';

// Helper — wrap with Router (JobCard uses Link)
const renderJobCard = (props = {}) => {
    const defaultProps = {
        title: 'React Developer',
        company: 'TechCorp',
        location: 'Hyderabad',
        jobType: 'full-time',
        workMode: 'hybrid',
        experience: '2-5 years',
        salary: { min: 600000, max: 1200000, isPublic: true },
        skills: ['React', 'JavaScript', 'Redux'],
        isActive: true,
        views: 142,
        jobId: 'abc123',
        onApply: vi.fn(),
        ...props,
    };

    return render(
        <BrowserRouter>
            <JobCard {...defaultProps} />
        </BrowserRouter>
    );
};


describe('JobCard Component', () => {

    it('renders job title', () => {
        renderJobCard();
        expect(screen.getByText('React Developer')).toBeInTheDocument();
        // ↑ checks text exists in rendered DOM
    });

    it('renders company name', () => {
        renderJobCard();
        expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
        // /TechCorp/i = case insensitive regex
    });

    it('renders location', () => {
        renderJobCard();
        expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();
    });

    it('renders all skill tags', () => {
        renderJobCard();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();
    });

    it('shows salary when public', () => {
        renderJobCard({
            salary: { min: 600000, max: 1200000, isPublic: true }
        });
        expect(screen.getByText(/6\.0L/i)).toBeInTheDocument();
    });

    it('hides salary when not public', () => {
        renderJobCard({
            salary: { min: 0, max: 0, isPublic: false }
        });
        expect(screen.getByText(/not disclosed/i)).toBeInTheDocument();
    });

    it('shows Apply button when job is active', () => {
        renderJobCard({ isActive: true });
        expect(screen.getByText(/Apply Now/i)).toBeInTheDocument();
    });

    it('shows Closed when job is inactive', () => {
        renderJobCard({ isActive: false });
        expect(screen.getAllByText(/Closed/i)[0]).toBeInTheDocument();
    });

    it('calls onApply when Apply button clicked', () => {
        const mockApply = vi.fn();
        renderJobCard({ onApply: mockApply });

        fireEvent.click(screen.getByText(/Apply Now/i));
        expect(mockApply).toHaveBeenCalledTimes(1);
        // ↑ verify function was called
    });

    it('does not call onApply when job is closed', () => {
        const mockApply = vi.fn();
        renderJobCard({ isActive: false, onApply: mockApply });

        const closedBtn = screen.getByRole('button', { name: /Closed/i });
        fireEvent.click(closedBtn);
        expect(mockApply).not.toHaveBeenCalled();
    });

    it('shows hiring badge when active', () => {
        renderJobCard({ isActive: true });
        expect(screen.getByText(/Hiring/i)).toBeInTheDocument();
    });
});
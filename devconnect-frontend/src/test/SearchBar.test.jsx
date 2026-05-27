// src/test/SearchBar.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../components/SearchBar.jsx';

describe('SearchBar Component', () => {

    it('renders search input', () => {
        render(<SearchBar onSearch={vi.fn()} />);
        expect(
            screen.getByPlaceholderText(/Search jobs/i)
        ).toBeInTheDocument();
    });

    it('renders job type select', () => {
        render(<SearchBar onSearch={vi.fn()} />);
        expect(screen.getByText('All Types')).toBeInTheDocument();
    });

    it('renders work mode select', () => {
        render(<SearchBar onSearch={vi.fn()} />);
        expect(screen.getByText('All Modes')).toBeInTheDocument();
    });

    it('calls onSearch when typing in input', async () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText(/Search jobs/i);
        fireEvent.change(input, { target: { value: 'React' } });

        // Wait for debounce (500ms)
        await waitFor(() => {
            expect(mockSearch).toHaveBeenCalled();
        }, { timeout: 1000 });
    });

    it('shows clear button when input has value', () => {
        render(<SearchBar onSearch={vi.fn()} />);

        const input = screen.getByPlaceholderText(/Search jobs/i);
        fireEvent.change(input, { target: { value: 'React' } });

        expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('clears input when × clicked', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText(/Search jobs/i);
        fireEvent.change(input, { target: { value: 'React' } });

        fireEvent.click(screen.getByText('×'));
        expect(input.value).toBe('');
    });

    it('calls onSearch when job type filter changes', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const select = screen.getByText('All Types').closest('select');
        fireEvent.change(select, { target: { value: 'full-time' } });

        expect(mockSearch).toHaveBeenCalled();
    });
});
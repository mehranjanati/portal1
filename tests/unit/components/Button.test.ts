/*
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Button from '$lib/components/ui/Button.svelte';

describe('Button Component', () => {
    it('renders with correct text', () => {
        render(Button, { props: { children: 'Click me' } });
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders as a button element by default', () => {
        render(Button, { props: { children: 'Test' } });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies primary variant class', () => {
        const { container } = render(Button, {
            props: { variant: 'primary', children: 'Primary' }
        });
        const button = container.querySelector('button');
        expect(button).toHaveClass('btn-primary');
    });

    it('applies secondary variant class', () => {
        const { container } = render(Button, {
            props: { variant: 'secondary', children: 'Secondary' }
        });
        const button = container.querySelector('button');
        expect(button).toHaveClass('btn-secondary');
    });

    it('applies correct size classes', () => {
        const { container: smallContainer } = render(Button, {
            props: { size: 'sm', children: 'Small' }
        });
        expect(smallContainer.querySelector('button')).toHaveClass('btn-sm');

        const { container: largeContainer } = render(Button, {
            props: { size: 'lg', children: 'Large' }
        });
        expect(largeContainer.querySelector('button')).toHaveClass('btn-lg');
    });

    it('is disabled when disabled prop is true', () => {
        render(Button, { props: { disabled: true, children: 'Disabled' } });
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading state', () => {
        const { container } = render(Button, {
            props: { loading: true, children: 'Loading' }
        });
        expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    });

    it('calls onclick handler when clicked', async () => {
        const user = userEvent.setup();
        let clicked = false;
        const handleClick = () => {
            clicked = true;
        };

        render(Button, {
            props: { onclick: handleClick, children: 'Click' }
        });

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(true);
    });

    it('does not call onclick when disabled', async () => {
        const user = userEvent.setup();
        let clicked = false;
        const handleClick = () => {
            clicked = true;
        };

        render(Button, {
            props: { disabled: true, onclick: handleClick, children: 'Click' }
        });

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(false);
    });

    it('has correct accessibility attributes', () => {
        render(Button, {
            props: { 'aria-label': 'Submit form', children: 'Submit' }
        });
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form');
    });
});
*/


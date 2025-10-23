import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CitiznLogo from '../CitiznLogo';

describe('CitiznLogo', () => {
  it('should render with default props', () => {
    render(<CitiznLogo />);

    const logoElement = screen.getByText('Citizn');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass('text-xl'); // Default size is md
  });

  it('should render icon variant', () => {
    render(<CitiznLogo variant='icon' />);

    const logoElement = screen.queryByText('Citizn');
    expect(logoElement).not.toBeInTheDocument();

    // Check for the icon container using a more specific selector
    const iconContainer = document.querySelector(
      '.w-12.h-12.relative.bg-gradient-to-br'
    );
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-12', 'h-12'); // Default md size
  });

  it('should render small size', () => {
    render(<CitiznLogo size='sm' />);

    const logoElement = screen.getByText('Citizn');
    expect(logoElement).toHaveClass('text-lg'); // sm text size

    const iconContainer = document.querySelector('.w-8.h-8');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-8', 'h-8'); // sm icon size
  });

  it('should render large size', () => {
    render(<CitiznLogo size='lg' />);

    const logoElement = screen.getByText('Citizn');
    expect(logoElement).toHaveClass('text-4xl'); // lg text size

    const iconContainer = document.querySelector('.w-16.h-16');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-16', 'h-16'); // lg icon size
  });

  it('should apply custom className', () => {
    render(<CitiznLogo className='custom-class' />);

    const container = screen.getByText('Citizn').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('should render icon variant with custom className', () => {
    render(<CitiznLogo variant='icon' className='custom-icon-class' />);

    const iconContainer = document.querySelector('.custom-icon-class');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('custom-icon-class');
  });

  it('should render icon variant with different sizes', () => {
    const { rerender } = render(<CitiznLogo variant='icon' size='sm' />);

    let iconContainer = document.querySelector('.w-8.h-8');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-8', 'h-8');

    rerender(<CitiznLogo variant='icon' size='lg' />);

    iconContainer = document.querySelector('.w-16.h-16');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-16', 'h-16');
  });

  it('should have proper gradient styling', () => {
    render(<CitiznLogo />);

    const iconContainer = document.querySelector(
      '.bg-gradient-to-br.from-green-600'
    );
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass(
      'bg-gradient-to-br',
      'from-green-600',
      'via-green-700',
      'to-green-800'
    );
  });

  it('should have proper text gradient styling', () => {
    render(<CitiznLogo />);

    const textElement = screen.getByText('Citizn');
    expect(textElement).toHaveClass(
      'bg-gradient-to-r',
      'from-gray-900',
      'to-gray-700',
      'bg-clip-text',
      'text-transparent'
    );
  });

  it('should render geometric design elements', () => {
    render(<CitiznLogo variant='icon' />);

    const iconContainer = document.querySelector('.rounded-xl.shadow-lg');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('rounded-xl', 'shadow-lg');

    // Check for the central hexagon and connecting dots
    const geometricElements = iconContainer?.querySelectorAll('div');
    expect(geometricElements?.length).toBeGreaterThan(0);
  });

  it('should maintain proper spacing and layout', () => {
    render(<CitiznLogo />);

    const container = screen.getByText('Citizn').closest('div');
    expect(container).toHaveClass('flex', 'items-center', 'space-x-3');
  });
});

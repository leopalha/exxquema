import { render, screen } from '@testing-library/react';
import Skeleton, { SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonTableRow } from '../Skeleton';

describe('Skeleton', () => {
  it('renders skeleton element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders text variant by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('h-4');
  });

  it('renders title variant', () => {
    const { container } = render(<Skeleton variant="title" />);
    expect(container.firstChild).toHaveClass('h-8');
  });

  it('renders avatar variant', () => {
    const { container } = render(<Skeleton variant="avatar" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('renders rectangular variant', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    expect(container.firstChild).toHaveClass('rounded-lg');
  });

  it('renders circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('animates by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('disables animation when animate is false', () => {
    const { container } = render(<Skeleton animate={false} />);
    expect(container.firstChild).not.toHaveClass('animate-pulse');
  });

  it('applies custom width', () => {
    const { container } = render(<Skeleton width="200px" />);
    expect(container.firstChild).toHaveStyle({ width: '200px' });
  });

  it('applies custom height', () => {
    const { container } = render(<Skeleton height="50px" />);
    expect(container.firstChild).toHaveStyle({ height: '50px' });
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonText', () => {
  it('renders multiple lines by default', () => {
    const { container } = render(<SkeletonText />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('renders custom number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(5);
  });

  it('last line is shorter', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll('.animate-pulse');
    const lastLine = lines[lines.length - 1];
    expect(lastLine).toHaveStyle({ width: '60%' });
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonText className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonCard', () => {
  it('renders skeleton card structure', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('has card styling', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toHaveClass('bg-neutral-100');
    expect(container.firstChild).toHaveClass('rounded-2xl');
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonCard className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonAvatar', () => {
  it('renders avatar skeleton', () => {
    const { container } = render(<SkeletonAvatar />);
    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('renders with text by default', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('renders without text when withText is false', () => {
    const { container } = render(<SkeletonAvatar withText={false} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(1);
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonAvatar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonTableRow', () => {
  it('renders table row with default columns', () => {
    const { container } = render(<SkeletonTableRow />);
    const columns = container.querySelectorAll('.animate-pulse');
    expect(columns.length).toBe(4);
  });

  it('renders custom number of columns', () => {
    const { container } = render(<SkeletonTableRow columns={6} />);
    const columns = container.querySelectorAll('.animate-pulse');
    expect(columns.length).toBe(6);
  });

  it('first column is wider', () => {
    const { container } = render(<SkeletonTableRow />);
    const firstColumn = container.querySelector('.animate-pulse');
    expect(firstColumn).toHaveStyle({ width: '30%' });
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonTableRow className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

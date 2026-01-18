import { render, screen, fireEvent } from '@testing-library/react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders default variant', () => {
    const { container } = render(<Card>Default</Card>);
    expect(container.firstChild).toHaveClass('bg-neutral-100');
  });

  it('renders elevated variant', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    expect(container.firstChild).toHaveClass('shadow-card');
  });

  it('renders gradient variant', () => {
    const { container } = render(<Card variant="gradient">Gradient</Card>);
    expect(container.firstChild).toHaveClass('bg-gradient-to-b');
  });

  it('renders glass variant', () => {
    const { container } = render(<Card variant="glass">Glass</Card>);
    expect(container.firstChild).toHaveClass('backdrop-blur-lg');
  });

  it('renders outline variant', () => {
    const { container } = render(<Card variant="outline">Outline</Card>);
    expect(container.firstChild).toHaveClass('bg-transparent');
  });

  it('applies small padding', () => {
    const { container } = render(<Card padding="sm">Small Padding</Card>);
    expect(container.firstChild).toHaveClass('p-3');
  });

  it('applies large padding', () => {
    const { container } = render(<Card padding="lg">Large Padding</Card>);
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('applies no padding', () => {
    const { container } = render(<Card padding="none">No Padding</Card>);
    expect(container.firstChild).toHaveClass('p-0');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);

    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows cursor pointer when clickable', () => {
    const { container } = render(<Card onClick={() => {}}>Clickable</Card>);
    expect(container.firstChild).toHaveClass('cursor-pointer');
  });

  it('disables hover effects when hover is false', () => {
    const { container } = render(<Card hover={false}>No Hover</Card>);
    const card = container.firstChild;
    // Check that hover classes are not applied
    expect(card.className).not.toContain('hover:');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardHeader', () => {
  it('renders header content', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    expect(container.firstChild).toHaveClass('custom-header');
  });
});

describe('CardTitle', () => {
  it('renders title as h3', () => {
    render(<CardTitle>Title Text</CardTitle>);
    const title = screen.getByText('Title Text');
    expect(title.tagName).toBe('H3');
  });

  it('applies title styles', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title).toHaveClass('text-lg', 'font-semibold');
  });
});

describe('CardDescription', () => {
  it('renders description as paragraph', () => {
    render(<CardDescription>Description text</CardDescription>);
    const desc = screen.getByText('Description text');
    expect(desc.tagName).toBe('P');
  });

  it('applies description styles', () => {
    render(<CardDescription>Desc</CardDescription>);
    const desc = screen.getByText('Desc');
    expect(desc).toHaveClass('text-sm', 'text-neutral-700');
  });
});

describe('CardContent', () => {
  it('renders content correctly', () => {
    render(<CardContent>Main Content</CardContent>);
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('renders footer content', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies border top', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    expect(container.firstChild).toHaveClass('border-t');
  });
});

describe('Card Composition', () => {
  it('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Body</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Body')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
});

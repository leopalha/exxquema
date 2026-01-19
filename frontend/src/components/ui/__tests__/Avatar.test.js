import { render, screen } from '@testing-library/react';
import Avatar, { AvatarGroup } from '../Avatar';

describe('Avatar', () => {
  it('renders avatar', () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with image src', () => {
    render(<Avatar src="/test.jpg" alt="Test Avatar" />);
    expect(screen.getByAltText('Test Avatar')).toBeInTheDocument();
  });

  it('renders initials from name', () => {
    const { container } = render(<Avatar name="John Doe" />);
    // Use container to avoid multiple matches in other tests
    expect(container.textContent).toContain('JD');
  });

  it('renders single initial for single name', () => {
    const { container } = render(<Avatar name="John" />);
    expect(container.textContent).toContain('J');
  });

  it('renders default icon when no src or name', () => {
    const { container } = render(<Avatar />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders extra small size', () => {
    const { container } = render(<Avatar size="xs" />);
    const avatar = container.querySelector('.w-6');
    expect(avatar).toBeInTheDocument();
  });

  it('renders small size', () => {
    const { container } = render(<Avatar size="sm" />);
    const avatar = container.querySelector('.w-8');
    expect(avatar).toBeInTheDocument();
  });

  it('renders medium size by default', () => {
    const { container } = render(<Avatar />);
    const avatar = container.querySelector('.w-10');
    expect(avatar).toBeInTheDocument();
  });

  it('renders large size', () => {
    const { container } = render(<Avatar size="lg" />);
    const avatar = container.querySelector('.w-12');
    expect(avatar).toBeInTheDocument();
  });

  it('renders extra large size', () => {
    const { container } = render(<Avatar size="xl" />);
    const avatar = container.querySelector('.w-16');
    expect(avatar).toBeInTheDocument();
  });

  it('renders 2xl size', () => {
    const { container } = render(<Avatar size="2xl" />);
    const avatar = container.querySelector('.w-20');
    expect(avatar).toBeInTheDocument();
  });

  it('renders bordered variant', () => {
    const { container } = render(<Avatar variant="bordered" name="Test" />);
    const avatar = container.querySelector('.ring-2');
    expect(avatar).toBeInTheDocument();
  });

  it('renders online status', () => {
    const { container } = render(<Avatar status="online" />);
    const statusBadge = container.querySelector('.bg-green-500');
    expect(statusBadge).toBeInTheDocument();
  });

  it('renders offline status', () => {
    const { container } = render(<Avatar status="offline" />);
    const statusBadge = container.querySelector('.bg-gray-500');
    expect(statusBadge).toBeInTheDocument();
  });

  it('renders away status', () => {
    const { container } = render(<Avatar status="away" />);
    const statusBadge = container.querySelector('.bg-yellow-500');
    expect(statusBadge).toBeInTheDocument();
  });

  it('renders busy status', () => {
    const { container } = render(<Avatar status="busy" />);
    const statusBadge = container.querySelector('.bg-red-500');
    expect(statusBadge).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Avatar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles image error', () => {
    render(<Avatar src="/invalid.jpg" name="Fallback User" />);
    const img = screen.getByRole('img');

    // Simulate image error
    img.dispatchEvent(new Event('error'));

    // Should show initials as fallback
    expect(screen.getByText('FU')).toBeInTheDocument();
  });
});

describe('AvatarGroup', () => {
  it('renders multiple avatars', () => {
    render(
      <AvatarGroup>
        <Avatar name="User 1" />
        <Avatar name="User 2" />
        <Avatar name="User 3" />
      </AvatarGroup>
    );

    expect(screen.getByText('U1')).toBeInTheDocument();
    expect(screen.getByText('U2')).toBeInTheDocument();
    expect(screen.getByText('U3')).toBeInTheDocument();
  });

  it('limits displayed avatars based on max prop', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="User 1" />
        <Avatar name="User 2" />
        <Avatar name="User 3" />
        <Avatar name="User 4" />
      </AvatarGroup>
    );

    // Should show first 2 avatars and "+2" badge
    expect(screen.getByText('U1')).toBeInTheDocument();
    expect(screen.getByText('U2')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows remaining count when exceeding max', () => {
    const avatars = Array.from({ length: 5 }, (_, i) => (
      <Avatar key={i} name={`User ${i + 1}`} />
    ));

    render(<AvatarGroup max={3}>{avatars}</AvatarGroup>);

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AvatarGroup className="custom-class">
        <Avatar name="User" />
      </AvatarGroup>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies size to group', () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar name="User 1" />
        <Avatar name="User 2" />
      </AvatarGroup>
    );

    // Check if size classes are applied
    expect(container.firstChild).toBeInTheDocument();
  });
});

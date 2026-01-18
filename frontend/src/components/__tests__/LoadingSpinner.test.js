import { render, screen } from '@testing-library/react';
import LoadingSpinner, {
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonChart,
  SkeletonProductCard,
  SkeletonOrderCard,
  SkeletonProfile,
  SkeletonStats,
  SkeletonMenu,
  SkeletonForm,
  InlineLoader,
  PageLoader,
} from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders with text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders small size', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    expect(container.querySelector('.w-5')).toBeInTheDocument();
  });

  it('renders medium size', () => {
    const { container } = render(<LoadingSpinner size="medium" />);
    expect(container.querySelector('.w-8')).toBeInTheDocument();
  });

  it('renders large size', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    expect(container.querySelector('.w-12')).toBeInTheDocument();
  });

  it('renders xl size', () => {
    const { container } = render(<LoadingSpinner size="xl" />);
    expect(container.querySelector('.w-16')).toBeInTheDocument();
  });

  it('renders orange color by default', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.border-orange-500')).toBeInTheDocument();
  });

  it('renders white color', () => {
    const { container } = render(<LoadingSpinner color="white" />);
    expect(container.querySelector('.border-white')).toBeInTheDocument();
  });

  it('renders gray color', () => {
    const { container } = render(<LoadingSpinner color="gray" />);
    expect(container.querySelector('.border-gray-600')).toBeInTheDocument();
  });

  it('renders fullScreen overlay', () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  it('renders fullScreen with text', () => {
    render(<LoadingSpinner fullScreen text="Processing..." />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('renders skeleton card', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('has card structure', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.bg-gray-800')).toBeInTheDocument();
  });
});

describe('SkeletonList', () => {
  it('renders default number of items', () => {
    const { container } = render(<SkeletonList />);
    const items = container.querySelectorAll('.bg-gray-800');
    expect(items.length).toBe(5);
  });

  it('renders custom number of items', () => {
    const { container } = render(<SkeletonList count={3} />);
    const items = container.querySelectorAll('.bg-gray-800');
    expect(items.length).toBe(3);
  });
});

describe('SkeletonTable', () => {
  it('renders default rows and columns', () => {
    const { container } = render(<SkeletonTable />);
    expect(container.querySelector('.bg-gray-800')).toBeInTheDocument();
  });

  it('renders custom rows', () => {
    const { container } = render(<SkeletonTable rows={3} />);
    const rows = container.querySelectorAll('.divide-y > div');
    expect(rows.length).toBe(3);
  });
});

describe('SkeletonChart', () => {
  it('renders skeleton chart', () => {
    const { container } = render(<SkeletonChart />);
    expect(container.querySelector('.h-64')).toBeInTheDocument();
  });

  it('has chart structure with legend', () => {
    const { container } = render(<SkeletonChart />);
    const legendItems = container.querySelectorAll('.rounded-full');
    expect(legendItems.length).toBeGreaterThan(0);
  });
});

describe('SkeletonProductCard', () => {
  it('renders product card skeleton', () => {
    const { container } = render(<SkeletonProductCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('has product card structure', () => {
    const { container } = render(<SkeletonProductCard />);
    expect(container.querySelector('.h-40')).toBeInTheDocument();
  });
});

describe('SkeletonOrderCard', () => {
  it('renders order card skeleton', () => {
    const { container } = render(<SkeletonOrderCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('SkeletonProfile', () => {
  it('renders profile skeleton', () => {
    const { container } = render(<SkeletonProfile />);
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });

  it('has profile structure with avatar', () => {
    const { container } = render(<SkeletonProfile />);
    expect(container.querySelector('.w-20')).toBeInTheDocument();
  });
});

describe('SkeletonStats', () => {
  it('renders default number of stats', () => {
    const { container } = render(<SkeletonStats />);
    const stats = container.querySelectorAll('.bg-gray-900');
    expect(stats.length).toBe(4);
  });

  it('renders custom number of stats', () => {
    const { container } = render(<SkeletonStats count={6} />);
    const stats = container.querySelectorAll('.bg-gray-900');
    expect(stats.length).toBe(6);
  });
});

describe('SkeletonMenu', () => {
  it('renders menu skeleton with categories', () => {
    const { container } = render(<SkeletonMenu />);
    const categories = container.querySelectorAll('.h-10');
    expect(categories.length).toBeGreaterThan(0);
  });
});

describe('SkeletonForm', () => {
  it('renders default number of fields', () => {
    const { container } = render(<SkeletonForm />);
    const fields = container.querySelectorAll('.h-10');
    expect(fields.length).toBe(4);
  });

  it('renders custom number of fields', () => {
    const { container } = render(<SkeletonForm fields={6} />);
    const fields = container.querySelectorAll('.h-10');
    expect(fields.length).toBe(6);
  });
});

describe('InlineLoader', () => {
  it('renders inline loader', () => {
    render(<InlineLoader />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<InlineLoader text="Processando..." />);
    expect(screen.getByText('Processando...')).toBeInTheDocument();
  });

  it('has inline display', () => {
    const { container } = render(<InlineLoader />);
    expect(container.firstChild).toHaveClass('inline-flex');
  });
});

describe('PageLoader', () => {
  it('renders page loader', () => {
    render(<PageLoader />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<PageLoader text="Iniciando..." />);
    expect(screen.getByText('Iniciando...')).toBeInTheDocument();
  });

  it('covers full screen', () => {
    const { container } = render(<PageLoader />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});

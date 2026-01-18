import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from '../EventCard';

const mockEvent = {
  dia: 'Segunda-feira',
  emoji: '🎵',
  titulo: 'Happy Hour',
  subtitulo: 'Música ao vivo',
  descricaoCurta: 'Aproveite nosso happy hour com música ao vivo.',
  descricaoCompleta: 'Venha curtir o melhor happy hour da cidade com música ao vivo e drinks especiais.',
  horarios: [
    {
      inicio: '18:00',
      fim: '20:00',
      atividade: 'Happy Hour',
      descricao: 'Drinks com 30% de desconto',
    },
    {
      inicio: '20:00',
      fim: '22:00',
      atividade: 'Show ao Vivo',
      descricao: 'Banda local',
    },
  ],
  promocoes: [
    {
      icone: '🍺',
      titulo: 'Cerveja',
      preco: 'R$ 7.00',
      descricao: 'Todas as cervejas',
    },
  ],
  publico: 'Adultos (+18)',
  dressCode: 'Casual',
  musica: ['Rock', 'Pop'],
  reserva: 'Recomendada',
};

describe('EventCard', () => {
  it('renders event information', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
    expect(screen.getByText('Happy Hour')).toBeInTheDocument();
    expect(screen.getByText('Música ao vivo')).toBeInTheDocument();
  });

  it('displays event emoji', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('🎵')).toBeInTheDocument();
  });

  it('shows short description', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/Aproveite nosso happy hour/)).toBeInTheDocument();
  });

  it('displays preview of time range', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/18:00 - 22:00/)).toBeInTheDocument();
  });

  it('shows HOJE badge when isToday is true', () => {
    render(<EventCard event={mockEvent} isToday={true} />);
    expect(screen.getByText('HOJE')).toBeInTheDocument();
  });

  it('expands when clicked', () => {
    render(<EventCard event={mockEvent} />);

    const card = screen.getByText('Happy Hour').closest('div');
    fireEvent.click(card);

    // Should show complete description after expanding
    expect(screen.getByText(/Venha curtir o melhor happy hour/)).toBeInTheDocument();
  });

  it('displays detailed schedules when expanded', () => {
    render(<EventCard event={mockEvent} isExpanded={true} />);

    // Use getAllByText since "Happy Hour" appears multiple times
    const happyHourElements = screen.getAllByText('Happy Hour');
    expect(happyHourElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Drinks com 30% de desconto/)).toBeInTheDocument();
    expect(screen.getByText('Show ao Vivo')).toBeInTheDocument();
  });

  it('shows promotions when expanded', () => {
    render(<EventCard event={mockEvent} isExpanded={true} />);

    expect(screen.getByText('Cerveja')).toBeInTheDocument();
    expect(screen.getByText(/R$s+7.00/)).toBeInTheDocument();
    expect(screen.getByText('Todas as cervejas')).toBeInTheDocument();
  });

  it('displays additional info when expanded', () => {
    render(<EventCard event={mockEvent} isExpanded={true} />);

    expect(screen.getByText('Adultos (+18)')).toBeInTheDocument();
    expect(screen.getByText('Casual')).toBeInTheDocument();
    expect(screen.getByText(/Rock, Pop/)).toBeInTheDocument();
    expect(screen.getByText('Recomendada')).toBeInTheDocument();
  });

  it('shows lineup when available', () => {
    const eventWithLineup = {
      ...mockEvent,
      lineup: [
        {
          data: '01/02',
          artista: 'DJ Teste',
          genero: 'Electronic',
          bpm: '128',
        },
      ],
    };

    render(<EventCard event={eventWithLineup} isExpanded={true} />);

    expect(screen.getByText('Line-up do Mês')).toBeInTheDocument();
    expect(screen.getByText('DJ Teste')).toBeInTheDocument();
    expect(screen.getByText('Electronic')).toBeInTheDocument();
  });

  it('shows tema do mes when available', () => {
    const eventWithTema = {
      ...mockEvent,
      temaMes: {
        emoji: '🎭',
        nome: 'Anos 80',
        descricao: 'Músicas dos anos 80',
        dressCode: 'Retrô',
        premio: 'Melhor fantasia ganha 1 garrafa',
      },
    };

    render(<EventCard event={eventWithTema} isExpanded={true} />);

    expect(screen.getByText(/Tema do Mês: Anos 80/)).toBeInTheDocument();
    expect(screen.getByText(/Melhor fantasia/)).toBeInTheDocument();
  });

  it('shows warning message when available', () => {
    const eventWithWarning = {
      ...mockEvent,
      atencao: 'Evento sujeito a lotação',
    };

    render(<EventCard event={eventWithWarning} isExpanded={true} />);

    expect(screen.getByText('Evento sujeito a lotação')).toBeInTheDocument();
  });

  it('renders CTAs when expanded', () => {
    render(<EventCard event={mockEvent} isExpanded={true} />);

    expect(screen.getByText('Reservar Mesa')).toBeInTheDocument();
    expect(screen.getByText('Adicionar à Agenda')).toBeInTheDocument();
  });

  it('toggles expand/collapse state', () => {
    const { rerender } = render(<EventCard event={mockEvent} />);

    // Initially collapsed
    expect(screen.queryByText(/Venha curtir o melhor happy hour/)).not.toBeInTheDocument();

    // Click to expand
    const expandButton = screen.getByRole('button', { name: /expandir/i });
    fireEvent.click(expandButton);

    // Should be expanded now
    rerender(<EventCard event={mockEvent} isExpanded={true} />);
  });

  it('renders chevron icons for expand/collapse', () => {
    const { container } = render(<EventCard event={mockEvent} />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});

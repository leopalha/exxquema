import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

jest.mock('../../stores/themeStore', () => ({
  useThemeStore: () => ({
    getPalette: () => ({
      textPrimary: 'text-magenta-500',
      textSecondary: 'text-cyan-500',
    }),
  }),
}));

jest.mock('../../data/frases', () => ({
  frasesFooter: [
    'Teste frase 1',
    'Teste frase 2',
  ],
}));

describe('Footer', () => {
  it('renders footer with all sections', () => {
    render(<Footer />);

    // Check for main sections
    expect(screen.getByText('Links Rapidos')).toBeInTheDocument();
    expect(screen.getByText('Informacoes')).toBeInTheDocument();
    expect(screen.getByText('Siga-nos')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<Footer />);

    expect(screen.getByText(/Rua Arnaldo Quintela 19/i)).toBeInTheDocument();
    expect(screen.getByText(/(21) 99554-6492/i)).toBeInTheDocument();
    expect(screen.getByText(/contato@flamelounge.com.br/i)).toBeInTheDocument();
  });

  it('displays business hours', () => {
    render(<Footer />);

    expect(screen.getByText(/Dom-Qui: 16h as 02h/i)).toBeInTheDocument();
    expect(screen.getByText(/Sex-Sab: 16h as 03h/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);

    expect(screen.getByText('Cardapio')).toBeInTheDocument();
    expect(screen.getByText('Reservas')).toBeInTheDocument();
    expect(screen.getByText('Programacao')).toBeInTheDocument();
    expect(screen.getByText('Avaliacoes')).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);

    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();
    expect(screen.getByText('Politica de Privacidade')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders social media links with correct attributes', () => {
    render(<Footer />);

    const socialLinks = screen.getAllByRole('link', { name: /Facebook|Instagram|Twitter/i });
    expect(socialLinks.length).toBeGreaterThan(0);

    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('displays current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear} FLAME Lounge Bar`))).toBeInTheDocument();
  });

  it('renders newsletter subscription input', () => {
    render(<Footer />);

    const emailInput = screen.getByPlaceholderText('Seu e-mail');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('rotates phrases from data', () => {
    const { container } = render(<Footer />);

    // Should display one of the test phrases
    const footerText = container.textContent;
    const hasPhrases = footerText.includes('Teste frase 1') || footerText.includes('Teste frase 2');
    expect(hasPhrases).toBe(true);
  });
});

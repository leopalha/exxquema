import * as format from '../format'

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    test('formats numbers correctly', () => {
      expect(format.formatCurrency(35.90)).toBe('R$ 35,90')
      expect(format.formatCurrency(100)).toBe('R$ 100,00')
      expect(format.formatCurrency(0)).toBe('R$ 0,00')
    })

    test('handles string input', () => {
      expect(format.formatCurrency('35.90')).toBe('R$ 35,90')
      expect(format.formatCurrency('100')).toBe('R$ 100,00')
    })

    test('handles invalid input', () => {
      expect(format.formatCurrency('invalid')).toBe('R$ 0,00')
      expect(format.formatCurrency(null)).toBe('R$ 0,00')
      expect(format.formatCurrency(undefined)).toBe('R$ 0,00')
    })

    test('handles large numbers', () => {
      expect(format.formatCurrency(1000000)).toBe('R$ 1.000.000,00')
    })

    test('handles decimal precision', () => {
      expect(format.formatCurrency(35.999)).toBe('R$ 36,00')
      expect(format.formatCurrency(35.994)).toBe('R$ 35,99')
    })
  })

  describe('formatNumber', () => {
    test('formats numbers with no decimals by default', () => {
      expect(format.formatNumber(1234)).toBe('1.234')
      expect(format.formatNumber(1234.56)).toBe('1.235')
    })

    test('formats numbers with specified decimals', () => {
      expect(format.formatNumber(1234.56, 2)).toBe('1.234,56')
      expect(format.formatNumber(1234.5, 2)).toBe('1.234,50')
    })

    test('handles string input', () => {
      expect(format.formatNumber('1234')).toBe('1.234')
    })
  })

  describe('formatPhone', () => {
    test('formats 11-digit phone (mobile)', () => {
      expect(format.formatPhone('11999887766')).toBe('(11) 99988-7766')
    })

    test('formats 10-digit phone (landline)', () => {
      expect(format.formatPhone('1133334444')).toBe('(11) 3333-4444')
    })

    test('handles already formatted phone', () => {
      expect(format.formatPhone('(11) 99988-7766')).toBe('(11) 99988-7766')
    })

    test('handles empty input', () => {
      expect(format.formatPhone('')).toBe('')
      expect(format.formatPhone(null)).toBe('')
    })

    test('returns unformatted for invalid length', () => {
      expect(format.formatPhone('123')).toBe('123')
    })
  })

  describe('formatCPF', () => {
    test('formats 11-digit CPF correctly', () => {
      expect(format.formatCPF('12345678900')).toBe('123.456.789-00')
    })

    test('handles already formatted CPF', () => {
      expect(format.formatCPF('123.456.789-00')).toBe('123.456.789-00')
    })

    test('handles empty input', () => {
      expect(format.formatCPF('')).toBe('')
      expect(format.formatCPF(null)).toBe('')
    })

    test('returns unformatted for invalid length', () => {
      expect(format.formatCPF('123')).toBe('123')
    })
  })

  describe('formatDate', () => {
    const testDate = new Date('2026-01-17T12:30:00')

    test('formats date in short format', () => {
      const result = format.formatDate(testDate, 'short')
      expect(result).toContain('17')
      expect(result).toContain('01')
      expect(result).toContain('2026')
    })

    test('formats date in long format', () => {
      const result = format.formatDate(testDate, 'long')
      expect(result).toContain('2026')
      expect(result).toContain('janeiro')
    })

    test('formats time only', () => {
      const result = format.formatDate(testDate, 'time')
      expect(result).toContain('12')
      expect(result).toContain('30')
    })

    test('formats datetime', () => {
      const result = format.formatDate(testDate, 'datetime')
      expect(result).toBeTruthy()
    })

    test('handles empty input', () => {
      expect(format.formatDate('')).toBe('')
      expect(format.formatDate(null)).toBe('')
    })

    test('handles invalid date', () => {
      expect(format.formatDate('invalid')).toBe('')
    })
  })

  describe('formatRelativeTime', () => {
    test('formats "now" correctly', () => {
      const now = new Date()
      expect(format.formatRelativeTime(now)).toBe('agora mesmo')
    })

    test('formats minutes correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      expect(format.formatRelativeTime(fiveMinutesAgo)).toBe('há 5 minutos')
    })

    test('formats single minute correctly', () => {
      const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000)
      expect(format.formatRelativeTime(oneMinuteAgo)).toBe('há 1 minuto')
    })

    test('formats hours correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(format.formatRelativeTime(twoHoursAgo)).toBe('há 2 horas')
    })

    test('formats single hour correctly', () => {
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000)
      expect(format.formatRelativeTime(oneHourAgo)).toBe('há 1 hora')
    })

    test('formats days correctly', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      expect(format.formatRelativeTime(threeDaysAgo)).toBe('há 3 dias')
    })
  })

  describe('formatDuration', () => {
    test('formats minutes only', () => {
      expect(format.formatDuration(30)).toBe('30min')
      expect(format.formatDuration(59)).toBe('59min')
    })

    test('formats hours only', () => {
      expect(format.formatDuration(60)).toBe('1h')
      expect(format.formatDuration(120)).toBe('2h')
    })

    test('formats hours and minutes', () => {
      expect(format.formatDuration(90)).toBe('1h 30min')
      expect(format.formatDuration(150)).toBe('2h 30min')
    })

    test('handles zero and negative', () => {
      expect(format.formatDuration(0)).toBe('0min')
      expect(format.formatDuration(-10)).toBe('0min')
      expect(format.formatDuration(null)).toBe('0min')
    })
  })

  describe('formatFileSize', () => {
    test('formats bytes', () => {
      expect(format.formatFileSize(500)).toBe('500 B')
    })

    test('formats kilobytes', () => {
      expect(format.formatFileSize(2048)).toBe('2 KB')
    })

    test('formats megabytes', () => {
      expect(format.formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
    })

    test('formats gigabytes', () => {
      expect(format.formatFileSize(3 * 1024 * 1024 * 1024)).toBe('3 GB')
    })

    test('handles zero and null', () => {
      expect(format.formatFileSize(0)).toBe('0 B')
      expect(format.formatFileSize(null)).toBe('0 B')
    })

    test('handles decimal values', () => {
      expect(format.formatFileSize(1536)).toBe('1.5 KB')
    })
  })

  describe('formatPercentage', () => {
    test('formats percentage with default decimal', () => {
      expect(format.formatPercentage(85.5)).toBe('85.5%')
      expect(format.formatPercentage(100)).toBe('100.0%')
    })

    test('formats percentage with custom decimals', () => {
      expect(format.formatPercentage(85.555, 2)).toBe('85.56%')
      expect(format.formatPercentage(85.555, 0)).toBe('86%')
    })

    test('handles string input', () => {
      expect(format.formatPercentage('85.5')).toBe('85.5%')
    })

    test('handles invalid input', () => {
      expect(format.formatPercentage('invalid')).toBe('0.0%')
    })
  })

  describe('truncateText', () => {
    test('truncates long text', () => {
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
      expect(format.truncateText(longText, 50)).toBe('Lorem ipsum dolor sit amet, consectetur adipi...')
    })

    test('does not truncate short text', () => {
      const shortText = 'Short text'
      expect(format.truncateText(shortText, 50)).toBe('Short text')
    })

    test('uses custom suffix', () => {
      const longText = 'Lorem ipsum dolor sit amet'
      expect(format.truncateText(longText, 15, '…')).toBe('Lorem ipsum do…')
    })

    test('handles empty input', () => {
      expect(format.truncateText('')).toBe('')
      expect(format.truncateText(null)).toBe('')
    })
  })

  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(format.capitalize('hello')).toBe('Hello')
      expect(format.capitalize('HELLO')).toBe('Hello')
    })

    test('handles single character', () => {
      expect(format.capitalize('a')).toBe('A')
    })

    test('handles empty input', () => {
      expect(format.capitalize('')).toBe('')
      expect(format.capitalize(null)).toBe('')
    })
  })

  describe('titleCase', () => {
    test('converts to title case', () => {
      expect(format.titleCase('hello world')).toBe('Hello World')
      expect(format.titleCase('HELLO WORLD')).toBe('Hello World')
    })

    test('handles multiple spaces', () => {
      expect(format.titleCase('hello  world')).toBe('Hello  World')
    })

    test('handles empty input', () => {
      expect(format.titleCase('')).toBe('')
      expect(format.titleCase(null)).toBe('')
    })
  })

  describe('slugify', () => {
    test('converts to slug', () => {
      expect(format.slugify('Hello World')).toBe('hello-world')
      expect(format.slugify('Hello  World')).toBe('hello-world')
    })

    test('removes accents', () => {
      expect(format.slugify('Olá Mundo')).toBe('ola-mundo')
      expect(format.slugify('Café')).toBe('cafe')
    })

    test('removes special characters', () => {
      expect(format.slugify('Hello @#$ World!')).toBe('hello-world')
    })

    test('handles empty input', () => {
      expect(format.slugify('')).toBe('')
      expect(format.slugify(null)).toBe('')
    })
  })

  describe('getInitials', () => {
    test('gets initials from name', () => {
      expect(format.getInitials('John Doe')).toBe('JD')
      expect(format.getInitials('John Michael Doe', 3)).toBe('JMD')
    })

    test('handles single name', () => {
      expect(format.getInitials('John')).toBe('J')
    })

    test('respects maxInitials limit', () => {
      expect(format.getInitials('John Michael Doe', 2)).toBe('JM')
    })

    test('handles empty input', () => {
      expect(format.getInitials('')).toBe('')
      expect(format.getInitials(null)).toBe('')
    })
  })

  describe('maskInput', () => {
    test('applies phone mask', () => {
      expect(format.maskInput('11999887766', format.masks.phone)).toBe('(11) 99988-7766')
    })

    test('applies CPF mask', () => {
      expect(format.maskInput('12345678900', format.masks.cpf)).toBe('123.456.789-00')
    })

    test('handles incomplete input', () => {
      expect(format.maskInput('1199', format.masks.phone)).toBe('(11) 99')
    })

    test('handles empty input', () => {
      expect(format.maskInput('', format.masks.phone)).toBe('')
      expect(format.maskInput(null, format.masks.phone)).toBe(null)
    })
  })

  describe('applyMask', () => {
    test('applies phone mask', () => {
      expect(format.applyMask('11999887766', 'phone')).toBe('(11) 99988-7766')
    })

    test('applies CPF mask', () => {
      expect(format.applyMask('12345678900', 'cpf')).toBe('123.456.789-00')
    })

    test('applies CEP mask', () => {
      expect(format.applyMask('01310100', 'cep')).toBe('01310-100')
    })

    test('handles unknown mask type', () => {
      expect(format.applyMask('12345', 'unknown')).toBe('12345')
    })
  })

  describe('removeMask', () => {
    test('removes phone mask', () => {
      expect(format.removeMask('(11) 99988-7766')).toBe('11999887766')
    })

    test('removes CPF mask', () => {
      expect(format.removeMask('123.456.789-00')).toBe('12345678900')
    })

    test('handles unmasked value', () => {
      expect(format.removeMask('12345')).toBe('12345')
    })

    test('handles empty input', () => {
      expect(format.removeMask('')).toBe('')
      expect(format.removeMask(null)).toBe('')
    })
  })

  describe('formatOrderStatus', () => {
    test('formats order statuses correctly', () => {
      expect(format.formatOrderStatus('pending')).toBe('Pendente')
      expect(format.formatOrderStatus('pending_payment')).toBe('Aguardando Pagamento')
      expect(format.formatOrderStatus('confirmed')).toBe('Confirmado')
      expect(format.formatOrderStatus('preparing')).toBe('Preparando')
      expect(format.formatOrderStatus('ready')).toBe('Pronto')
      expect(format.formatOrderStatus('on_way')).toBe('A Caminho')
      expect(format.formatOrderStatus('delivered')).toBe('Entregue')
      expect(format.formatOrderStatus('cancelled')).toBe('Cancelado')
    })

    test('returns original status for unknown', () => {
      expect(format.formatOrderStatus('unknown')).toBe('unknown')
    })
  })

  describe('getStatusColor', () => {
    test('returns correct colors', () => {
      expect(format.getStatusColor('pending')).toBe('yellow')
      expect(format.getStatusColor('confirmed')).toBe('blue')
      expect(format.getStatusColor('preparing')).toBe('orange')
      expect(format.getStatusColor('ready')).toBe('green')
      expect(format.getStatusColor('delivered')).toBe('green')
      expect(format.getStatusColor('cancelled')).toBe('red')
    })

    test('returns gray for unknown status', () => {
      expect(format.getStatusColor('unknown')).toBe('gray')
    })
  })

  describe('formatPaymentMethod', () => {
    test('formats payment methods correctly', () => {
      expect(format.formatPaymentMethod('cash')).toBe('Dinheiro')
      expect(format.formatPaymentMethod('card')).toBe('Cartão')
      expect(format.formatPaymentMethod('pix')).toBe('PIX')
      expect(format.formatPaymentMethod('credit_card')).toBe('Cartão de Crédito')
      expect(format.formatPaymentMethod('debit_card')).toBe('Cartão de Débito')
    })

    test('returns original method for unknown', () => {
      expect(format.formatPaymentMethod('unknown')).toBe('unknown')
    })
  })

  describe('formatTableNumber', () => {
    test('formats table number', () => {
      expect(format.formatTableNumber(5)).toBe('Mesa 5')
      expect(format.formatTableNumber(12)).toBe('Mesa 12')
    })

    test('handles empty input', () => {
      expect(format.formatTableNumber(null)).toBe('')
      expect(format.formatTableNumber('')).toBe('')
    })
  })

  describe('formatRating', () => {
    test('formats rating with stars', () => {
      expect(format.formatRating(4.5)).toBe('★★★★☆ (4.5)')
      expect(format.formatRating(5)).toBe('★★★★★ (5.0)')
      expect(format.formatRating(3)).toBe('★★★☆☆ (3.0)')
    })

    test('handles no rating', () => {
      expect(format.formatRating(null)).toBe('Sem avaliação')
      expect(format.formatRating(0)).toBe('☆☆☆☆☆ (0.0)')
    })

    test('handles custom max rating', () => {
      expect(format.formatRating(3, 10)).toBe('★★★☆☆☆☆☆☆☆ (3.0)')
    })
  })
})

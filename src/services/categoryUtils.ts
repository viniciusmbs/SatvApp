/**
 * Ordena categorias garantindo:
 * 1. FAVORITOS no início (se presente)
 * 2. ABERTOS obrigatoriamente em primeiro lugar entre as categorias de canais
 * 3. Todas as demais categorias em rigorosa ordem alfabética
 */
export const sortCategories = (categories: string[]): string[] => {
  return [...categories].sort((a, b) => {
    const upperA = a.trim().toUpperCase();
    const upperB = b.trim().toUpperCase();

    if (upperA === upperB) return 0;
    if (upperA === 'FAVORITOS') return -1;
    if (upperB === 'FAVORITOS') return 1;
    if (upperA === 'ABERTOS') return -1;
    if (upperB === 'ABERTOS') return 1;

    return a.localeCompare(b, 'pt-BR', { sensitivity: 'base' });
  });
};

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import mockProducts from './mocks/mockProducts';
import getProducts from './services/product.service';

jest.mock('./services/product.service', () => ({
  __esModule: true,
  default: jest.fn(),
}));

/**
 * Renderiza e aguarda o carregamento dos produtos antes de devolver o controle,
 * para que nenhuma atualização de estado aconteça fora do alcance dos testes.
 */
const renderApp = async () => {
  render(<App />);
  await screen.findByLabelText('Integração com chatbots');
};

describe('App - fluxo do formulário até a lista de recomendações', () => {
  beforeEach(() => {
    getProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Começa sem nenhuma recomendação na lista', async () => {
    await renderApp();

    expect(
      screen.getByText('Nenhuma recomendação encontrada.')
    ).toBeInTheDocument();
  });

  test('Oferece todas as preferências e funcionalidades do catálogo', async () => {
    await renderApp();

    expect(
      screen.getByLabelText('Integração fácil com ferramentas de e-mail')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Histórico unificado de interações')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Integração com RD Station CRM e Marketing')
    ).toBeInTheDocument();
  });

  test('Exibe a recomendação única depois de submeter o formulário', async () => {
    await renderApp();

    userEvent.click(screen.getByLabelText('Integração com chatbots'));
    userEvent.click(screen.getByLabelText('Produto Único'));
    userEvent.click(screen.getByRole('button', { name: 'Obter recomendação' }));

    expect(await screen.findByText('RD Conversas')).toBeInTheDocument();
    expect(
      screen.queryByText('Nenhuma recomendação encontrada.')
    ).not.toBeInTheDocument();
  });

  test('Exibe vários produtos quando o tipo é Múltiplos Produtos', async () => {
    await renderApp();

    userEvent.click(screen.getByLabelText('Personalização de funis de vendas'));
    userEvent.click(screen.getByLabelText('Automação de marketing'));
    userEvent.click(screen.getByLabelText('Múltiplos Produtos'));
    userEvent.click(screen.getByRole('button', { name: 'Obter recomendação' }));

    expect(await screen.findByText('RD Station CRM')).toBeInTheDocument();
    expect(screen.getByText('RD Station Marketing')).toBeInTheDocument();
  });
});

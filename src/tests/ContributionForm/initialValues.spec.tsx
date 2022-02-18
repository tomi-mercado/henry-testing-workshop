import { screen, render, waitFor, prettyDOM } from '@testing-library/react';

import faker from 'faker';

import ContributionForm from '../../components/ContributionForm';

import { submitButtonText } from './helpers';

describe('Initial values', () => {
  it('should render an empty input if not pass title. Same with description and links.', async () => {
    await waitFor(() => {
      render(
        <ContributionForm
          onSubmit={jest.fn()}
          title="Agregar contribucion"
          submitButtonText={submitButtonText}
        />
      );
    });

    expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'description' })).toHaveValue(
      ''
    );
    expect(screen.getByRole('textbox', { name: 'links' })).toHaveValue('');
    expect(screen.getAllByRole('textbox', { name: 'links' })).toHaveLength(1);
  });

  it('should render title passed in initial values by default', async () => {
    const title = 'Mi contribucion 1';
    await waitFor(() => {
      render(
        <ContributionForm
          onSubmit={jest.fn()}
          title="Agregar contribucion"
          submitButtonText={submitButtonText}
          initialValues={{
            title,
          }}
        />
      );
    });

    expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(title);
  });

  it('should render description passed in initial values by default', async () => {
    const description = 'Mi descripcion 1';
    await waitFor(() => {
      render(
        <ContributionForm
          onSubmit={jest.fn()}
          title="Agregar contribucion"
          submitButtonText={submitButtonText}
          initialValues={{
            description,
          }}
        />
      );
    });

    expect(screen.getByRole('textbox', { name: 'description' })).toHaveValue(
      description
    );
  });

  it('should render links passed in initial values by default', async () => {
    const links = [faker.internet.url(), faker.internet.url()];
    await waitFor(() => {
      render(
        <ContributionForm
          onSubmit={jest.fn()}
          title="Agregar contribucion"
          submitButtonText={submitButtonText}
          initialValues={{
            links,
          }}
        />
      );
    });

    links.forEach((link, i) => {
      expect(screen.getAllByRole('textbox', { name: 'links' })[i]).toHaveValue(
        link
      );
    });
    expect(screen.getAllByRole('textbox', { name: 'links' })).toHaveLength(
      links.length
    );
  });

  it('should render an error passing a non link', async () => {
    const links = ['a simple string'];
    await waitFor(() => {
      render(
        <ContributionForm
          onSubmit={jest.fn()}
          title="Agregar contribucion"
          submitButtonText={submitButtonText}
          initialValues={{
            links,
          }}
        />
      );
    });

    expect(
      screen.getByText('Hay errores en los campos cargados por defecto')
    ).toBeTruthy();
  });
});

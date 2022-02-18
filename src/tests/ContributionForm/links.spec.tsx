import {
  RenderResult,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import faker from 'faker';

import { renderContainer } from './helpers';

describe('Links Fields', () => {
  let container: RenderResult;

  beforeEach(async () => {
    container = await renderContainer();
  });

  it('should render one field of links by default', () => {
    expect(screen.getAllByRole('textbox', { name: 'links' })).toHaveLength(1);
  });

  it('AÑADIR button should be disabled if there are not value', () => {
    expect(screen.getByRole('button', { name: 'Añadir' })).toHaveClass(
      'Mui-disabled'
    );
  });

  it('AÑADIR button should be disabled if there are not correct link', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: 'a simple string' },
      });
    });
    expect(screen.getByRole('button', { name: 'Añadir' })).toHaveClass(
      'Mui-disabled'
    );
  });

  it('AÑADIR button should be able if there enter correct link', async () => {
    fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
      target: { value: faker.internet.url() },
    });
    expect(
      await screen.findByRole('button', { name: 'Añadir' })
    ).not.toHaveClass('Mui-disabled');
  });

  it('if AÑADIR button is able and click it, should render a new field', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: faker.internet.url() },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(screen.getAllByRole('textbox', { name: 'links' })).toHaveLength(2);
  });

  it('After adding many links, should remove correctly item with remove button', async () => {
    const links = [
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
    ];

    await links.reduce(async (promise, link, i) => {
      await promise;
      await waitFor(() => {
        fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[i], {
          target: { value: link },
        });
      });
      if (i !== links.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
      }
    }, Promise.resolve());

    await waitFor(() =>
      fireEvent.click(screen.getByRole('button', { name: 'remove-links-1' }))
    );

    expect(screen.getAllByRole('textbox', { name: 'links' })[0]).toHaveValue(
      links[0]
    );
    expect(screen.getAllByRole('textbox', { name: 'links' })[1]).toHaveValue(
      links[2]
    );
    expect(screen.getAllByRole('textbox', { name: 'links' })).toHaveLength(2);
  });

  it('should render an error if link is not valid', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: 'a simple string' },
      });
    });
    expect(screen.getByText('Debe ingresar un link valido')).toBeDefined();
  });

  it('should render an error if enter the same link in two or more fields', async () => {
    const link = faker.internet.url();

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: link },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[1], {
        target: { value: link },
      });
    });

    expect(screen.getByText('No puede haber campos repetidos')).toBeDefined();
  });

  it('should not throw an error if complete all correctly, add a new link, complete it correctly and remove value of first link', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: faker.internet.url() },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[1], {
        target: { value: faker.internet.url() },
      });
    });
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: '' },
      });
    });

    expect(screen.queryByText('No puede haber campos repetidos')).toBeFalsy();
    expect(screen.queryByText('Debe ingresar un link valido')).toBeFalsy();
  });

  it(`should not throw any error if add a link, add another equal (this will render an error in the second link),
  change the first and put the same again (this will render an error in first link) and remove the first`, async () => {
    const link = faker.internet.url();

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: link },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[1], {
        target: { value: link },
      });
    });

    // remove last char and put it again in the first input
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: link.slice(0, link.length - 1) },
      });
    });
    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[0], {
        target: { value: link },
      });
    });

    expect(
      screen
        .getAllByRole('textbox', { name: 'links' })[0]
        .parentElement?.parentElement?.querySelector('p')?.innerHTML
    ).toBe('No puede haber campos repetidos');

    expect(
      screen
        .getAllByRole('textbox', { name: 'links' })[1]
        .parentElement?.parentElement?.querySelector('p')?.innerHTML
    ).toBeFalsy();

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'remove-links-1' }));
    });

    expect(screen.queryByText('No puede haber campos repetidos')).toBeFalsy();
  });
});

import {
  RenderResult,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import faker from 'faker';

import { renderContainer, submitButtonText } from './helpers';

describe('Submit button', () => {
  let container: RenderResult;
  beforeEach(async () => {
    container = await renderContainer();
  });

  it('should be disabled by default', () => {
    expect(screen.getByRole('button', { name: submitButtonText })).toHaveClass(
      'Mui-disabled'
    );
  });

  it('should be able when complete title, description and at least one link', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'links' }), {
        target: { value: faker.internet.url() },
      });
    });

    expect(
      screen.getByRole('button', { name: submitButtonText })
    ).not.toHaveClass('Mui-disabled');
  });

  it('should be disabled if complete all fields but enter a non link in links', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'links' }), {
        target: { value: 'a simple string' },
      });
    });

    expect(screen.getByRole('button', { name: submitButtonText })).toHaveClass(
      'Mui-disabled'
    );
  });

  it('should be disabled if complete all correctly, add a new link, and enter a non link', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'links' }), {
        target: { value: faker.internet.url() },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[1], {
        target: { value: 'a simple string' },
      });
    });

    expect(screen.getByRole('button', { name: submitButtonText })).toHaveClass(
      'Mui-disabled'
    );
  });

  it('should be able if complete all correctly, add a new link, complete it correctly and remove value of first link', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'links' }), {
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

    expect(
      screen.getByRole('button', { name: submitButtonText })
    ).not.toHaveClass('Mui-disabled');
  });

  it('should be able if complete all fields, add a link, put a non link here and remove it', async () => {
    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'links' }), {
        target: { value: faker.internet.url() },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[1], {
        target: { value: 'a simple string' },
      });
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'remove-links-1' }));
    });

    expect(
      screen.getByRole('button', { name: submitButtonText })
    ).not.toHaveClass('Mui-disabled');
  });
});

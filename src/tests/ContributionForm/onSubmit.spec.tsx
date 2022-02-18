import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';

import faker from 'faker';

import ContributionForm from '../../components/ContributionForm';

import { submitButtonText } from './helpers';

describe('onSubmit', () => {
  let container: RenderResult;
  let onSubmit: jest.Mock;

  beforeEach(async () => {
    onSubmit = jest.fn();
    container = await waitFor(() =>
      render(
        <ContributionForm
          onSubmit={onSubmit}
          submitButtonText={submitButtonText}
          title="Crear contribucion"
        />
      )
    );
  });

  it('should call onSubmit with title, description and array of links', async () => {
    const link = faker.internet.url();

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
        target: { value: link },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: submitButtonText }));

    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'a simple string',
      description: 'a simple string',
      links: [link],
    });
  });

  it('should call onSubmit with title, description and array of links, removing empty links', async () => {
    const links = [
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
    ];

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

    await links.reduce((promise, link, i) => {
      return promise.then(() => {
        return waitFor(() => {
          fireEvent.change(
            screen.getAllByRole('textbox', { name: 'links' })[i],
            {
              target: { value: link },
            }
          );
        }).then(() => {
          if (i !== links.length - 1) {
            fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
          }
        });
      });
    }, Promise.resolve());

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole('textbox', { name: 'links' })[1], {
        target: { value: '' },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: submitButtonText }));
    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'a simple string',
      description: 'a simple string',
      links: [links[0], links[2]],
    });
  });
});

import { TextField } from '@mui/material';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Enzyme, { ShallowWrapper } from 'enzyme';
import faker from 'faker';

import { renderContainerEnzyme, runAllPromises } from './helpers';

Enzyme.configure({ adapter: new Adapter() });

describe('Links fields (Enzyme)', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = renderContainerEnzyme();
  });

  it('should render one field of links by default', () => {
    expect(wrapper.find({ name: 'links' })).toHaveLength(1);
  });

  it('AÑADIR button should be disabled if there are not value', () => {
    expect(wrapper.find({ type: 'submit' }).prop('disabled')).toBeTruthy();
  });

  it('AÑADIR button should be disabled if there are not correct link', async () => {
    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: faker.random.word(),
      index: 0,
    });
    await runAllPromises();

    expect(wrapper.find({ name: 'links' }).prop('disableAdd')).toBeTruthy();
  });

  it('AÑADIR button should be able if there enter correct link', async () => {
    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: faker.internet.url(),
      index: 0,
    });
    await runAllPromises();

    expect(wrapper.find({ name: 'links' }).prop('disableAdd')).toBeFalsy();
  });

  it('if AÑADIR button is able and click it, should render a new field', async () => {
    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: faker.internet.url(),
      index: 0,
    });
    await runAllPromises();

    expect(wrapper.find({ name: 'links' }).prop('disableAdd')).toBeFalsy();

    wrapper.find({ name: 'links' }).prop('onAdd')({
      name: 'links',
    });

    expect(wrapper.find({ name: 'links' }).dive().find(TextField)).toHaveLength(
      2
    );
  });

  it('After adding many links, should remove correctly item with remove button', async () => {
    const links = [
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
    ];

    await links.reduce(async (promise, link, i) => {
      await promise;
      wrapper.find({ name: 'links' }).simulate('change', {
        name: 'links',
        value: link,
        index: i,
      });
      await runAllPromises();

      if (i !== links.length - 1) {
        wrapper.find({ name: 'links' }).prop('onAdd')({ name: 'links' });
      }
    }, Promise.resolve());

    wrapper.find({ name: 'links' }).prop('onRemove')({
      name: 'links',
      index: 1,
    });

    const inputs = wrapper.find({ name: 'links' }).dive().find(TextField);
    expect(inputs.at(0).prop('value')).toBe(links[0]);
    expect(inputs.at(1).prop('value')).toBe(links[2]);
  });

  it('should render an error if link is not valid', async () => {
    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: 'a simple string',
      index: 0,
    });

    await runAllPromises();

    expect(
      wrapper.find({ name: 'links' }).dive().find(TextField).prop('helperText')
    ).toEqual('Debe ingresar un link valido');
  });

  it('should render an error if enter the same link in two or more fields', async () => {
    const link = faker.internet.url();

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 0,
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onAdd')({
      name: 'links',
    });

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 1,
    });
    await runAllPromises();

    expect(
      wrapper
        .find({ name: 'links' })
        .dive()
        .find(TextField)
        .at(1)
        .prop('helperText')
    ).toEqual('No puede haber campos repetidos');
  });

  it('should not throw an error if complete all correctly, add a new link, complete it correctly and remove value of first link', async () => {
    const link = faker.internet.url();

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 0,
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onAdd')({
      name: 'links',
    });

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 1,
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: '',
      index: 0,
    });
    await runAllPromises();

    expect(
      wrapper
        .find({ name: 'links' })
        .dive()
        .find(TextField)
        .at(0)
        .prop('helperText')
    ).toBeFalsy();
    expect(
      wrapper
        .find({ name: 'links' })
        .dive()
        .find(TextField)
        .at(1)
        .prop('helperText')
    ).toBeFalsy();
  });

  it(`should not throw any error if add a link, add another equal (this will render an error in the second link),
  change the first and put the same again (this will render an error in first link) and remove the first`, async () => {
    const link = faker.internet.url();

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 0,
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onAdd')({ name: 'links' });

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 1,
    });
    await runAllPromises();

    // remove last char and put it again in the first input
    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link.slice(0, link.length - 1),
      index: 0,
    });
    await runAllPromises();
    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: link,
      index: 0,
    });
    await runAllPromises();

    expect(
      wrapper
        .find({ name: 'links' })
        .dive()
        .find(TextField)
        .at(0)
        .prop('helperText')
    ).toBeTruthy();
    expect(
      wrapper
        .find({ name: 'links' })
        .dive()
        .find(TextField)
        .at(1)
        .prop('helperText')
    ).toBeFalsy();

    wrapper.find({ name: 'links' }).prop('onRemove')({
      name: 'links',
      index: 1,
    });
    await runAllPromises();

    expect(
      wrapper.find({ name: 'links' }).dive().find(TextField).prop('helperText')
    ).toBeFalsy();
  });
});

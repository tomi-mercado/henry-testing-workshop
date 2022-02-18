import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Enzyme, { ShallowWrapper } from 'enzyme';
import faker from 'faker';

import { renderContainerEnzyme, runAllPromises } from './helpers';

Enzyme.configure({ adapter: new Adapter() });

describe('Submit button (Enzyme)', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = renderContainerEnzyme();
  });

  it('should be disabled by default', () => {
    expect(
      wrapper.find({ name: 'submitButton' }).prop('disabled')
    ).toBeTruthy();
  });

  it('should be able when complete title, description and at least one link', async () => {
    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.internet.url(),
      index: 0,
      name: 'links',
    });
    await runAllPromises();

    expect(wrapper.find({ name: 'submitButton' }).prop('disabled')).toBeFalsy();
  });

  it('should be disabled if complete all fields but enter a non link in links', async () => {
    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: faker.random.word(),
      index: 0,
    });
    await runAllPromises();

    expect(
      wrapper.find({ name: 'submitButton' }).prop('disabled')
    ).toBeTruthy();
  });

  it('should be disabled if complete all correctly, add a new link, and enter a non link', async () => {
    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.internet.url(),
      index: 0,
      name: 'links',
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onAdd')({ name: 'links' });

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.random.word(),
      index: 1,
      name: 'links',
    });
    await runAllPromises();

    expect(
      wrapper.find({ name: 'submitButton' }).prop('disabled')
    ).toBeTruthy();
  });

  it('should be able if complete all correctly, add a new link, complete it correctly and remove value of first link', async () => {
    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.internet.url(),
      index: 0,
      name: 'links',
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onAdd')({ name: 'links' });

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.internet.url(),
      index: 1,
      name: 'links',
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      value: '',
      index: 0,
      name: 'links',
    });
    await runAllPromises();

    expect(wrapper.find({ name: 'submitButton' }).prop('disabled')).toBeFalsy();
  });

  it('should be able if complete all fields, add a link, put a non link here and remove it', async () => {
    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.internet.url(),
      index: 0,
      name: 'links',
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onAdd')({ name: 'links' });

    wrapper.find({ name: 'links' }).simulate('change', {
      value: faker.random.word(),
      index: 1,
      name: 'links',
    });
    await runAllPromises();

    wrapper.find({ name: 'links' }).prop('onRemove')({
      name: 'links',
      index: 1,
    });
    await runAllPromises();

    expect(wrapper.find({ name: 'submitButton' }).prop('disabled')).toBeFalsy();
  });
});

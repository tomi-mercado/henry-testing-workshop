import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Enzyme, { shallow, ShallowWrapper } from 'enzyme';
import faker from 'faker';

import ContributionForm from '../../components/ContributionForm';

import { runAllPromises, submitButtonText } from './helpers';

Enzyme.configure({ adapter: new Adapter() });

describe('onSubmit (Enzyme)', () => {
  let wrapper: ShallowWrapper;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
    wrapper = shallow(
      <ContributionForm
        onSubmit={onSubmit}
        submitButtonText={submitButtonText}
        title="Crear contribucion"
      />
    );
  });

  it('should call onSubmit with title, description and array of links', async () => {
    const link = faker.internet.url();

    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'links' })
      .simulate('change', { value: link, index: 0, name: 'links' });
    await runAllPromises();

    wrapper.find({ name: 'submitButton' }).simulate('click');

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

    wrapper
      .find({ name: 'title' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

    wrapper
      .find({ name: 'description' })
      .simulate('change', { target: { value: 'a simple string' } });
    await runAllPromises();

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

    wrapper.find({ name: 'links' }).simulate('change', {
      name: 'links',
      value: '',
      index: 1,
    });
    await runAllPromises();

    wrapper.find({ name: 'submitButton' }).simulate('click');

    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'a simple string',
      description: 'a simple string',
      links: [links[0], links[2]],
    });
  });
});

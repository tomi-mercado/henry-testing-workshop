import { waitFor, render } from "@testing-library/react";
import { shallow } from "enzyme";
import ContributionForm from "../../components/ContributionForm";

export const submitButtonText = "Enviar";

export const renderContainer = () => {
  const onSubmit = jest.fn();
  return waitFor(() => {
    return render(
      <ContributionForm
        onSubmit={onSubmit}
        submitButtonText={submitButtonText}
        title="Crear contribucion"
      />
    );
  });
};

export const renderContainerEnzyme = () => {
  const onSubmit = jest.fn();
  return shallow(
    <ContributionForm
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
      title="Crear contribucion"
    />
  );
};

// https://www.benmvp.com/blog/asynchronous-testing-with-enzyme-react-jest/
export const runAllPromises = () => new Promise(setImmediate);

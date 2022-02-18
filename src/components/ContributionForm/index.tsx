import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import * as yup from "yup";
import { AnySchema } from "yup";

import MultipleTextField from "../MultipleTextField";

declare module "yup" {
  // tslint:disable-next-line
  interface ArraySchema<T> {
    unique(mapper: (a: T) => T, message: string): ArraySchema<T>;
  }
}

function ContributionForm({
  title,
  submitButtonText,
  initialValues,
  onSubmit,
}: {
  title: string | React.ReactNode;
  submitButtonText: string | React.ReactNode;
  initialValues?: { [x: string]: string | string[] };
  onSubmit: (payload: { [x: string]: string | string[] }) => void;
}) {
  interface Question {
    name: string;
    label: string;
    textarea?: boolean;
    value: string | string[];
  }

  const questions: Question[] = [
    {
      name: "title",
      label: "Título",
      value: "",
    },
    {
      name: "description",
      label: "Descripción",
      value: "",
      textarea: true,
    },
    {
      name: "links",
      label: "Añade links de referencia",
      value: [""],
    },
  ];

  const [state, setState] = useState<{
    localValues: { [x: string]: string | string[] };
    errors: { [x: string]: string | string[] | null };
  }>({
    localValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      links: initialValues?.links || [""],
    },
    errors: {
      title: null,
      description: null,
      links: [],
    },
  });

  useEffect(() => {
    Object.entries(state.localValues).reduce((promise, [name, value]) => {
      return promise.then(() => {
        if (typeof value !== "string") {
          const newValue = [...state.localValues[name]];
          (
            validations?.[name]?.validate(newValue, { strict: true }) ||
            Promise.resolve()
          )
            .then(() => {
              const newErrors = { ...state.errors };
              newErrors[name] = [];

              setState((state) => ({
                ...state,
                errors: newErrors,
              }));
            })
            .catch(() => {
              const fieldErrors = state.errors[name] as string[];
              const newFieldErrors = [...fieldErrors];
              newFieldErrors[state.localValues[name].length - 1] =
                "Hay errores en los campos cargados por defecto";

              setState((state) => ({
                ...state,
                errors: { ...state.errors, [name]: newFieldErrors },
              }));
            });
        }
      });
    }, Promise.resolve());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  yup.addMethod(
    yup.array,
    "unique",
    function (mapper = (a: string) => a, message) {
      return this.test("unique", message, function (list) {
        return (
          (list && list.length === new Set(list.map(mapper)).size) || false
        );
      });
    }
  );

  const validations: { [x: string]: AnySchema } = {
    title: yup.string().required("El titulo es requerido"),
    description: yup.string().required("La descripcion es requerida"),
    links: yup
      .array()
      .of(yup.string().url("Debe ingresar un link valido"))
      .unique((link) => link, "No puede haber campos repetidos"),
  };

  const notCompletedRequiredFields = Object.values(state.localValues).some(
    (value) =>
      typeof value === "string"
        ? !value
        : !!value.length && value.every((v) => !v)
  );

  const areErrors = Object.values(state.errors).some(
    (err) => !!err && (typeof err === "string" ? !!err : err.some((e) => !!e))
  );

  const handleChangeMultiple = async ({
    name,
    value,
    index,
  }: {
    name: string;
    value: string;
    index: number;
  }) => {
    const newValue = [...state.localValues[name]];
    newValue[index] = value;
    (
      validations?.[name]?.validate(newValue, { strict: true }) ||
      Promise.resolve()
    )
      .then(() => {
        const newErrors = { ...state.errors };
        newErrors[name] = [];

        const newValue = [...state.localValues[name]];
        newValue[index] = value;

        setState({
          errors: newErrors,
          localValues: {
            ...state.localValues,
            [name]: newValue,
          },
        });
      })
      .catch((error: { message: string }) => {
        const fieldErrors = state.errors[name] as string[];
        const newFieldErrors = [...fieldErrors];
        newFieldErrors[index] = error.message;

        const newValue = [...state.localValues[name]];
        newValue[index] = value;

        setState({
          localValues: {
            ...state.localValues,
            [name]: newValue,
          },
          errors: { ...state.errors, [name]: newFieldErrors },
        });
      });
  };

  const handleChangeSimple = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    (
      validations?.[name]?.validate(value, { strict: true }) ||
      Promise.resolve()
    )
      .then(() => {
        const newErrors = { ...state.errors };
        delete newErrors[name];

        setState({
          localValues: {
            ...state.localValues,
            [name]: value,
          },
          errors: newErrors,
        });
      })
      .catch((error: { message: string }) => {
        setState({
          localValues: {
            ...state.localValues,
            [name]: value,
          },
          errors: { ...state.errors, [name]: error.message },
        });
      });
  };

  const handleRemove = ({ name, index }: { name: string; index: number }) => {
    const newValue = [...state.localValues[name]];
    (
      validations?.[name]?.validate(newValue, { strict: true }) ||
      Promise.resolve()
    )
      .then(() => {
        const newErrors = { ...state.errors };
        newErrors[name] = [];

        const newValue = [...state.localValues[name]];
        newValue.splice(index, 1);

        setState({
          localValues: {
            ...state.localValues,
            [name]: newValue,
          },
          errors: newErrors,
        });
      })
      .catch((error: { message: string }) => {
        const fieldErrors = state.errors[name] as string[];
        const newFieldErrors = [...fieldErrors];
        newFieldErrors[index] = error.message;

        const newValue = [...state.localValues[name]];
        newValue.splice(index, 1);

        setState({
          localValues: {
            ...state.localValues,
            [name]: newValue,
          },
          errors: { ...state.errors, [name]: newFieldErrors },
        });
      });

    newValue.splice(index, 1);
    const fieldErrors = state.errors[name] as string[];
    const newFieldErrors = [...fieldErrors];
    newFieldErrors.splice(index, 1);
    setState({
      localValues: {
        ...state.localValues,
        [name]: newValue,
      },
      errors: { ...state.errors, [name]: newFieldErrors },
    });
  };

  const handleAdd = ({ name }: { name: string }) => {
    setState({
      ...state,
      localValues: {
        ...state.localValues,
        [name]: [...state.localValues[name], ""],
      },
    });
  };

  const handleSubmit = () => {
    const payload: { [x: string]: string | string[] } = Object.entries(
      state.localValues
    ).reduce(
      (acc, [name, value]) => ({
        ...acc,
        [name]:
          typeof value === "string" ? value : value.filter((value) => !!value),
      }),
      {
        ...state.localValues,
      }
    );
    onSubmit(payload);
  };

  return (
    <>
      <Box width="100%" height="100%" p={3} pt={0}>
        <Box mb={4}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        {questions.map(({ label, textarea, name }) => {
          const value = state.localValues[name];

          const isMultipleValue = !!value && typeof value !== "string";
          const lastValue = isMultipleValue && value[value.length - 1];
          const isAddDisabled =
            isMultipleValue &&
            (!lastValue || !!state.errors[name]?.[value.length - 1]);

          return (
            <Box mb={1} key={name} width="100%">
              {typeof value === "string" ? (
                <TextField
                  name={name}
                  fullWidth
                  multiline={!!textarea}
                  label={label}
                  value={value}
                  onChange={({ target: { value } }) =>
                    handleChangeSimple({ name, value })
                  }
                  inputProps={{
                    "aria-label": name,
                  }}
                  error={!!state.errors[name]}
                  helperText={state.errors[name]}
                />
              ) : (
                <MultipleTextField
                  values={value}
                  label={label}
                  name={name}
                  onChange={handleChangeMultiple}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  disableAdd={isAddDisabled}
                  errors={state.errors[name] as string[]}
                />
              )}
            </Box>
          );
        })}
      </Box>
      <Box width="100%" display="flex" justifyContent="flex-end" p={3} pt={1}>
        <Button
          name="submitButton"
          disabled={notCompletedRequiredFields || areErrors}
          onClick={handleSubmit}
          variant="contained"
          type="submit"
        >
          {submitButtonText}
        </Button>
      </Box>
    </>
  );
}

export default ContributionForm;

import React from "react";

import Container from "@mui/material/Container";

import ContributionForm from "./components/ContributionForm";

function App() {
  return (
    <Container maxWidth="md">
      <ContributionForm
        title="Crear contribucion"
        submitButtonText="Guardar"
        onSubmit={(payload) => console.log(payload)}
      />
    </Container>
  );
}

export default App;

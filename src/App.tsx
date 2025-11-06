import React from "react";
import { Container } from "@mantine/core";
import ProductTable from "./components/ProductTable";

export default function App() {
  return (
    <Container size="lg" py="xl">
      <ProductTable />
    </Container>
  );
}
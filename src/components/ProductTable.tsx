import React, { useState } from "react";
import {
  Table,
  Checkbox,
  Badge,
  Tooltip,
  Button,
  Modal,
  TextInput,
  MultiSelect,
  Select,
  Group,
  Box,
  Title,
  Divider,
  ScrollArea,
} from "@mantine/core";

interface Product {
  id: string;
  type: string;
  componentStatus: string;
  digStatus: string;
  physStatus: string;
  printBy: string;
  shipBy: string;
  parts: string[];
  componentDetails: string[];
}

interface FilterState {
  prodType: string[];
  digStatus: string[];
  physStatus: string[];
}

interface SavedConfig {
  name: string;
  filters: FilterState;
}

const productData: Product[] = [
  {
    id: "30002",
    type: "Wrist Flex",
    componentStatus: "0/0/2",
    digStatus: "Internally Approved",
    physStatus: "Quality Approved",
    printBy: "2025-10-07",
    shipBy: "2025-10-09",
    parts: ["Wrist Band, size M", "Velcro Strip, size 12cm", "Elastic Cord, size 20cm"],
    componentDetails: ["None Not Started", "None Started", "Wrist Support Base Finished", "Wrist Strap Finished"],
  },
  {
    id: "30000",
    type: "Ankle Foot Orthotic",
    componentStatus: "2/0/0",
    digStatus: "Internally Approved",
    physStatus: "Insufficient Blueprints",
    printBy: "2025-10-08",
    shipBy: "2025-10-10",
    parts: ["Upper Strap, size L", "Lower Strap, size M", "Ankle Padding, size 15cm"],
    componentDetails: ["Anterior Shell Not Started", "Posterior Shell Not Started", "None Finished"],
  },
  {
    id: "30001",
    type: "AC Joint Pad",
    componentStatus: "0/1/1",
    digStatus: "Submitted",
    physStatus: "Started",
    printBy: "2025-10-09",
    shipBy: "2025-10-11",
    parts: ["Shoulder Strap, size XL", "Padding Insert, size 8cm"],
    componentDetails: ["None Not Started", "AC Joint Pad Started", "AC Joint Base Finished"],
  },
  {
    id: "30003",
    type: "Ringed Thumb Splint",
    componentStatus: "1/1/0",
    digStatus: "Assigned",
    physStatus: "Sufficient Blueprints",
    printBy: "-",
    shipBy: "2025-10-12",
    parts: ["Thumb Strap, size S", "Support String, size 28cm"],
    componentDetails: ["Thumb Ring Not Started", "Thumb Base Started", "None Finished"],
  },
];

export default function ProductTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpened, setModalOpened] = useState(false);

  const [filters, setFilters] = useState<FilterState>({ prodType: [], digStatus: [], physStatus: [] });
  const [pendingFilters, setPendingFilters] = useState<FilterState>({ prodType: [], digStatus: [], physStatus: [] });

  const [configName, setConfigName] = useState("");
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const filteredProducts = productData.filter((prod) => {
    const matchesProdType = filters.prodType.length === 0 || filters.prodType.includes(prod.type);
    const matchesDigStatus = filters.digStatus.length === 0 || filters.digStatus.includes(prod.digStatus);
    const matchesPhysStatus = filters.physStatus.length === 0 || filters.physStatus.includes(prod.physStatus);
    return matchesProdType && matchesDigStatus && matchesPhysStatus;
  });

  const clearFilters = () => {
    setFilters({ prodType: [], digStatus: [], physStatus: [] });
    setPendingFilters({ prodType: [], digStatus: [], physStatus: [] });
    setConfigName("");
    setSelectedConfig(null);
  };

  const applyFilters = () => {
    const newFilters = {
      prodType: [...pendingFilters.prodType],
      digStatus: [...pendingFilters.digStatus],
      physStatus: [...pendingFilters.physStatus],
    };
    setFilters(newFilters);

    if (configName.trim()) {
      setSavedConfigs((prev) => {
        const existing = prev.find((c) => c.name === configName.trim());
        if (existing) {
          return prev.map((c) => (c.name === configName.trim() ? { ...c, filters: newFilters } : c));
        } else {
          return [...prev, { name: configName.trim(), filters: newFilters }];
        }
      });
    }

    setModalOpened(false);
  };

  const loadConfiguration = (name: string | null) => {
    setSelectedConfig(name);
    if (!name) return;
    const found = savedConfigs.find((c) => c.name === name);
    if (found) {
      setPendingFilters({
        prodType: [...found.filters.prodType],
        digStatus: [...found.filters.digStatus],
        physStatus: [...found.filters.physStatus],
      });
      setConfigName(found.name);
    }
  };

  return (
    <Box p="md">
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Title order={3}>Product Table</Title>
        <Group>
          {savedConfigs.length > 0 && (
            <Select
              data={savedConfigs.map((c) => c.name)}
              placeholder="Select Configuration"
              value={selectedConfig}
              onChange={loadConfiguration}
              size="xs"
              radius="sm"
              comboboxProps={{ withinPortal: false }}
            />
          )}
          <Button size="sm" onClick={() => setModalOpened(true)}>
            Configure Filters
          </Button>
        </Group>
      </Group>

      {/* TABLE */}
      <ScrollArea type="always" scrollbarSize={10}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Prod ID</Table.Th>
              <Table.Th>Prod Type</Table.Th>
              <Table.Th>Component Status</Table.Th>
              <Table.Th>Dig Prod Status</Table.Th>
              <Table.Th>Phys Prod Status</Table.Th>
              <Table.Th>Print By Date</Table.Th>
              <Table.Th>Ship By Date</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredProducts.map((prod) => (
              <Table.Tr key={prod.id}>
                <Table.Td>
                  <Checkbox checked={selected.includes(prod.id)} onChange={() => toggleSelect(prod.id)} />
                </Table.Td>

                <Table.Td>{prod.id}</Table.Td>

                {/* Tooltip for Product Type */}
                <Table.Td>
                  <Tooltip
                    label={<Box>{prod.parts.map((p, idx) => <div key={idx}>{p}</div>)}</Box>}
                    withArrow
                    multiline
                    transitionProps={{ transition: "pop", duration: 150 }}
                  >
                    <span style={{ cursor: "help" }}>{prod.type}</span>
                  </Tooltip>
                </Table.Td>

                {/* Tooltip for Component Status */}
                <Table.Td>
                  <Tooltip
                    label={<Box>{prod.componentDetails.map((detail, idx) => <div key={idx}>{detail}</div>)}</Box>}
                    withArrow
                    multiline
                    transitionProps={{ transition: "pop", duration: 150 }}
                  >
                    <span style={{ cursor: "help" }}>{prod.componentStatus}</span>
                  </Tooltip>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={
                      prod.digStatus === "Internally Approved"
                        ? "green"
                        : prod.digStatus === "Submitted"
                        ? "blue"
                        : "gray"
                    }
                    variant="light"
                  >
                    {prod.digStatus}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={
                      prod.physStatus.includes("Approved")
                        ? "teal"
                        : prod.physStatus.includes("Blueprints")
                        ? "orange"
                        : prod.physStatus === "Started"
                        ? "blue"
                        : "gray"
                    }
                    variant="light"
                  >
                    {prod.physStatus}
                  </Badge>
                </Table.Td>

                <Table.Td>{prod.printBy}</Table.Td>
                <Table.Td>{prod.shipBy}</Table.Td>
              </Table.Tr>
            ))}

            {filteredProducts.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={8} style={{ textAlign: "center" }}>
                  No products match your filters.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Configurations */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create or Load Configuration"
        size="lg"
        centered
        zIndex={500}
      >
        <ScrollArea h={420}>
          <Box p="md">
            <Divider mb="md" />
            {savedConfigs.length > 0 && (
              <Select
                label="Saved Configurations"
                placeholder="Select a configuration to load"
                data={savedConfigs.map((c) => c.name)}
                value={selectedConfig}
                onChange={loadConfiguration}
                size="xs"
                radius="sm"
                mb="md"
                comboboxProps={{ withinPortal: false }}
              />
            )}

            <TextInput
              label="Configuration Name"
              placeholder="Enter or update configuration name"
              size="sm"
              radius="sm"
              mb="sm"
              value={configName}
              onChange={(e) => setConfigName(e.currentTarget.value)}
            />

            <Group grow align="flex-end" gap="lg" wrap="wrap" mb="lg">
              <MultiSelect
                label="Prod Type"
                data={["Wrist Flex", "Ankle Foot Orthotic", "AC Joint Pad", "Ringed Thumb Splint"]}
                placeholder="Select Product Types"
                size="xs"
                radius="sm"
                w={220}
                maxDropdownHeight={160}
                value={pendingFilters.prodType}
                onChange={(values) => setPendingFilters((prev) => ({ ...prev, prodType: [...values] }))}
                comboboxProps={{ withinPortal: false }}
              />

              <MultiSelect
                label="Digital Product Status"
                data={["Internally Approved", "Submitted", "Assigned"]}
                placeholder="Select Digital Statuses"
                size="xs"
                radius="sm"
                w={220}
                maxDropdownHeight={160}
                value={pendingFilters.digStatus}
                onChange={(values) => setPendingFilters((prev) => ({ ...prev, digStatus: [...values] }))}
                comboboxProps={{ withinPortal: false }}
              />

              <MultiSelect
                label="Physical Product Status"
                data={["Quality Approved", "Insufficient Blueprints", "Started", "Sufficient Blueprints"]}
                placeholder="Select Physical Statuses"
                size="xs"
                radius="sm"
                w={220}
                maxDropdownHeight={160}
                value={pendingFilters.physStatus}
                onChange={(values) => setPendingFilters((prev) => ({ ...prev, physStatus: [...values] }))}
                comboboxProps={{ withinPortal: false }}
              />
            </Group>

            <Group justify="flex-end" gap="sm" mt="lg">
              <Button variant="outline" size="sm" color="gray" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button size="sm" color="blue" onClick={applyFilters}>
                Apply Filters
              </Button>
            </Group>
          </Box>
        </ScrollArea>
      </Modal>
    </Box>
  );
}

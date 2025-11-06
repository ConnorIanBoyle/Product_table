// src/styles/theme.ts
import { createTheme, MantineTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, sans-serif",

  components: {
    Table: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius.md,
          overflow: "hidden",
          border: `1px solid ${theme.colors.gray[3]}`,
          boxShadow: theme.shadows.sm,
        },
        th: {
          backgroundColor: theme.colors.gray[0],
          fontWeight: 600,
          color: theme.colors.gray[7],
          textTransform: "uppercase",
          fontSize: theme.fontSizes.xs,
          letterSpacing: "0.05em",
        },
        td: {
          fontSize: theme.fontSizes.sm,
          color: theme.colors.gray[8],
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        },
      }),
    },
  },
});

export default theme;

export const btnRadius = 999; // pill-like

export const btnContainedAccent = {
  textTransform: "none",
  borderRadius: btnRadius,
  bgcolor: "rgba(0,194,255,0.25)",
  color: "#001018",
  border: "1px solid var(--accent)",
  boxShadow: "0 0 24px rgba(0,194,255,0.25) inset",
  px: 1.75,
  "&:hover": { bgcolor: "rgba(0,194,255,0.35)", borderColor: "var(--accent)" },
  "&.Mui-disabled": {
    bgcolor: "rgba(255,255,255,0.06)",
    borderColor: "var(--card-border)",
    color: "#9aa4b2",
    boxShadow: "none",
  },
};

export const btnOutlinedAccent = {
  textTransform: "none",
  borderRadius: btnRadius,
  color: "var(--text)",
  border: "1px solid var(--accent)",
  bgcolor: "rgba(255,255,255,0.04)",
  px: 1.75,
  "&:hover": { bgcolor: "rgba(0,194,255,0.10)", borderColor: "var(--accent)" },
  "&.Mui-disabled": {
    borderColor: "var(--card-border)",
    color: "#9aa4b2",
  },
};

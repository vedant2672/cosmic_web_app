import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        borderTop: "1px solid var(--card-border)",
        background:
          "linear-gradient(180deg, rgba(10,14,26,0.55) 0%, rgba(10,14,26,0.85) 100%)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "var(--text)", opacity: 0.9 }}
        >
          Developed by Vedant Singh
        </Typography>
      </Container>
    </Box>
  );
}

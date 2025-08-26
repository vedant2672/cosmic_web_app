import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ py: 4 }}
    >
      <CircularProgress />
    </Box>
  );
}

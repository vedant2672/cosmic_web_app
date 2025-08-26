import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { btnContainedAccent, btnOutlinedAccent } from "../styles/buttons";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ onCompareClick, selectionsCount }) {
  const { user, signIn, signOut } = useAuth();

  return (
    <AppBar
      position="sticky"
      sx={{
        background:
          "linear-gradient(180deg, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.55) 100%)",
        borderBottom: "1px solid var(--card-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar>
        <IconButton color="inherit" component={RouterLink} to="/">
          <TravelExploreIcon />
        </IconButton>
        <Typography
          variant="h6"
          className="space-heading"
          sx={{ flexGrow: 1, color: "var(--text)" }}
        >
          Cosmic Event Tracker
        </Typography>
        <Box display="flex" alignItems="center" gap={1.25}>
          <Button
            size="small"
            variant="contained"
            startIcon={<HomeRoundedIcon />}
            component={RouterLink}
            to="/"
            sx={btnContainedAccent}
          >
            Home
          </Button>
          <Button
            size="small"
            variant="contained"
            component={RouterLink}
            to="/compare"
            disabled={!selectionsCount}
            sx={btnContainedAccent}
          >
            Compare{selectionsCount ? ` (${selectionsCount})` : ""}
          </Button>
        </Box>
        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...btnOutlinedAccent, pointerEvents: 'none' }}
              aria-disabled="true"
            >
              Logged in
            </Button>
            <Button
              size="small"
              onClick={signOut}
              variant="outlined"
              sx={btnOutlinedAccent}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            size="small"
            onClick={signIn}
            disabled={!signIn}
            variant="outlined"
            sx={btnOutlinedAccent}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import { formatReadableDateTime } from "../utils/date";
import { fetchNeoDetails } from "../services/nasaApi";
import { btnContainedAccent, btnOutlinedAccent } from "../styles/buttons";

export default function EventDetailDialog({ open, onClose, neo }) {
  const [orbital, setOrbital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!neo) return null;
  const cad = neo.close_approach_data?.[0];
  const km = neo.estimated_diameter?.kilometers;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        },
      }}
    >
      <DialogTitle className="space-heading">{neo.name}</DialogTitle>
      <DialogContent dividers sx={{ borderColor: "var(--card-border)" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2" sx={{ mb: 1 }}>
          ID: {neo.id}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Potentially Hazardous:{" "}
          {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
        </Typography>
        {km && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Diameter (km): {km.estimated_diameter_min.toFixed(3)} -{" "}
            {km.estimated_diameter_max.toFixed(3)}
          </Typography>
        )}
        {cad && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Close Approach
            </Typography>
            <Typography variant="body2">
              Date:{" "}
              {cad.close_approach_date_full
                ? formatReadableDateTime(cad.close_approach_date_full)
                : formatReadableDateTime(cad.close_approach_date)}
            </Typography>
            <Typography variant="body2">
              Miss distance (km):{" "}
              {Number(cad.miss_distance?.kilometers ?? NaN).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              Relative velocity (km/s):{" "}
              {Number(
                cad.relative_velocity?.kilometers_per_second ?? NaN
              ).toFixed(3)}
            </Typography>
            <Typography variant="body2">
              Orbiting body: {cad.orbiting_body}
            </Typography>
          </>
        )}
        {neo.nasa_jpl_url && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            JPL URL:{" "}
            <Link href={neo.nasa_jpl_url} target="_blank" rel="noreferrer">
              {neo.nasa_jpl_url}
            </Link>
          </Typography>
        )}

        {orbital && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Orbital Data
            </Typography>
            <Typography variant="body2">
              Orbit ID: {orbital.orbit_id}
            </Typography>
            <Typography variant="body2">
              Orbit Determination Date: {orbital.orbit_determination_date}
            </Typography>
            <Typography variant="body2">
              First Observation: {orbital.first_observation_date}
            </Typography>
            <Typography variant="body2">
              Last Observation: {orbital.last_observation_date}
            </Typography>
            <Typography variant="body2">
              Eccentricity: {orbital.eccentricity}
            </Typography>
            <Typography variant="body2">
              Semi-major axis (AU): {orbital.semi_major_axis}
            </Typography>
            <Typography variant="body2">
              Inclination: {orbital.inclination}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid var(--card-border)" }}>
        <Button
          variant="contained"
          sx={btnContainedAccent}
          onClick={async () => {
            try {
              setError(null);
              setLoading(true);
              const d = await fetchNeoDetails(neo.neo_reference_id || neo.id);
              setOrbital(d.orbital_data || null);
            } catch (e) {
              setError(e.message || String(e));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading
            ? "Loading…"
            : orbital
            ? "Reload Orbital Data"
            : "Load Orbital Data"}
        </Button>
        <Button variant="outlined" sx={btnOutlinedAccent} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

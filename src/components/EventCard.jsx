import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SpeedIcon from "@mui/icons-material/Speed";
import StraightenIcon from "@mui/icons-material/Straighten";
import { averageKmDiameter, closestApproach } from "../services/nasaApi";
import { formatReadableDate } from "../utils/date";

export default function EventCard({ neo, selected, onSelect, onOpen }) {
  const avg = averageKmDiameter(neo);
  const cad = closestApproach(neo);
  const hazardous = neo.is_potentially_hazardous_asteroid;

  return (
    <Card
      variant="outlined"
      className="glass-card"
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        borderLeft: hazardous
          ? "4px solid var(--danger)"
          : "4px solid var(--success)",
        border: "1px solid var(--card-border)",
        color: "#FFFFFF",
        backdropFilter: "blur(10px)",
        backgroundImage:
          'linear-gradient(180deg, rgba(8,12,20,0.60), rgba(8,12,20,0.35)), url("/card__background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundClip: "padding-box",
        borderRadius: 3,
        height: 340,
        minHeight: 320,
        display: "flex",
        transition:
          "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 180ms ease, backdrop-filter 180ms ease",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: hazardous
            ? "linear-gradient(100deg, rgba(255,107,107,0.12), transparent 60%)"
            : "linear-gradient(100deg, rgba(34,197,94,0.12), transparent 60%)",
        },
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
        },
        "&:active, &:focus-within": {
          backdropFilter: "blur(12px)",
          backgroundImage:
            'linear-gradient(180deg, rgba(8,12,20,0.80), rgba(8,12,20,0.55)), url("/card__background.jpg")',
        },
        "&:active:before, &:focus-within:before": {
          background: hazardous
            ? "linear-gradient(100deg, rgba(255,107,107,0.20), transparent 60%)"
            : "linear-gradient(100deg, rgba(34,197,94,0.20), transparent 60%)",
        },
      }}
    >
      <CardContent
        onClick={() => onOpen?.(neo)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          width: "100%",
          pt: 1.5,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#EAF2FF",
                mb: 0.5,
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              Near-Earth Object
            </Typography>
            <Typography
              variant="h6"
              className="space-heading"
              sx={{
                lineHeight: 1.2,
                color: "#FFFFFF",
                textShadow: "0 2px 6px rgba(0,0,0,0.55)",
              }}
            >
              {neo.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#EAF2FF",
                mt: 0.5,
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Date: {formatReadableDate(neo.date, { dayOfWeek: true })}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip
              title={hazardous ? "Potentially Hazardous" : "Not Hazardous"}
            >
              <Chip
                icon={hazardous ? <WarningAmberIcon /> : undefined}
                label={hazardous ? "Hazardous" : "Safe"}
                size="small"
                sx={{
                  bgcolor: hazardous
                    ? "rgba(255,107,107,0.25)"
                    : "rgba(34,197,94,0.25)",
                  color: "#FFFFFF",
                  border: "1px solid var(--card-border)",
                  "& .MuiChip-label": {
                    color: "#FFFFFF",
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                  },
                  "& .MuiChip-icon": { color: "#FFFFFF" },
                }}
              />
            </Tooltip>
            <Checkbox
              checked={!!selected}
              onChange={(e) => onSelect?.(neo, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1, borderColor: "var(--card-border)" }} />

        <Box display="flex" flexWrap="wrap" gap={1}>
          <Chip
            icon={<StraightenIcon />}
            label={`Avg diameter: ${avg ? `${avg.toFixed(3)} km` : "N/A"}`}
            sx={{
              bgcolor: "rgba(122,162,255,0.20)",
              color: "#FFFFFF",
              border: "1px solid var(--card-border)",
              "& .MuiChip-label": {
                color: "#FFFFFF",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              },
              "& .MuiChip-icon": { color: "#FFFFFF" },
            }}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<SpeedIcon />}
            label={`Velocity: ${
              cad && isFinite(cad.relativeVelocityKps)
                ? `${cad.relativeVelocityKps.toFixed(3)} km/s`
                : "N/A"
            }`}
            sx={{
              bgcolor: "rgba(0,194,255,0.20)",
              color: "#FFFFFF",
              border: "1px solid var(--card-border)",
              "& .MuiChip-label": {
                color: "#FFFFFF",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              },
              "& .MuiChip-icon": { color: "#FFFFFF" },
            }}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<StraightenIcon />}
            label={`Miss dist: ${
              cad && isFinite(cad.missDistanceKm)
                ? `${cad.missDistanceKm.toLocaleString()} km`
                : "N/A"
            }`}
            sx={{
              bgcolor: "rgba(34,197,94,0.20)",
              color: "#FFFFFF",
              border: "1px solid var(--card-border)",
              "& .MuiChip-label": {
                color: "#FFFFFF",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              },
              "& .MuiChip-icon": { color: "#FFFFFF" },
            }}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

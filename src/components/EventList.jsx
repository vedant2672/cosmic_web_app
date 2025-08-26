import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EventCard from "./EventCard";
import { formatReadableDate } from "../utils/date";

export default function EventList({ grouped, selections, onSelect, onOpen }) {
  const dates = Object.keys(grouped).sort();
  return (
    <Stack spacing={2}>
      {dates.map((date) => (
        <Stack key={date} spacing={1}>
          <Typography
            variant="h6"
            className="space-heading"
            sx={{
              alignSelf: "center",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: 999,
              background:
                "linear-gradient(180deg, rgba(16,22,33,0.65), rgba(16,22,33,0.45))",
              border: "1px solid var(--card-border)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--text)",
              mb: 1.5,
              backdropFilter: "blur(6px)",
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 12px var(--accent)",
              }}
            />
            {formatReadableDate(date, { dayOfWeek: true })}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {grouped[date].map((neo) => (
              <Grid key={neo.id} item xs={12} sm={6} md={6} lg={4} xl={4}>
                <EventCard
                  neo={neo}
                  selected={!!selections[neo.id]}
                  onSelect={onSelect}
                  onOpen={onOpen}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  );
}

import { useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Header from "../components/Header";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { averageKmDiameter, closestApproach } from "../services/nasaApi";

export default function Compare({ selections }) {
  const items = useMemo(
    () => Object.values(selections).filter(Boolean),
    [selections]
  );

  const distanceData = items.map((neo) => {
    const cad = closestApproach(neo);
    return {
      name: neo.name,
      missDistanceKm: cad?.missDistanceKm,
      velocityKps: cad?.relativeVelocityKps,
    };
  });

  const sizeData = items.map((neo) => ({
    name: neo.name,
    avgDiameterKm: averageKmDiameter(neo),
  }));

  const fmt = {
    km: (n) =>
      n == null || isNaN(n) ? "N/A" : `${Math.round(n).toLocaleString()} km`,
    kps: (n) =>
      n == null || isNaN(n) ? "N/A" : `${Number(n).toFixed(2)} km/s`,
    km2: (n) => (n == null || isNaN(n) ? "N/A" : `${Number(n).toFixed(3)} km`),
  };

  const CustomTooltip = ({ active, label, payload, context }) => {
    if (!active || !payload || payload.length === 0) return null;
    const rows = payload.map((p) => {
      const key = p.dataKey;
      const color = p.color || p.stroke || "var(--accent)";
      let value = p.value;
      if (context === "dist-vel") {
        value = key === "missDistanceKm" ? fmt.km(value) : fmt.kps(value);
      } else if (context === "diam") {
        value = fmt.km2(value);
      }
      return { name: p.name, color, value };
    });
    return (
      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 1,
          border: "1px solid var(--card-border)",
          borderRadius: 1,
          background:
            "linear-gradient(180deg, rgba(16,22,33,0.90), rgba(16,22,33,0.75))",
          backdropFilter: "blur(8px)",
          color: "var(--text)",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {rows.map((r) => (
          <Box
            key={r.name}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: r.color,
                boxShadow: `0 0 8px ${r.color}`,
              }}
            />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {r.name}: {r.value}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  };

  const CustomLegend = ({ payload = [] }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        px: 1,
        pb: 1,
        color: "var(--text)",
      }}
    >
      {payload.map((entry) => (
        <Box
          key={entry.value}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: entry.color,
              boxShadow: `0 0 6px ${entry.color}`,
            }}
          />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Header selectionsCount={items.length} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={4}>
          <Typography variant="h5">Compare Selected NEOs</Typography>
          {items.length === 0 && (
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              No selections. Go back and select some NEOs.
            </Typography>
          )}

          {items.length > 0 && (
            <Stack spacing={3}>
              <Typography variant="h6">
                Miss Distance (km) vs Velocity (km/s)
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  pl: 4,
                  border: "1px solid var(--card-border)",
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                  background:
                    "linear-gradient(180deg, rgba(16,22,33,0.70), rgba(16,22,33,0.55))",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Miss Distance vs Velocity
                </Typography>
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart
                    data={distanceData}
                    margin={{ top: 48, right: 16, left: 120, bottom: 8 }}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                      tick={{ fill: "var(--text)", fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="left"
                      width={90}
                      tick={{ fill: "var(--text)", fontSize: 12 }}
                      label={{
                        value: "Distance (km)",
                        angle: -90,
                        position: "left",
                        offset: 10,
                        fill: "var(--text)",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      width={80}
                      tick={{ fill: "var(--text)", fontSize: 12 }}
                      label={{
                        value: "Velocity (km/s)",
                        angle: 90,
                        position: "right",
                        offset: 10,
                        fill: "var(--text)",
                      }}
                    />
                    <Tooltip content={<CustomTooltip context="dist-vel" />} />
                    <Legend
                      verticalAlign="top"
                      align="center"
                      content={<CustomLegend />}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="missDistanceKm"
                      name="Miss Distance (km)"
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 0,
                        fill: "var(--accent)",
                      }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="velocityKps"
                      name="Velocity (km/s)"
                      stroke="var(--danger)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 0,
                        fill: "var(--danger)",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  border: "1px solid var(--card-border)",
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                  background:
                    "linear-gradient(180deg, rgba(16,22,33,0.70), rgba(16,22,33,0.55))",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Average Diameter
                </Typography>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart
                    data={sizeData}
                    margin={{ top: 48, right: 16, left: 24, bottom: 8 }}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                      tick={{ fill: "var(--text)", fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: "var(--text)", fontSize: 12 }}
                      label={{
                        value: "Diameter (km)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "var(--text)",
                      }}
                    />
                    <Tooltip content={<CustomTooltip context="diam" />} />
                    <Legend
                      verticalAlign="top"
                      align="center"
                      content={<CustomLegend />}
                    />
                    <defs>
                      <linearGradient
                        id="diamGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--success)"
                          stopOpacity="0.9"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--success)"
                          stopOpacity="0.45"
                        />
                      </linearGradient>
                    </defs>
                    <Bar
                      dataKey="avgDiameterKm"
                      name="Avg Diameter (km)"
                      fill="url(#diamGradient)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
}

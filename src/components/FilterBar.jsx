import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import RefreshIcon from "@mui/icons-material/Refresh";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SearchIcon from "@mui/icons-material/Search";
import { btnContainedAccent, btnOutlinedAccent } from "../styles/buttons";
import { format } from "date-fns";

export default function FilterBar({
  startDate,
  endDate,
  onDateChange,
  datesDirty,
  onSearch,
  hazardousOnly,
  onHazardousChange,
  onReload,
  onLoadMore,
  onSortChange,
  sortOrder,
}) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  useEffect(() => {
    setStart(startDate);
  }, [startDate]);
  useEffect(() => {
    setEnd(endDate);
  }, [endDate]);

  const toInput = (d) => format(d, "yyyy-MM-dd");

  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      alignItems="center"
      className="glass-card"
      sx={{
        my: 2,
        p: 2,
        overflowX: "visible",
        gap: { xs: 1, sm: 1.5, md: 2 },
        "& > *": { flex: "0 0 auto" },
        justifyContent: "space-between",
        border: "1px solid var(--card-border)",
        borderRadius: 2,
        backdropFilter: "blur(10px)",
        background:
          "linear-gradient(180deg, rgba(16,22,33,0.75), rgba(16,22,33,0.55))",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <TextField
        label="Start Date"
        type="date"
        size="small"
        value={toInput(start)}
        onChange={(e) => {
          const d = new Date(e.target.value);
          setStart(d);
          onDateChange?.(d, end);
        }}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: {
            xs: "clamp(150px, 24vw, 220px)",
            md: "clamp(180px, 20vw, 240px)",
          },
          minWidth: 150,
          flex: "1 1 auto",
          flexShrink: 1,
          "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.06)" },
          "& fieldset": { borderColor: "var(--card-border)" },
          "&:hover fieldset": { borderColor: "var(--accent)" },
          "& .MuiInputLabel-root": { color: "var(--text)" },
        }}
      />
      <TextField
        label="End Date"
        type="date"
        size="small"
        value={toInput(end)}
        onChange={(e) => {
          const d = new Date(e.target.value);
          setEnd(d);
          onDateChange?.(start, d);
        }}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: {
            xs: "clamp(150px, 24vw, 220px)",
            md: "clamp(180px, 20vw, 240px)",
          },
          minWidth: 150,
          flex: "1 1 auto",
          flexShrink: 1,
          "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.06)" },
          "& fieldset": { borderColor: "var(--card-border)" },
          "&:hover fieldset": { borderColor: "var(--accent)" },
          "& .MuiInputLabel-root": { color: "var(--text)" },
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={hazardousOnly}
            onChange={(e) => onHazardousChange?.(e.target.checked)}
            sx={{
              color: "var(--accent)",
              "&.Mui-checked": { color: "var(--accent)" },
            }}
          />
        }
        label="Hazardous only"
        sx={{
          ml: 1,
          px: 1,
          borderRadius: 1,
          "& .MuiFormControlLabel-label": {
            color: "var(--text)",
            whiteSpace: "nowrap",
          },
        }}
      />

      <Divider
        flexItem
        orientation="vertical"
        sx={{ borderColor: "var(--card-border)", mx: 0.5 }}
      />

      <TextField
        select
        label="Sort by approach"
        size="small"
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                bgcolor: "rgba(16,22,33,0.90)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--card-border)",
                "& .MuiMenuItem-root": {
                  color: "var(--text)",
                },
                "& .MuiMenuItem-root.Mui-selected": {
                  bgcolor: "rgba(0,194,255,0.15)",
                },
                "& .MuiMenuItem-root:hover": {
                  bgcolor: "rgba(0,194,255,0.10)",
                },
              },
            },
          },
        }}
        value={sortOrder}
        onChange={(e) => onSortChange?.(e.target.value)}
        sx={{
          width: {
            xs: "clamp(170px, 26vw, 240px)",
            md: "clamp(200px, 22vw, 260px)",
          },
          minWidth: 170,
          flex: "1 1 auto",
          flexShrink: 1,
          "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.06)" },
          "& fieldset": { borderColor: "var(--card-border)" },
          "&:hover fieldset": { borderColor: "var(--accent)" },
          "& .MuiInputLabel-root": { color: "var(--text)" },
          "& .MuiSelect-select": { color: "var(--text)" },
          "& .MuiSvgIcon-root": { color: "var(--text)" },
        }}
      >
        <MenuItem value="asc">Ascending</MenuItem>
        <MenuItem value="desc">Descending</MenuItem>
      </TextField>

      {datesDirty && (
        <Button
          size="small"
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={btnContainedAccent}
        >
          Search
        </Button>
      )}

      <Button
        size="small"
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onReload}
        sx={btnOutlinedAccent}
      >
        Reload
      </Button>
      <Button
        size="small"
        variant="contained"
        startIcon={<RocketLaunchIcon />}
        onClick={onLoadMore}
        sx={btnContainedAccent}
      >
        Load More
      </Button>
    </Box>
  );
}

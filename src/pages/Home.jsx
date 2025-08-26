import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import EventList from "../components/EventList";
import EventDetailDialog from "../components/EventDetailDialog";
import { addDays, fetchNeoFeed, flattenNeoFeed } from "../services/nasaApi";

export default function Home({ selections, setSelections }) {
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => addDays(new Date(), 3));
  const [loadedStart, setLoadedStart] = useState(null);
  const [loadedEnd, setLoadedEnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [list, setList] = useState([]);
  const [hazardousOnly, setHazardousOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openNeo, setOpenNeo] = useState(null);

  const load = useCallback(
    async (s = startDate, e = endDate) => {
      // Fetch in chunks of max 7 days to respect API constraints
      const maxDays = 7;
      setLoading(true);
      setError(null);
      try {
        const acc = [];
        let cur = new Date(s);
        const end = new Date(e);
        while (cur <= end) {
          const chunkEnd = new Date(Math.min(addDays(cur, maxDays - 1), end));
          const data = await fetchNeoFeed({
            startDate: cur,
            endDate: chunkEnd,
          });
          acc.push(...flattenNeoFeed(data));
          cur = addDays(chunkEnd, 1);
        }
        setList(acc);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
        setLoadedStart(new Date(s));
        setLoadedEnd(new Date(e));
      }
    },
    [startDate, endDate]
  );

  useEffect(() => {
    load();
  }, []); // initial

  const grouped = useMemo(() => {
    const filtered = list.filter(
      (neo) => !hazardousOnly || neo.is_potentially_hazardous_asteroid
    );
    const sorted = filtered.sort((a, b) => {
      const da = a.close_approach_data?.[0]?.epoch_date_close_approach ?? 0;
      const db = b.close_approach_data?.[0]?.epoch_date_close_approach ?? 0;
      return sortOrder === "asc" ? da - db : db - da;
    });
    return sorted.reduce((acc, neo) => {
      const key = neo.date;
      acc[key] = acc[key] || [];
      acc[key].push(neo);
      return acc;
    }, {});
  }, [list, hazardousOnly, sortOrder]);

  const onDateChange = (s, e) => {
    setStartDate(s);
    setEndDate(e);
  };
  const onReload = () => {
    // Reset selections on reload to satisfy UX expectation
    setSelections({});
    load(startDate, endDate);
  };
  const onLoadMore = async () => {
    // Append next 3 days without refetching the whole range
    const chunkStart = addDays(endDate, 1);
    const chunkEnd = addDays(endDate, 3);
    try {
      setLoading(true);
      const data = await fetchNeoFeed({
        startDate: chunkStart,
        endDate: chunkEnd,
      });
      const more = flattenNeoFeed(data);
      setList((prev) => [...prev, ...more]);
      setEndDate(chunkEnd);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (neo, checked) => {
    setSelections((prev) => ({ ...prev, [neo.id]: checked ? neo : undefined }));
  };

  const sameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const datesDirty =
    !sameDay(startDate, loadedStart) || !sameDay(endDate, loadedEnd);

  return (
    <>
      <Header
        selectionsCount={Object.values(selections).filter(Boolean).length}
      />
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 4, md: 6 } }}>
        <FilterBar
          startDate={startDate}
          endDate={endDate}
          onDateChange={onDateChange}
          datesDirty={datesDirty}
          onSearch={() => load(startDate, endDate)}
          hazardousOnly={hazardousOnly}
          onHazardousChange={setHazardousOnly}
          onReload={onReload}
          onLoadMore={onLoadMore}
          onSortChange={setSortOrder}
          sortOrder={sortOrder}
        />
        {loading && <LoadingSpinner />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <Stack spacing={2}>
            <EventList
              grouped={grouped}
              selections={selections}
              onSelect={onSelect}
              onOpen={setOpenNeo}
            />
          </Stack>
        )}
      </Container>
      <EventDetailDialog
        open={!!openNeo}
        onClose={() => setOpenNeo(null)}
        neo={openNeo}
      />
    </>
  );
}

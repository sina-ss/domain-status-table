import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import SearchComponent from "./SearchComponent";
import SortDialog from "./SortDialog";
import FilterDialog from "./FilterDiolog";

const DEFAULT_STATUSES = ["ADDED", "NOT_ADDED", "BUG", "DISORDER"];

interface Log {
  id: number;
  date_original: string;
  domain: string;
  status: string;
  description: string;
  standard_date: string;
}

const LogsTable = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [orderBy, setOrderBy] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState<boolean>(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>(DEFAULT_STATUSES);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4000/logs", {
        params: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          search,
          orderBy: orderBy?.field,
          orderDirection: orderBy?.direction,
          statuses: selectedStatuses.join(","),
        },
      });
      setLogs(response.data.logs);
      setTotalLogs(response.data.total);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, [page, rowsPerPage, search, orderBy, selectedStatuses]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchChange = (value: string) => setSearch(value);
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const toggleSortDialog = (value: boolean) => setIsSortDialogOpen(value);
  const toggleFilterDialog = (value: boolean) => setIsFilterDialogOpen(value);
  const setSortingOrder = (field: string, direction: "asc" | "desc") =>
    setOrderBy({ field, direction });

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        marginTop="max(1rem, 5%)"
      >
        Poliver
      </Typography>
      <Box
        display="flex"
        flexDirection="row-reverse"
        gap="2rem"
        marginBottom="1rem"
      >
        <SearchComponent
          search={search}
          handleSearch={(e) => handleSearchChange(e.target.value)}
        />

        <Button
          startIcon={<FilterAltOutlinedIcon />}
          onClick={() => toggleFilterDialog(true)}
          sx={{
            backgroundColor: "#212123",
            paddingX: "1.5rem",
            borderRadius: "1.5rem",
          }}
        >
          Filter
        </Button>
        <Button
          startIcon={<ImportExportOutlinedIcon />}
          onClick={() => toggleSortDialog(true)}
          sx={{
            backgroundColor: "#212123",
            paddingX: "1.5rem",
            borderRadius: "1.5rem",
          }}
        >
          Sort
        </Button>
        <TablePagination
          component="div"
          count={totalLogs}
          page={page}
          onPageChange={(_, newPage) => handlePageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            handleRowsPerPageChange(parseInt(e.target.value, 10))
          }
        />
      </Box>
      <Table sx={{ borderRadius: "2rem", overflow: "hidden" }}>
        <TableHead sx={{ backgroundColor: "#90290A" }}>
          <TableRow>
            {[
              "Date Original",
              "Domain",
              "Status",
              "Description",
              "Standard Date",
            ].map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id + log.domain}>
              <TableCell>{log.date_original}</TableCell>
              <TableCell
                sx={{
                  maxWidth: 200,
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {log.domain}
              </TableCell>
              <TableCell>{log.status}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.standard_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FilterDialog
        open={isFilterDialogOpen}
        handleClose={() => toggleFilterDialog(false)}
        selectedStatuses={selectedStatuses}
        handleStatusChange={handleStatusChange}
      />
      <SortDialog
        open={isSortDialogOpen}
        handleClose={() => toggleSortDialog(false)}
        handleSort={setSortingOrder}
      />
    </Container>
  );
};

export default React.memo(LogsTable);

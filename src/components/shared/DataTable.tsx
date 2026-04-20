import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
  Edit,
  Eye,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  filterable?: boolean;
  pageSize?: number;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  isLoading?: boolean;
  extraActions?: (row: any) => React.ReactNode;
}

const getStatusStyle = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "active":
    case "completed":
    case "confirmed":
    case "approved":
    case "verified":
    case "success":
    case "published":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
    case "review":
    case "upcoming":
    case "draft":
    case "planning":
    case "on_hold":
    case "process":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "inactive":
    case "cancelled":
    case "rejected":
    case "suspended":
    case "disabled":
    case "deleted":
    case "out_of_stock":
    case "refunded":
    case "destructive":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

export function DataTable({
  columns,
  data,
  onRowClick,
  searchable = true,
  filterable = true,
  pageSize = 10,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  extraActions,
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const statuses = useMemo(() => {
    const s = new Set<string>();
    data.forEach((row) => row.status && s.add(row.status));
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((row) => row.status === statusFilter);
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortKey] ?? "");
        const bVal = String(b[sortKey] ?? "");
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [data, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {searchable && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-9 h-9 bg-muted/50 border-0 rounded-lg"
              />
            </div>
          )}
          {filterable && statuses.length > 0 && (
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-36 h-9 bg-muted/50 border-0 rounded-lg">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/30">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-xs font-semibold uppercase text-muted-foreground tracking-wider"
                >
                  {col.sortable !== false ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full max-w-[150px]" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-12 text-muted-foreground"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={`transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
                      {col.render ? (
                        col.render(row[col.key], row)
                      ) : col.key === "status" ? (
                        <Badge
                          variant="outline"
                          className={`text-[10px] min-w-[75px] justify-center capitalize font-medium ${getStatusStyle(row[col.key])}`}
                        >
                          {row[col.key]}
                        </Badge>
                      ) : (
                        row[col.key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => onView(row)}
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => onEdit(row)}
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive"
                            onClick={() => onDelete(row)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        )}
                        {extraActions && extraActions(row)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * pageSize + 1}–
            {Math.min((page + 1) * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button
                key={i}
                variant={page === i ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 rounded-lg text-xs"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

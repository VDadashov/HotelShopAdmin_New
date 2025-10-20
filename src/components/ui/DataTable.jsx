import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from "lucide-react";
import { ArrowUpDown, Table as TableIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

// Custom filter function
export const customFilter = (rows, id, filterValue) => {
  return rows.filter(row => {
    const item = row.original;
    const searchTerm = filterValue.toLowerCase();
    // Title-da axtar
    const titleMatch = item.title && typeof item.title === 'object' && Object.values(item.title).some(val =>
      val && val.toLowerCase().includes(searchTerm)
    );
    // Description-da axtar
    const descMatch = item.description && typeof item.description === 'object' && Object.values(item.description).some(val =>
      val && val.toLowerCase().includes(searchTerm)
    );
    // Categories-də axtar
    const catMatch = item.categories && item.categories.some(cat =>
      cat.title && typeof cat.title === 'object' && Object.values(cat.title).some(val =>
        val && val.toLowerCase().includes(searchTerm)
      )
    );
    return titleMatch || descMatch || catMatch;
  });
};

export function DataTable({ 
  columns, 
  data, 
  filterKey = null, 
  filterPlaceholder = "Filter...", 
  tableClassName = "", 
  rowClassName = () => "", 
  headerClassName = "", 
  filterFn = null,
  searchValue,
  onSearchChange,
  onFiltersChange,
  filters,
  categories = [],
  products = []
}) {
  const { t, i18n } = useTranslation();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState(searchValue || "");
  const [showFilters, setShowFilters] = React.useState(false);

  // External search value dəyişəndə internal state-i yenilə
  React.useEffect(() => {
    if (searchValue !== undefined) {
      setGlobalFilter(searchValue);
    }
  }, [searchValue]);

  const handleSearchChange = (value) => {
    setGlobalFilter(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    filterFns: filterFn ? { custom: filterFn } : undefined,
    globalFilterFn: filterFn ? filterFn : undefined,
  });

  // Debug: Log table data
  console.log("DataTable - Raw data:", data);
  console.log("DataTable - Table rows:", table.getRowModel().rows);
  console.log("DataTable - Filtered rows:", table.getFilteredRowModel().rows);

  return (
    <div className="w-full">
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center py-4 gap-2">
        {filterKey && (
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter ?? ""}
            onChange={e => handleSearchChange(e.target.value)}
            className="max-w-sm w-full sm:w-auto"
          />
        )}
        
        {/* Filter Toggle Button */}
        {onFiltersChange && filters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? t('common.hideFilters') : t('common.showFilters')}
          </Button>
        )}

        {/* Filters */}
        {onFiltersChange && filters && showFilters && (
          <div className="absolute top-full left-0 right-0 z-50 flex flex-wrap items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-lg border shadow-lg mt-2">
            {/* Category Filter - Only show if categories are provided */}
            {categories && categories.length > 0 && (
              <Select
                value={filters.categoryId ? String(filters.categoryId) : "all"}
                onValueChange={(value) => {
                  const newFilters = { ...filters, categoryId: value === "all" ? null : Number(value) };
                  onFiltersChange(newFilters);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('products.filterByCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('products.allCategories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name?.[i18n.language] || category.name?.az || category.name?.en || category.name?.ru || `Category ${category.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Status Filter */}
            <Select
              value={filters.isActive !== null ? String(filters.isActive) : "all"}
              onValueChange={(value) => {
                const newFilters = { ...filters, isActive: value === "all" ? null : value === "true" };
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="true">{t('common.active')}</SelectItem>
                <SelectItem value="false">{t('common.inactive')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Product Filter - Only show if products are provided */}
            {products && products.length > 0 && (
              <Select
                value={filters.productId ? String(filters.productId) : "all"}
                onValueChange={(value) => {
                  const newFilters = { ...filters, productId: value === "all" ? null : Number(value) };
                  onFiltersChange(newFilters);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('promos.filterByProduct')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('promos.allProducts')}</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name?.[i18n.language] || product.name?.az || product.name?.en || product.name?.ru || `Product ${product.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Current Filter - Only show if current is in filters */}
            {filters.hasOwnProperty('current') && (
              <Select
                value={filters.current !== null ? String(filters.current) : "all"}
                onValueChange={(value) => {
                  const newFilters = { ...filters, current: value === "all" ? null : value === "true" };
                  onFiltersChange(newFilters);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t('promos.currentPromos')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="true">{t('promos.current')}</SelectItem>
                  <SelectItem value="false">{t('promos.notCurrent')}</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Date Range Filters - Only show if date filters are in filters */}
            {filters.hasOwnProperty('startDateFrom') && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  placeholder={t('promos.startDateFrom')}
                  value={filters.startDateFrom || ""}
                  onChange={(e) => {
                    const newFilters = { ...filters, startDateFrom: e.target.value };
                    onFiltersChange(newFilters);
                  }}
                  className="w-[150px]"
                />
                <Input
                  type="date"
                  placeholder={t('promos.startDateTo')}
                  value={filters.startDateTo || ""}
                  onChange={(e) => {
                    const newFilters = { ...filters, startDateTo: e.target.value };
                    onFiltersChange(newFilters);
                  }}
                  className="w-[150px]"
                />
              </div>
            )}

            {/* Min Rating Filter - Only show if minRating is in filters */}
            {filters.hasOwnProperty('minRating') && (
              <Select
                value={filters.minRating !== null ? String(filters.minRating) : "all"}
                onValueChange={(value) => {
                  const newFilters = { ...filters, minRating: value === "all" ? null : Number(value) };
                  onFiltersChange(newFilters);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t('testimonials.minRating')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('testimonials.allRatings')}</SelectItem>
                  <SelectItem value="1">1+ ⭐</SelectItem>
                  <SelectItem value="2">2+ ⭐⭐</SelectItem>
                  <SelectItem value="3">3+ ⭐⭐⭐</SelectItem>
                  <SelectItem value="4">4+ ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Sort Filter - Only show if sort is in filters */}
            {filters.hasOwnProperty('sort') && (
              <Select
                value={filters.sort || "newest"}
                onValueChange={(value) => {
                  const newFilters = { ...filters, sort: value };
                  onFiltersChange(newFilters);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t('common.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('common.newest')}</SelectItem>
                  <SelectItem value="oldest">{t('common.oldest')}</SelectItem>
                  <SelectItem value="title-az">{t('common.titleAZ')}</SelectItem>
                  <SelectItem value="title-za">{t('common.titleZA')}</SelectItem>
                  <SelectItem value="start-date-asc">{t('promos.startDateAsc')}</SelectItem>
                  <SelectItem value="start-date-desc">{t('promos.startDateDesc')}</SelectItem>
                  <SelectItem value="end-date-asc">{t('promos.endDateAsc')}</SelectItem>
                  <SelectItem value="end-date-desc">{t('promos.endDateDesc')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2 ml-auto">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t('table.rowsPerPage')}</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="outline">
              {t('table.columns')} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
             {table.getAllColumns().filter(col => col.getCanHide()).map(col => {
               // Sütun adını çevirmək üçün funksiya
               const getColumnLabel = (columnId) => {
                 switch (columnId) {
                   case 'title':
                   case 'name':
                     return t('common.name');
                   case 'description':
                     return t('common.description');
                   case 'image':
                   case 'mainImage':
                     return t('common.image');
                   case 'categories':
                     return t('common.categories');
                   case 'category':
                     return t('common.category');
                   case 'company':
                     return t('common.company');
                   case 'actions':
                     return t('common.actions');
                   case 'isRead':
                     return t('common.read');
                   case 'createdAt':
                     return t('common.createdAt');
                   case 'galleryCategory':
                     return t('galleryCategory.title');
                   case 'email':
                     return t('common.email');
                   case 'phone':
                     return t('common.phone');
                   case 'subject':
                     return t('common.subject');
                   case 'message':
                     return t('common.message');
                   case 'logo':
                     return t('common.image');
                   case 'pdf':
                     return t('common.file');
                   case 'imageList':
                     return t('common.images');
                   default:
                     return columnId;
                 }
               };
               
               return (
                 <DropdownMenuCheckboxItem
                   key={col.id}
                   className="capitalize"
                   checked={col.getIsVisible()}
                   onCheckedChange={val => col.toggleVisibility(!!val)}
                 >
                   {getColumnLabel(col.id)}
                 </DropdownMenuCheckboxItem>
               );
             })}
           </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
      <div className="rounded-md border overflow-x-auto w-full">
        <div className="min-w-full w-[300px]">
        <Table className={"bg-background dark:bg-[#181818] " + tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className={"bg-muted dark:bg-[#232323] border-b border-border rounded-t-lg " + headerClassName}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={
                      "custom-table-header align-bottom select-none cursor-pointer text-left font-bold text-base px-4 py-3 bg-muted dark:bg-[#232323] border-b border-border first:rounded-tl-lg last:rounded-tr-lg transition-colors group text-foreground"
                    }
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="flex items-center gap-1 group-hover:text-foreground dark:group-hover:text-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow 
                key={row.id} 
                data-state={row.getIsSelected() && "selected"} 
                className={
                  (idx % 2 === 0
                    ? "custom-table-row bg-card dark:bg-[#232323]"
                    : "custom-table-row bg-background dark:bg-[#181818]")
                  + " border-b border-border transition-colors " + rowClassName({ index: idx, row })
                }
              >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-foreground px-4 py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {t('table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t('table.page')} {table.getState().pagination.pageIndex + 1} {t('table.of')} {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">{t('table.goToFirstPage')}</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
        <Button
          variant="outline"
              className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
              <span className="sr-only">{t('table.goToPreviousPage')}</span>
              <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
              className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
              <span className="sr-only">{t('table.goToNextPage')}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t('table.goToLastPage')}</span>
              <ChevronsRight className="h-4 w-4" />
        </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
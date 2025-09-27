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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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

export function DataTable({ columns, data, filterKey = null, filterPlaceholder = "Filter...", tableClassName = "", rowClassName = () => "", headerClassName = "", filterFn = null }) {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: filterFn ? { custom: filterFn } : undefined,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        {filterKey && (
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterKey)?.getFilterValue() ?? "")}
            onChange={e => table.getColumn(filterKey)?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
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
                    <TableCell key={cell.id} className="text-foreground">
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
      <div className="flex items-center justify-center space-x-2 py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
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
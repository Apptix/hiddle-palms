import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ListFilter, Search, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface IColumn<T = unknown> {
  key: string;
  header: React.ReactNode;
  render?: ( value: unknown, row: T ) => React.ReactNode;
}

export interface IFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface IDataTableProps<T = unknown> {
  data: T[];
  columns: IColumn<T>[];
  filters?: IFilter[];
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: React.ReactNode;
  onPageChange?: ( page: number ) => void;
  onPageSizeChange?: ( pageSize: number ) => void;
  totalCount?: number;
  onRowClick?: ( row: T ) => void;
  loading?: boolean;
  rowClassName?: string;
  setFilters?: ( value ) => void;
  refetch?: () => void;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  showFilters = true,
  showSearch = true,
  showPagination = true,
  pageSize = 25,
  pageSizeOptions = [ 25, 50, 100, 200 ],
  onPageChange,
  onPageSizeChange,
  totalCount = 0,
  emptyMessage = "No data found",
  onRowClick,
  loading = false,
  rowClassName,
  setFilters,
  refetch
}: IDataTableProps<T> ) => {
  const [ currentPage, setCurrentPage ] = useState( 1 );
  const [ searchTerm, setSearchTerm ] = useState( "" );
  const [ activeFilters, setActiveFilters ] = useState<Record<string, string>>({});
  const [ currentPageSize, setCurrentPageSize ] = useState( pageSize );
  const [ filteredData, setFilteredData ] = useState( data );

  const handlePageChange = useCallback(( newPage: number ) => {
    setCurrentPage( newPage );
    onPageChange?.( newPage );
  }, [ setCurrentPage, onPageChange ]);

  useEffect(() => {
    let result = [...data];
    // Apply search
    if ( searchTerm ) {
      result = result.filter( item =>
        Object.values( item ).some( value =>
          String( value ).toLowerCase().includes( searchTerm.toLowerCase())
        )
      );
    }

    setFilteredData( result );
  }, [ data, searchTerm ]);

  const totalPages = Math.ceil( totalCount / currentPageSize );
  const startIndex = ( currentPage - 1 ) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const currentData = filteredData;

  const handlePageSizeChange = ( newSize: string ) => {
    const size = parseInt( newSize, 10 );
    setCurrentPageSize( size );
    // setCurrentPage( 1 );
    onPageSizeChange?.( size );
    handlePageChange( 1 );
  };

  const handleFilterChange = ( key: string, value: string ) => {
    setCurrentPage( 1 );
    setActiveFilters( prev => ({
      ...prev,
      [key]: value
    }));
    setFilters({
      ...activeFilters,
      [key]: value
    });
    handlePageChange( 1 );
  };

  const clearFilter = ( key: string ) => {
    handlePageChange( 1 );
    setActiveFilters( prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm( "" );
    setFilters?.({});
    handlePageChange( 1 );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        {showSearch && (
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={( e ) => setSearchTerm( e.target.value )}
              className="pl-8"
            />
          </div>
        )}
        <div className="flex">
          {refetch && <Button
            className="flex items-center gap-2 mr-2"
            variant="outline"
            aria-label="refresh"
            onClick={() => {
              if ( refetch ){
                refetch?.();
                handlePageChange( 1 );
              }
            }}
            tooltip="Refresh"
          >
            <RefreshCcw />
          </Button>
          }
          {showFilters && filters?.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2" aria-label="Filter">
                  <ListFilter />
                  <span>Filter</span>
                  {Object.keys( activeFilters ).length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.keys( activeFilters ).length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  {filters?.map(( filter ) => (
                    <div key={filter.key} className="space-y-2">
                      <label className="text-sm font-medium">{filter.label}</label>
                      <Select
                        value={activeFilters[filter.key] || "all"}
                        onValueChange={( value ) => handleFilterChange( filter.key, value )}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options.map(( option ) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={clearAllFilters}
                    disabled={Object.keys( activeFilters ).length === 0 && !searchTerm}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {Object.keys( activeFilters ).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries( activeFilters ).map(([ key, value ]) => {
            const filter = filters.find( f => f.key === key );
            const option = filter?.options.find( o => o.value === value );
            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
                onClick={() => clearFilter( key )}
              >
                {filter?.label}: {option?.label}
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      {loading ? (
        <Card className="mt-8">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-md" />
          </CardContent>
        </Card>
      ) :
        currentData.length > 0 ?
          <>
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map(( column ) => (
                      <TableHead key={column.key}>{column.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map(( row, index ) => (
                    <TableRow
                      key={index}
                      onClick={() => onRowClick?.( row )}
                      className={cn(
                        onRowClick && "cursor-pointer hover:bg-muted/50",
                        rowClassName
                      )}
                    >
                      {columns.map(( column ) => (
                        <TableCell key={column.key}>
                          {column.render
                            ? column.render( row[column.key], row )
                            : row[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {showPagination && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min( endIndex, totalCount )} of{" "}
                    {totalCount} entries
                  </span>
                  <Select
                    value={currentPageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map(( size ) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange( currentPage - 1 )}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange( currentPage + 1 )}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
          : <Card>
            <CardHeader className="text-center">
              <CardTitle>No Data</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {emptyMessage}
            </CardContent>
          </Card>
      }
    </div>
  );
};

DataTable.displayName = "DataTable";

export default DataTable;
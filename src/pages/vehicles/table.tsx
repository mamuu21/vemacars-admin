import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Download, MoreHorizontal, Pen, Trash } from 'lucide-react';

export interface CarImage {
  id: number;
  image: string;
  is_primary: boolean;
  file?: File;
}

export type Vehicle = {
  id: number | string;
  name: string;
  car_type: 'SUV' | 'Sedan' | 'Hatchback';
  fuel_type: 'Petrol' | 'Diesel' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  seats: number;
  location: string;
  price_per_day: number;
  status: "Available" | "Booked" | "Maintenance";
  amenities?: string;
  overview?: string;
  images: CarImage[];
};

type VehicleTableProps = {
  vehicles: Vehicle[];
  count: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filter: string;
  setFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: number | string) => void;
};

const getStatusBadge = (status: string) => {
  const styles = {
    Available: "bg-green-100 text-green-800",
    Booked: "bg-blue-100 text-blue-800",
    Maintenance: "bg-red-100 text-red-800"
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100"}`}>
      {status}
    </span>
  );
};

export const VehicleTable = ({
  vehicles,
  count,
  currentPage,
  setCurrentPage,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete
}: VehicleTableProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVehicle) {
      onDelete(selectedVehicle.id);
    }
    setShowDeleteModal(false);
    setSelectedVehicle(null);
  };

  const handleExportCSV = () => {
    if (vehicles.length === 0) return;

    const headers = ['ID', 'Name', 'Type', 'Price', 'Status'];
    const rows = vehicles.map(v => [
      v.id,
      v.name,
      v.car_type,
      v.price_per_day,
      v.status
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicles.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Available">Available</TabsTrigger>
            <TabsTrigger value="Booked">Booked</TabsTrigger>
            <TabsTrigger value="Maintenance">Maintenance</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Vehicle Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price / Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length > 0 ? vehicles.map((vehicle) => {
              const primaryImage = vehicle.images?.find(img => img.is_primary)?.image || vehicle.images?.[0]?.image;

              return (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="h-12 w-20 bg-gray-100 rounded overflow-hidden">
                      {primaryImage ? (
                        <img src={primaryImage} alt={vehicle.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.transmission} • {vehicle.fuel_type}</div>
                  </TableCell>
                  <TableCell>{vehicle.car_type}</TableCell>
                  <TableCell>Tsh {vehicle.price_per_day.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                          <Pen className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(vehicle)}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Showing {Math.min((currentPage - 1) * 10 + 1, count)} to {Math.min(currentPage * 10, count)} of {count} entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete vehicle <strong>{selectedVehicle?.name}</strong>?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedVehicle(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BackArrow from '@/components/ui/backarrow';
import { useToast } from '@/hooks/use-toast';
import { VehicleTable, type Vehicle } from './table';
import { VehicleForm } from './form';
import { VehiclesService } from '@/services/vehicles';

export const VehiclesPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("All");

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const fetchVehicles = async () => {
        setIsLoading(true);
        try {
            const data = await VehiclesService.getAll();
            setVehicles(data);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Simulate Backend Filter & Pagination
    const filteredVehicles = vehicles.filter(v => {
        const matchesFilter = filter === "All" || v.status === filter;
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.location?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const itemsPerPage = 10;
    const paginatedVehicles = filteredVehicles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSaveVehicle = async (vehicleData: any) => {
        try {
            if ('id' in vehicleData && vehicleData.id) {
                // Update
                await VehiclesService.update(vehicleData.id, vehicleData);
                toast({ title: "Success", description: "Vehicle inventory updated" });
            } else {
                // Create
                await VehiclesService.create(vehicleData);
                toast({ title: "Success", description: "Vehicle added to inventory" });
            }
            fetchVehicles();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Operation failed", variant: "destructive" });
        }
        setShowCreateModal(false);
        setEditingVehicle(null);
    };

    const handleDeleteVehicle = async (id: number | string) => {
        try {
            await VehiclesService.delete(id);
            toast({ title: "Success", description: "Vehicle deleted" });
            fetchVehicles();
        } catch (error) {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    const openEditModal = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setShowCreateModal(true);
    };

    const openCreateModal = () => {
        setEditingVehicle(null);
        setShowCreateModal(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <BackArrow onClick={() => navigate(-1)} />
                    <div>
                        <h2 className="text-xl font-semibold">Vehicle Inventory</h2>
                        <p className="text-sm text-gray-500">Internal fleet management overview.</p>
                    </div>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> New Vehicle
                </Button>
            </div>

            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-x-0 -top-10 text-center text-sm text-blue-500 animate-pulse">
                        Refreshing data...
                    </div>
                )}
                <VehicleTable
                    vehicles={paginatedVehicles}
                    count={filteredVehicles.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    filter={filter}
                    setFilter={setFilter}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onEdit={openEditModal}
                    onDelete={handleDeleteVehicle}
                />

                <VehicleForm
                    open={showCreateModal}
                    onOpenChange={(open) => {
                        setShowCreateModal(open);
                        if (!open) setEditingVehicle(null);
                    }}
                    onSubmit={handleSaveVehicle}
                    initialData={editingVehicle}
                />
            </div>
        </div>
    );
};

export default VehiclesPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Pen, Car } from 'lucide-react';
import { VehiclesService } from '@/services/vehicles';
import type { Vehicle } from '@/pages/vehicles/table';
// Reuse type from inventory table

export default function WebsiteVehiclesPage() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
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
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        (v.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Website Content: Vehicles</h1>
                    <p className="text-muted-foreground">Manage how your vehicles appear on the public website.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search vehicles to edit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                </div>
            ) : filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => {
                        const primaryImage = vehicle.images?.find(img => img.is_primary)?.image || vehicle.images?.[0]?.image;

                        return (
                            <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gray-100 relative">
                                    {primaryImage ? (
                                        <img
                                            src={primaryImage}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <Car className="h-12 w-12 mb-2 opacity-20" />
                                            <span>No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                                        {vehicle.car_type}
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                                    <CardDescription>
                                        Tsh {vehicle.price_per_day.toLocaleString()} / day
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="text-sm text-gray-500 line-clamp-2">
                                        {vehicle.overview || "No description set."}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">
                                        {vehicle.images?.length || 0} images • {vehicle.amenities ? vehicle.amenities.split(',').length : 0} amenities
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button
                                        className="w-full"
                                        onClick={() => navigate(`/website/vehicles/${vehicle.id}`)}
                                    >
                                        <Pen className="w-4 h-4 mr-2" /> Edit Website Content
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                    {searchQuery ? (
                        <>
                            <h3 className="text-lg font-medium">No vehicles found</h3>
                            <p>Try adjusting your search query.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-medium">No vehicles in inventory</h3>
                            <p>Add vehicles in the Inventory Management section first.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

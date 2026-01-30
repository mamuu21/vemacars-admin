import { useState, useEffect } from 'react';
import { WebsiteService } from '@/services/website';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImageIcon, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeroSectionData {
    id?: number;
    title: string;
    ticks: string; // Comma separated
    cta_text: string;
    background_image?: string | null;
    background_image_file?: File | null;
}

export default function HeroSectionPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<HeroSectionData>({
        title: '',
        ticks: '',
        cta_text: '',
        background_image: null,
        background_image_file: null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const data = await WebsiteService.getHero() as any;
                if (data) {
                    setFormData({
                        title: data.title || '',
                        ticks: data.ticks || '',
                        cta_text: data.cta_text || '',
                        background_image: data.background_image
                    });
                    if (data.background_image) {
                        setPreviewUrl(data.background_image);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch hero:", error);
                toast({
                    title: "Error",
                    description: "Failed to load hero section data.",
                    variant: "destructive"
                });
            }
        };
        fetchHero();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, background_image_file: file });
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await WebsiteService.updateHero(formData, formData.background_image_file || undefined);

            toast({
                title: "Success",
                description: "Hero section updated successfully",
            });
        } catch (error) {
            console.error("Update hero error:", error);
            toast({
                title: "Error",
                description: "Failed to update hero section",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper to parse ticks for preview
    const previewTicks = formData.ticks
        ? formData.ticks.split(',').map(t => t.trim()).filter(Boolean)
        : ['24/7 Support', 'Best Prices', 'Verified Cars']; // Default examples

    return (
        <div className="container mx-auto p-6 max-w-[1600px]">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Hero Section Editor</h1>
                    <p className="text-muted-foreground">Manage the main visual banner of your website.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* LEFT COLUMN: EDITOR FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="title">Main Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Find Your Perfect Drive"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ticks">Features List (Comma Separated)</Label>
                                <Textarea
                                    id="ticks"
                                    value={formData.ticks}
                                    onChange={(e) => setFormData({ ...formData, ticks: e.target.value })}
                                    placeholder="24/7 Support, Free Cancellation, Instant Booking"
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">These appear as check-marked items below the title.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cta">CTA Button Text</Label>
                                <Input
                                    id="cta"
                                    value={formData.cta_text}
                                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                    placeholder="e.g. Book Now"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Background Image</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative group">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={handleImageChange}
                                    />

                                    {previewUrl ? (
                                        <div className="relative w-full h-40 rounded-md overflow-hidden bg-slate-100">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" /> Change Image
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-muted-foreground">
                                            <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Click to upload image</span>
                                            <span className="text-xs">Recommended: 1920x1080px</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-6">
                            <Button variant="ghost" type="button" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                {/* RIGHT COLUMN: PREVIEW PANE */}
                <div className="space-y-4 lg:sticky lg:top-8">
                    <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground">Live Preview</Label>
                        <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'desktop' | 'mobile')}>
                            <TabsList className="grid w-[180px] grid-cols-2">
                                <TabsTrigger value="desktop">
                                    <Monitor className="w-4 h-4 mr-2" /> Desktop
                                </TabsTrigger>
                                <TabsTrigger value="mobile">
                                    <Smartphone className="w-4 h-4 mr-2" /> Mobile
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className={`
                        border rounded-xl overflow-hidden shadow-2xl bg-white
                        transition-all duration-300 mx-auto
                        ${previewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'}
                    `}>
                        {/* Browser Chrome Simulator */}
                        <div className="bg-slate-100 border-b px-4 py-2 flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <div className="flex-1 text-center">
                                <div className="bg-white rounded px-2 py-0.5 text-[10px] text-muted-foreground truncate max-w-[200px] mx-auto">
                                    vemacars.com
                                </div>
                            </div>
                        </div>

                        {/* Actual Hero Preview */}
                        <div className="relative min-h-[400px] flex items-center justify-center p-8 text-center text-white"
                            style={{
                                backgroundImage: `url(${previewUrl || '/placeholder-hero.jpg'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/50" />

                            {/* Content */}
                            <div className="relative z-10 max-w-2xl space-y-6">
                                <h1 className={`${previewMode === 'mobile' ? 'text-2xl' : 'text-5xl'} font-bold leading-tight drop-shadow-lg`}>
                                    {formData.title || "Your Main Headline Goes Here"}
                                </h1>

                                <div className={`flex flex-wrap justify-center gap-4 ${previewMode === 'mobile' ? 'text-xs' : 'text-base'}`}>
                                    {previewTicks.map((tick, index) => (
                                        <div key={index} className="flex items-center gap-1.5 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                                            <span>{tick}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        size={previewMode === 'mobile' ? 'sm' : 'lg'}
                                        variant="default" // Assuming you have a default theme variant that looks good
                                        className="font-semibold text-lg px-8"
                                    >
                                        {formData.cta_text || "Book Now"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mock content below hero to give context */}
                        <div className="p-8 space-y-4 bg-white opacity-50 grayscale select-none pointer-events-none">
                            <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse mb-6 mx-auto" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-video bg-slate-100 rounded" />
                                <div className="aspect-video bg-slate-100 rounded" />
                                <div className="aspect-video bg-slate-100 rounded" />
                            </div>
                        </div>

                    </div>
                    {previewMode === 'mobile' && (
                        <p className="text-center text-xs text-muted-foreground mt-2">Mobile Layout View (iPhone SE / 12 Mini approx)</p>
                    )}
                </div>
            </div>
        </div>
    );
}

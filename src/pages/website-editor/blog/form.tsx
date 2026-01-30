import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ImageIcon } from 'lucide-react';
import { WebsiteService } from '@/services/website';
import type { BlogPost } from './index';

export default function BlogPostForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        content: '',
        is_featured: false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                setFetching(true);
                try {
                    const data = await WebsiteService.getBlog(id);
                    setFormData({
                        title: data.title,
                        content: data.content,
                        is_featured: data.is_featured,
                    });
                    if (data.image) {
                        setPreviewUrl(data.image);
                    }
                } catch (error) {
                    console.error("Failed to fetch blog:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load blog post.",
                        variant: "destructive"
                    });
                    navigate('/website/blogs');
                } finally {
                    setFetching(false);
                }
            };
            fetchBlog();
        }
    }, [id, navigate, toast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await WebsiteService.updateBlog(id, formData, imageFile || undefined);
            } else {
                await WebsiteService.createBlog(formData, imageFile || undefined);
            }

            toast({
                title: "Success",
                description: `Blog post ${id ? 'updated' : 'created'} successfully`,
            });
            navigate('/website/blogs');
        } catch (error) {
            console.error("Save error:", error);
            toast({
                title: "Error",
                description: "Operation failed",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate('/website/blogs')} className="mb-4 pl-0 hover:pl-0 hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Button>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{id ? 'Edit Post' : 'Create New Post'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="title">Post Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter article title"
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="featured"
                                checked={formData.is_featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="featured">Featured Post</Label>
                                <p className="text-sm text-muted-foreground">Show this post in the homepage slider</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your article content here..."
                                className="min-h-[300px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Featured Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative group">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleImageChange}
                                />

                                {previewUrl ? (
                                    <div className="relative w-full h-48 rounded-md overflow-hidden bg-slate-100">
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
                                        <span className="text-sm font-medium">Click to upload cover image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <div className="flex gap-2">
                            <Button variant="outline" type="button" onClick={() => navigate('/website/blogs')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {id ? 'Update Post' : 'Publish Post'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

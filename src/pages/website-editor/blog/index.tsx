import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, MoreHorizontal, Pen, Trash, Star, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { WebsiteService } from '@/services/website';

export interface BlogPost {
    id: number;
    title: string;
    content: string;
    is_featured: boolean;
    created_at: string;
    image?: string;
}

export default function BlogListPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await WebsiteService.getBlogs();
            setBlogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
            toast({
                title: "Error",
                description: "Failed to load blog posts.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await WebsiteService.deleteBlog(id);
            setBlogs(blogs.filter(b => b.id !== id));
            toast({ title: "Deleted", description: "Blog post deleted successfully" });
        } catch (error) {
            console.error("Delete error:", error);
            toast({
                title: "Error",
                description: "Failed to delete blog post.",
                variant: "destructive"
            });
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your articles and news updates.</p>
                </div>
                <Button onClick={() => navigate('/website/blogs/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Post
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search posts..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="font-medium">{blog.title}</TableCell>
                                    <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {blog.is_featured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> Featured
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/website/blogs/${blog.id}/edit`)}>
                                                    <Pen className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(blog.id)}>
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No blog posts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

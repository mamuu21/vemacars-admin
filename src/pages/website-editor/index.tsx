import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function WebsiteEditor() {
    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-gray-50/50">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Construction className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Website Editor</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        This module is currently under development.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-500">
                        Once the API is ready, you will be able to edit the content of the Vema Cars public website directly from here.
                    </p>
                    <div className="p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
                        Status: <span className="font-semibold text-blue-600">Pending API Integration</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

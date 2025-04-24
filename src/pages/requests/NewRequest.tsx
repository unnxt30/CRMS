
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { MapPin, Upload, X } from "lucide-react";

export default function NewRequest() {
  const navigate = useNavigate();
  const { createRequest, isLoading } = useRepairRequests();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageData, setImageData] = useState<File[]>([]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // In a real app, this would upload to a server or cloud storage
      // For demo purposes, we'll use local URLs and limit to 3 images
      const newImageData = Array.from(files).slice(0, 3 - images.length);
      const newImageUrls = newImageData.map(file => URL.createObjectURL(file));
      
      setImageData(prev => [...prev, ...newImageData]);
      setImages(prev => [...prev, ...newImageUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Remove the image at the specified index
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageData(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createRequest({
      title,
      description,
      location,
      images,
    });
    
    if (success) {
      navigate(`/requests/${success}`);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <PageHeader 
          title="Report a Road Issue" 
          description="Provide details about the road issue to help us address it effectively."
        />
        
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Issue Title
                </label>
                <Input
                  id="title"
                  placeholder="E.g., Large pothole on Main Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Location
                </label>
                <Input
                  id="location"
                  placeholder="E.g., Main Street & Oak Avenue"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Please provide a specific location to help us find the issue.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Please describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-32"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Add Photos (Optional)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {images.length < 3 && (
                    <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  You can upload up to 3 photos. Supported formats: JPG, PNG. Max size: 5MB each.
                </p>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/requests")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

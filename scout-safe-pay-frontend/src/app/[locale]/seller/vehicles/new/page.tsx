'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus } from 'lucide-react';
import vehicleService from '@/lib/api/vehicles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddVehiclePage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    category: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    price: '',
    description: '',
    mileage: '',
    fuel_type: 'petrol',
    transmission: 'manual',
    color: '',
    doors: 4,
    seats: 5,
    body_type: '',
    engine_size: '',
    power_hp: '',
    location_city: '',
    location_country: 'DE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year.toString()),
        price: parseFloat(formData.price),
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        doors: formData.doors ? parseInt(formData.doors.toString()) : undefined,
        seats: formData.seats ? parseInt(formData.seats.toString()) : undefined,
        engine_size: formData.engine_size ? parseFloat(formData.engine_size) : undefined,
        power_hp: formData.power_hp ? parseInt(formData.power_hp) : undefined,
      };

      const response = await vehicleService.createVehicle(vehicleData);
      
      // Upload images if any
      if (images.length > 0 && response.id) {
        await vehicleService.uploadImages(response.id, images);
      }

      router.push(`/${params.locale}/seller/vehicles`);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Failed to create vehicle listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Vehicle</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the details to list your vehicle</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div>
              <label htmlFor="make" className="block text-sm font-medium mb-1">Make *</label>
              <Input id="make" name="make" value={formData.make} onChange={handleChange} required placeholder="e.g., BMW" autoComplete="off" />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1">Model *</label>
              <Input id="model" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g., 3 Series" autoComplete="off" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <Input name="year" type="number" value={formData.year} onChange={handleChange} required min="1900" max={new Date().getFullYear() + 1} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (€) *</label>
              <Input name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="25000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">VIN</label>
              <Input name="vin" value={formData.vin} onChange={handleChange} placeholder="Vehicle Identification Number" />
            </div>
          </div>
        </Card>

        {/* Technical Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mileage (km)</label>
              <Input name="mileage" type="number" value={formData.mileage} onChange={handleChange} placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="lpg">LPG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
                <option value="semi_automatic">Semi-Automatic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <Input name="color" value={formData.color} onChange={handleChange} placeholder="e.g., Blue" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doors</label>
              <Input name="doors" type="number" value={formData.doors} onChange={handleChange} min="2" max="6" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <Input name="seats" type="number" value={formData.seats} onChange={handleChange} min="1" max="9" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engine Size (L)</label>
              <Input name="engine_size" type="number" value={formData.engine_size} onChange={handleChange} step="0.1" placeholder="2.0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Power (HP)</label>
              <Input name="power_hp" type="number" value={formData.power_hp} onChange={handleChange} placeholder="150" />
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <Input name="location_city" value={formData.location_city} onChange={handleChange} required placeholder="e.g., Berlin" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <select name="location_country" value={formData.location_country} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                <option value="DE">Germany</option>
                <option value="AT">Austria</option>
                <option value="CH">Switzerland</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Describe your vehicle, its condition, features, history, etc."
          />
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Add Photo</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-gray-500">Add up to 20 photos. First photo will be the main image.</p>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'List Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
}

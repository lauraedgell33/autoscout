'use client';

import { useState } from 'react';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DealerBulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealer/bulk-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'make,model,year,price,mileage,fuel_type,transmission,vin\nBMW,3 Series,2020,25000,50000,petrol,automatic,WBADT43452GZ12345\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle_template.csv';
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Upload</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Import multiple vehicles from CSV</p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Upload CSV File</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
            {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />Download Template
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Upload & Process'}
            </Button>
          </div>
        </div>
      </Card>

      {results && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Upload Results</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>{results.success || 0} vehicles imported successfully</span>
            </div>
            {results.errors > 0 && (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>{results.errors} errors encountered</span>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-primary-50 dark:bg-blue-900/20">
        <h4 className="font-medium mb-2">CSV Format Requirements</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>First row must contain headers</li>
          <li>Required columns: make, model, year, price</li>
          <li>Optional: mileage, fuel_type, transmission, vin, description</li>
          <li>Maximum 500 vehicles per upload</li>
        </ul>
      </Card>
    </div>
  );
}

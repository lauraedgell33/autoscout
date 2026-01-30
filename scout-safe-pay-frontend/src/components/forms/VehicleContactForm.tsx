'use client';

import { useState } from 'react';
import { Send, Phone, Mail, MessageSquare, User, Loader2, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface VehicleContactFormProps {
  vehicleId: string;
  vehicleTitle: string;
  sellerName: string;
  sellerPhone?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  requestType: 'inquiry' | 'test-drive' | 'offer' | 'inspection';
}

const messageTemplates = {
  inquiry: 'Hi, I\'m interested in this vehicle. Could you provide more information?',
  'test-drive': 'Hi, I would like to schedule a test drive for this vehicle. When are you available?',
  offer: 'Hi, I would like to make an offer for this vehicle. Please let me know if you\'re open to negotiation.',
  inspection: 'Hi, I would like to arrange a professional inspection for this vehicle before purchase. Can we schedule this?',
};

export default function VehicleContactForm({
  vehicleId,
  vehicleTitle,
  sellerName,
  sellerPhone,
  onSubmit,
}: VehicleContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    requestType: 'inquiry',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch('/api/contact/vehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            vehicleId,
          }),
        });

        if (!response.ok) throw new Error('Failed to send message');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          requestType: 'inquiry',
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (type: ContactFormData['requestType']) => {
    setFormData({
      ...formData,
      requestType: type,
      message: messageTemplates[type],
    });
  };

  if (success) {
    return (
      <Card className="bg-green-50 border-2 border-green-300">
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900">Message Sent!</h3>
          <p className="text-green-700">
            The seller will receive your message and contact you soon.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Contact Seller</h3>
        <p className="text-blue-100">{vehicleTitle}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{sellerName}</span>
          </div>
          {sellerPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{sellerPhone}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Request Type Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">I want to:</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'inquiry' as const, label: 'General Inquiry', icon: MessageSquare },
              { type: 'test-drive' as const, label: 'Test Drive', icon: Phone },
              { type: 'offer' as const, label: 'Make Offer', icon: Mail },
              { type: 'inspection' as const, label: 'Inspection', icon: CheckCircle },
            ].map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                type="button"
                variant={formData.requestType === type ? 'primary' : 'outline'}
                className="h-auto py-3 flex-col gap-2"
                onClick={() => handleTemplateSelect(type)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Your Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="name"
              type="text"
              required
              placeholder="John Doe"
              className="pl-10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              required
              placeholder="john@example.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="+40 123 456 789"
              className="pl-10"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            required
            rows={6}
            placeholder="Type your message here..."
            className="resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            {formData.message.length} characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-14"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </>
          )}
        </Button>

        {/* Privacy Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 leading-relaxed">
            <Badge variant="default" className="bg-blue-100 text-blue-800 mb-2">
              Privacy Protected
            </Badge>
            <br />
            Your contact information will only be shared with the seller of this vehicle.
            We never share your data with third parties. Read our Privacy Policy for more details.
          </p>
        </div>
      </form>
    </Card>
  );
}

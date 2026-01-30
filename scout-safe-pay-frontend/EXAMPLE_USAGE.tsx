/**
 * Example Usage of UI/UX Polish Components
 * 
 * This file demonstrates how to use the newly implemented UI/UX components.
 * Copy these examples into your own components as needed.
 */

// ============================================
// 1. LOADING STATES & SKELETONS
// ============================================

import { VehicleListSkeleton, DashboardStatsSkeleton } from '@/components/skeletons';

export function VehiclesPageExample() {
  const { data: vehicles, isLoading } = useVehicles();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <VehicleListSkeleton count={9} />
      </div>
    );
  }
  
  return <VehicleGrid vehicles={vehicles} />;
}

export function DashboardExample() {
  const { data: stats, isLoading } = useDashboardStats();
  
  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }
  
  return <StatsCards stats={stats} />;
}

// ============================================
// 2. TOAST NOTIFICATIONS
// ============================================

import { showToast } from '@/lib/toast';

export function VehicleActionsExample() {
  const handleSaveVehicle = async (vehicleId: string) => {
    // Simple success toast
    try {
      await saveVehicle(vehicleId);
      showToast.success('Vehicle saved to favorites!');
    } catch (error) {
      showToast.error('Failed to save vehicle. Please try again.');
    }
  };
  
  const handleSaveVehicleWithPromise = async (vehicleId: string) => {
    // Promise-based toast with loading state
    await showToast.promise(
      saveVehicle(vehicleId),
      {
        loading: 'Saving vehicle...',
        success: 'Vehicle saved successfully!',
        error: 'Failed to save vehicle.',
      }
    );
  };
  
  const handleWarning = () => {
    showToast.warning('Your session will expire in 5 minutes.');
  };
  
  const handleInfo = () => {
    showToast.info('New vehicles matching your criteria are available.');
  };
  
  return (
    <div className="space-y-2">
      <Button onClick={() => handleSaveVehicle('123')}>Save Vehicle</Button>
      <Button onClick={() => handleSaveVehicleWithPromise('123')}>Save with Promise</Button>
      <Button onClick={handleWarning}>Show Warning</Button>
      <Button onClick={handleInfo}>Show Info</Button>
    </div>
  );
}

// ============================================
// 3. FORM VALIDATION
// ============================================

import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

export function ContactFormExample() {
  const [success, setSuccess] = useState('');
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await submitForm(data);
      setSuccess('Form submitted successfully!');
    } catch (error) {
      // Error is shown via form validation
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="John Doe"
        />
        <FormError message={errors.name?.message} />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder="john@example.com"
        />
        <FormError message={errors.email?.message} />
      </div>
      
      <FormSuccess message={success} />
      
      <Button loading={isSubmitting} type="submit" fullWidth>
        Submit Form
      </Button>
    </form>
  );
}

// ============================================
// 4. EMPTY STATES
// ============================================

import { NoVehicles, NoFavorites } from '@/components/empty-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

export function VehiclesListExample({ vehicles }) {
  if (vehicles.length === 0) {
    return <NoVehicles />;
  }
  
  return <VehicleGrid vehicles={vehicles} />;
}

export function FavoritesListExample({ favorites }) {
  if (favorites.length === 0) {
    return <NoFavorites />;
  }
  
  return <VehicleGrid vehicles={favorites} />;
}

export function CustomEmptyStateExample({ orders }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="You haven't placed any orders yet. Start shopping to see your orders here."
        actionLabel="Browse Vehicles"
        actionOnClick={() => router.push('/vehicles')}
      />
    );
  }
  
  return <OrdersList orders={orders} />;
}

// ============================================
// 5. BUTTON WITH LOADING STATE
// ============================================

import { Button } from '@/components/ui/button';
import { Save, Download, Trash } from 'lucide-react';

export function ButtonExamples() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAction = async () => {
    setIsLoading(true);
    try {
      await performAction();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Loading button */}
      <Button loading={isLoading} onClick={handleAction}>
        Save Changes
      </Button>
      
      {/* Button with left icon */}
      <Button leftIcon={<Save size={16} />}>
        Save
      </Button>
      
      {/* Button with right icon */}
      <Button rightIcon={<Download size={16} />}>
        Download
      </Button>
      
      {/* Different variants */}
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" leftIcon={<Trash size={16} />}>
        Delete
      </Button>
      
      {/* Different sizes */}
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      
      {/* Full width */}
      <Button fullWidth>Full Width Button</Button>
    </div>
  );
}

// ============================================
// 6. RESPONSIVE UTILITIES
// ============================================

import { useBreakpoint, useMediaQuery } from '@/lib/responsive';

export function ResponsiveComponentExample() {
  const breakpoint = useBreakpoint();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      
      {isMobile && <MobileNavigation />}
      {isTablet && <TabletNavigation />}
      {isDesktop && <DesktopNavigation />}
    </div>
  );
}

// ============================================
// 7. ANIMATIONS
// ============================================

export function AnimationExamples() {
  return (
    <div className="space-y-8">
      {/* Fade in */}
      <div className="animate-fade-in bg-white p-4 rounded-lg">
        Fade in animation
      </div>
      
      {/* Slide up */}
      <div className="animate-slide-up bg-white p-4 rounded-lg">
        Slide up animation
      </div>
      
      {/* Slide down */}
      <div className="animate-slide-down bg-white p-4 rounded-lg">
        Slide down animation
      </div>
      
      {/* Scale in */}
      <div className="animate-scale-in bg-white p-4 rounded-lg">
        Scale in animation
      </div>
      
      {/* With delays */}
      <div className="space-y-4">
        <div className="animate-slide-up bg-white p-4 rounded-lg">
          Item 1
        </div>
        <div className="animate-slide-up animation-delay-200 bg-white p-4 rounded-lg">
          Item 2 (delayed)
        </div>
        <div className="animate-slide-up animation-delay-400 bg-white p-4 rounded-lg">
          Item 3 (more delayed)
        </div>
      </div>
    </div>
  );
}

// ============================================
// 8. CARD HOVER EFFECTS
// ============================================

export function CardHoverExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="bg-white rounded-lg shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer"
        >
          <img src={vehicle.image} alt={vehicle.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{vehicle.title}</h3>
            <p className="text-gray-600">{vehicle.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 9. COMPLETE PAGE EXAMPLE
// ============================================

export function CompletePageExample() {
  const { data: vehicles, isLoading, error } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <VehicleListSkeleton count={6} />
      </div>
    );
  }
  
  // Handle error with toast
  if (error) {
    showToast.error('Failed to load vehicles. Please try again.');
    return null;
  }
  
  // Handle empty state
  if (vehicles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoVehicles />
      </div>
    );
  }
  
  const handleSave = async (vehicleId: string) => {
    setIsSaving(true);
    await showToast.promise(
      saveVehicle(vehicleId),
      {
        loading: 'Saving vehicle...',
        success: 'Vehicle saved successfully!',
        error: 'Failed to save vehicle.',
      }
    );
    setIsSaving(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Animated header */}
      <h1 className="text-4xl font-bold mb-8 animate-fade-in">
        Available Vehicles
      </h1>
      
      {/* Search with focus effect */}
      <div className="mb-8 animate-slide-up">
        <Input
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Vehicle grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className={`animate-scale-in animation-delay-${index * 200}`}
          >
            <VehicleCard 
              vehicle={vehicle}
              onSave={() => handleSave(vehicle.id)}
              isSaving={isSaving}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

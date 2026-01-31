<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $sellerRole = Role::firstOrCreate(['name' => 'seller', 'guard_name' => 'web']);
        $buyerRole = Role::firstOrCreate(['name' => 'buyer', 'guard_name' => 'web']);
        $dealerRole = Role::firstOrCreate(['name' => 'dealer', 'guard_name' => 'web']);

        // Create permissions
        $permissions = [
            // Vehicle permissions
            'view vehicles',
            'create vehicles',
            'edit vehicles',
            'delete vehicles',
            
            // Transaction permissions
            'view transactions',
            'create transactions',
            'manage transactions',
            
            // User permissions
            'view users',
            'edit users',
            'delete users',
            
            // Admin permissions
            'access admin panel',
            'manage settings',
            'view reports',
            'manage reviews',
            'manage disputes',
            'verify users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to admin
        $adminRole->givePermissionTo(Permission::all());

        // Assign permissions to seller
        $sellerRole->givePermissionTo([
            'view vehicles',
            'create vehicles',
            'edit vehicles',
            'delete vehicles',
            'view transactions',
            'create transactions',
        ]);

        // Assign permissions to buyer
        $buyerRole->givePermissionTo([
            'view vehicles',
            'view transactions',
            'create transactions',
        ]);

        // Assign permissions to dealer
        $dealerRole->givePermissionTo([
            'view vehicles',
            'create vehicles',
            'edit vehicles',
            'delete vehicles',
            'view transactions',
            'create transactions',
            'manage transactions',
        ]);

        $this->command->info('Roles and permissions seeded successfully!');
    }
}

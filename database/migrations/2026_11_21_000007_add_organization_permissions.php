<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seeds the Organization permissions into existing installs (fresh installs also
 * get them via PermissionSeeder/RoleSeeder). Idempotent.
 */
return new class extends Migration
{
    public function up(): void
    {
        $permissions = [
            ['name' => 'manage-organizations', 'module' => 'organizations', 'label' => 'Manage Organizations', 'description' => 'Can manage organizations'],
            ['name' => 'view-organizations',   'module' => 'organizations', 'label' => 'View Organizations',   'description' => 'View Organizations'],
            ['name' => 'create-organizations', 'module' => 'organizations', 'label' => 'Create Organizations', 'description' => 'Can create organizations'],
            ['name' => 'edit-organizations',   'module' => 'organizations', 'label' => 'Edit Organizations',   'description' => 'Can edit organizations'],
            ['name' => 'delete-organizations', 'module' => 'organizations', 'label' => 'Delete Organizations', 'description' => 'Can delete organizations'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name'], 'guard_name' => 'web'],
                [
                    'module' => $permission['module'],
                    'label' => $permission['label'],
                    'description' => $permission['description'],
                ]
            );
        }

        $names = array_column($permissions, 'name');
        $grants = Permission::whereIn('name', $names)->get();

        foreach (['superadmin', 'company'] as $roleName) {
            $role = Role::where('name', $roleName)->where('guard_name', 'web')->first();
            if ($role) {
                $role->givePermissionTo($grants);
            }
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        $names = ['manage-organizations', 'view-organizations', 'create-organizations', 'edit-organizations', 'delete-organizations'];
        Permission::whereIn('name', $names)->where('guard_name', 'web')->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};

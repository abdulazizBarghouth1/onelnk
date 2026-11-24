<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seeds the Circle permissions into existing installs (fresh installs also get
 * them via PermissionSeeder/RoleSeeder). Idempotent.
 */
return new class extends Migration
{
    public function up(): void
    {
        $permissions = [
            ['name' => 'manage-circles', 'module' => 'circles', 'label' => 'Manage Circles', 'description' => 'Can manage circles'],
            ['name' => 'view-circles',   'module' => 'circles', 'label' => 'View Circles',   'description' => 'View Circles'],
            ['name' => 'create-circles', 'module' => 'circles', 'label' => 'Create Circles', 'description' => 'Can create circles'],
            ['name' => 'edit-circles',   'module' => 'circles', 'label' => 'Edit Circles',   'description' => 'Can edit circles'],
            ['name' => 'delete-circles', 'module' => 'circles', 'label' => 'Delete Circles', 'description' => 'Can delete circles'],
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
        $names = ['manage-circles', 'view-circles', 'create-circles', 'edit-circles', 'delete-circles'];
        Permission::whereIn('name', $names)->where('guard_name', 'web')->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};

<?php

namespace App\Traits;

use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Shared tenant-scoping helpers.
 *
 * The tenant boundary in OneLnk is the "company" User and everyone it created
 * (its staff). Data (businesses, contacts, circles…) is scoped by the set of
 * businesses owned across that boundary. This centralises the logic that was
 * previously inlined in ContactController@index so Contacts and Circles agree.
 */
trait ResolvesTenantBusinesses
{
    /**
     * IDs of every business the given user may act on within its tenant.
     */
    protected function accessibleBusinessIds(User $user): Collection
    {
        $companyId = $this->tenantOwnerId($user);

        $ownerIds = User::where('created_by', $companyId)
            ->pluck('id')
            ->push($companyId);

        return Business::whereIn('created_by', $ownerIds)->pluck('id');
    }

    /**
     * The company User that owns this tenant (the plan holder).
     * For a company that's itself; for a staff member it's their creator.
     */
    protected function tenantOwner(User $user): User
    {
        if ($user->type === 'company') {
            return $user;
        }

        return User::find($user->created_by) ?? $user;
    }

    /**
     * The id of the company User that owns this tenant.
     */
    protected function tenantOwnerId(User $user): int
    {
        return $user->type === 'company'
            ? $user->id
            : ($user->created_by ?: $user->id);
    }
}

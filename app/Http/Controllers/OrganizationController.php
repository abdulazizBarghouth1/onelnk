<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Organization;
use App\Traits\ResolvesTenantBusinesses;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    use ResolvesTenantBusinesses;

    /**
     * Management listing of organizations for the tenant.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $businessIds = $this->accessibleBusinessIds($user);

        if ($businessIds->isEmpty()) {
            return Inertia::render('organizations/index', [
                'organizations' => [],
                'businesses' => [],
                'filters' => $request->only(['search']),
            ]);
        }

        $query = Organization::query()
            ->whereIn('business_id', $businessIds)
            ->withCount('contacts')
            ->with('business:id,name')
            ->orderBy($request->get('sort_field', 'name'), $request->get('sort_direction', 'asc'));

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $organizations = $query->get()->map(fn (Organization $org) => [
            'id' => $org->id,
            'name' => $org->name,
            'website' => $org->website,
            'phone' => $org->phone,
            'email' => $org->email,
            'notes' => $org->notes,
            'business_id' => $org->business_id,
            'business_name' => $org->business?->name,
            'contacts_count' => $org->contacts_count,
        ]);

        return Inertia::render('organizations/index', [
            'organizations' => $organizations,
            'businesses' => Business::whereIn('id', $businessIds)->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * JSON list of organizations for a given business (contact-form combobox).
     */
    public function list(Request $request)
    {
        $user = auth()->user();
        $businessIds = $this->accessibleBusinessIds($user);

        $query = Organization::whereIn('business_id', $businessIds);

        if ($request->filled('business_id') && $businessIds->contains($request->business_id)) {
            $query->where('business_id', $request->business_id);
        }

        return response()->json(
            $query->orderBy('name')->get(['id', 'name', 'business_id'])
        );
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $businessIds = $this->accessibleBusinessIds($user);

        $validated = $request->validate([
            'business_id' => ['required', Rule::in($businessIds->all())],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('organizations')->where(fn ($q) => $q->where('business_id', $request->business_id)),
            ],
            'website' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $organization = Organization::create($validated + ['created_by' => $user->id]);

        // Inline creation from the contact form expects the new record back.
        if ($request->wantsJson()) {
            return response()->json([
                'id' => $organization->id,
                'name' => $organization->name,
                'business_id' => $organization->business_id,
            ]);
        }

        return back()->with('success', __('Company created successfully.'));
    }

    public function update(Request $request, Organization $organization)
    {
        $this->authorizeOrganization(auth()->user(), $organization);

        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('organizations')
                    ->where(fn ($q) => $q->where('business_id', $organization->business_id))
                    ->ignore($organization->id),
            ],
            'website' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $organization->update($validated);

        return back()->with('success', __('Company updated successfully.'));
    }

    public function destroy(Organization $organization)
    {
        $this->authorizeOrganization(auth()->user(), $organization);

        // Contacts keep their record; their organization_id is nulled by the FK.
        $organization->delete();

        return back()->with('success', __('Company deleted successfully.'));
    }

    /**
     * Ensure the organization belongs to the current tenant.
     */
    protected function authorizeOrganization($user, Organization $organization): void
    {
        abort_unless(
            $this->accessibleBusinessIds($user)->contains($organization->business_id),
            403,
            __('You do not have permission to manage this company.')
        );
    }
}

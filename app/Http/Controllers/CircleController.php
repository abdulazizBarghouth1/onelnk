<?php

namespace App\Http\Controllers;

use App\Models\Circle;
use App\Models\Contact;
use App\Traits\ResolvesTenantBusinesses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CircleController extends Controller
{
    use ResolvesTenantBusinesses;

    /**
     * Listing of circles for the tenant, with contact counts and
     * a "created by me vs team" summary.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $businessIds = $this->accessibleBusinessIds($user);

        if ($businessIds->isEmpty()) {
            return Inertia::render('circles/index', [
                'circles' => [],
                'businesses' => [],
                'summary' => ['total' => 0, 'mine' => 0, 'team' => 0, 'max' => 0, 'remaining' => 0],
                'filters' => $request->only(['search']),
            ]);
        }

        $query = Circle::query()
            ->whereIn('business_id', $businessIds)
            ->withCount('contacts')
            ->with(['creator:id,name', 'business:id,name'])
            ->orderBy($request->get('sort_field', 'created_at'), $request->get('sort_direction', 'desc'));

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $circles = $query->get()->map(function (Circle $circle) {
            return [
                'id' => $circle->id,
                'name' => $circle->name,
                'description' => $circle->description,
                'color' => $circle->color,
                'business_id' => $circle->business_id,
                'business_name' => $circle->business?->name,
                'created_by' => $circle->created_by,
                'creator_name' => $circle->creator?->name,
                'contacts_count' => $circle->contacts_count,
                'created_at' => $circle->created_at,
            ];
        });

        $total = $circles->count();
        $mine = $circles->where('created_by', $user->id)->count();
        $max = (int) ($this->tenantOwner($user)->getCurrentPlan()->max_circles ?? -1);

        $businesses = $this->accessibleBusinesses($user);

        return Inertia::render('circles/index', [
            'circles' => $circles,
            'businesses' => $businesses,
            'summary' => [
                'total' => $total,
                'mine' => $mine,
                'team' => $total - $mine,
                'max' => $max,
                'remaining' => $max === -1 ? -1 : max(0, $max - $total),
            ],
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $businessIds = $this->accessibleBusinessIds($user);

        $validated = $request->validate([
            'business_id' => ['required', Rule::in($businessIds->all())],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('circles')->where(fn ($q) => $q->where('business_id', $request->business_id)),
            ],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        if (! $this->withinPlanLimit($user, $businessIds)) {
            $max = (int) $this->tenantOwner($user)->getCurrentPlan()->max_circles;

            return back()->with('error', __('You have reached your plan limit of :max circles.', ['max' => $max]));
        }

        Circle::create([
            'business_id' => $validated['business_id'],
            'created_by' => $user->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'color' => $validated['color'] ?? Circle::colorForName($validated['name']),
        ]);

        return back()->with('success', __('Circle created successfully.'));
    }

    public function update(Request $request, Circle $circle)
    {
        $user = auth()->user();
        $this->authorizeCircle($user, $circle);

        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('circles')
                    ->where(fn ($q) => $q->where('business_id', $circle->business_id))
                    ->ignore($circle->id),
            ],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        $circle->update($validated);

        return back()->with('success', __('Circle updated successfully.'));
    }

    public function destroy(Circle $circle)
    {
        $this->authorizeCircle(auth()->user(), $circle);

        $circle->delete();

        return back()->with('success', __('Circle deleted successfully.'));
    }

    /**
     * Attach existing contacts to a circle (bulk).
     */
    public function attachContacts(Request $request, Circle $circle)
    {
        $user = auth()->user();
        $this->authorizeCircle($user, $circle);

        $validated = $request->validate([
            'contact_ids' => ['required', 'array'],
            'contact_ids.*' => ['integer'],
        ]);

        // Only attach contacts that live in the same business as the circle.
        $ids = Contact::whereIn('id', $validated['contact_ids'])
            ->where('business_id', $circle->business_id)
            ->pluck('id');

        $circle->contacts()->syncWithoutDetaching($ids);

        return back()->with('success', __('Contacts added to circle.'));
    }

    public function detachContacts(Request $request, Circle $circle)
    {
        $this->authorizeCircle(auth()->user(), $circle);

        $validated = $request->validate([
            'contact_ids' => ['required', 'array'],
            'contact_ids.*' => ['integer'],
        ]);

        $circle->contacts()->detach($validated['contact_ids']);

        return back()->with('success', __('Contacts removed from circle.'));
    }

    /**
     * Export a circle's contacts as CSV or vCard (.vcf).
     */
    public function export(Request $request, Circle $circle): StreamedResponse
    {
        $this->authorizeCircle(auth()->user(), $circle);

        $format = $request->get('format', 'csv') === 'vcard' ? 'vcard' : 'csv';
        $contacts = $circle->contacts()->get();
        $slug = Str::slug($circle->name) ?: 'circle';

        if ($format === 'vcard') {
            return response()->streamDownload(function () use ($contacts) {
                foreach ($contacts as $contact) {
                    echo "BEGIN:VCARD\r\nVERSION:3.0\r\n";
                    echo 'FN:' . $this->vcardEscape($contact->name) . "\r\n";
                    if ($contact->email) {
                        echo 'EMAIL;TYPE=INTERNET:' . $this->vcardEscape($contact->email) . "\r\n";
                    }
                    if ($contact->phone) {
                        echo 'TEL:' . $this->vcardEscape($contact->phone) . "\r\n";
                    }
                    echo "END:VCARD\r\n";
                }
            }, "{$slug}.vcf", ['Content-Type' => 'text/vcard; charset=utf-8']);
        }

        return response()->streamDownload(function () use ($contacts) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Name', 'Email', 'Phone', 'Status', 'Notes']);
            foreach ($contacts as $contact) {
                fputcsv($out, [
                    $contact->name,
                    $contact->email,
                    $contact->phone,
                    $contact->status,
                    $contact->notes,
                ]);
            }
            fclose($out);
        }, "{$slug}.csv", ['Content-Type' => 'text/csv; charset=utf-8']);
    }

    /**
     * Businesses (for the create form), shaped for the frontend.
     */
    protected function accessibleBusinesses($user)
    {
        return \App\Models\Business::whereIn('id', $this->accessibleBusinessIds($user))
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    /**
     * Ensure the circle belongs to the current tenant.
     */
    protected function authorizeCircle($user, Circle $circle): void
    {
        abort_unless(
            $this->accessibleBusinessIds($user)->contains($circle->business_id),
            403,
            __('You do not have permission to manage this circle.')
        );
    }

    /**
     * True if the tenant is still under its plan's circle allowance.
     */
    protected function withinPlanLimit($user, $businessIds): bool
    {
        $max = (int) ($this->tenantOwner($user)->getCurrentPlan()->max_circles ?? -1);

        if ($max === -1) {
            return true;
        }

        return Circle::whereIn('business_id', $businessIds)->count() < $max;
    }

    protected function vcardEscape(?string $value): string
    {
        return str_replace([';', ',', "\n"], ['\\;', '\\,', '\\n'], (string) $value);
    }
}

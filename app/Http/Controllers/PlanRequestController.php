<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PlanRequestController extends BaseController
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if ($user->isSuperAdmin()) {
            return $this->adminIndex($request);
        } else {
            return $this->companyIndex($request);
        }
    }
    
    private function adminIndex(Request $request)
    {
        $query = PlanRequest::with(['user', 'plan', 'approver', 'rejector']);

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('plan', function ($planQuery) use ($search) {
                    $planQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $planRequests = $query->latest()->paginate($perPage);

        $planRequests->getCollection()->transform(function ($planRequest) {
            if ($planRequest->relationLoaded('user') && $planRequest->user) {
                $planRequest->user->append('avatar_url');
            }

            return $planRequest;
        });

        return Inertia::render('plans/plan-request', [
            'planRequests' => $planRequests,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'isSuperAdmin' => true
        ]);
    }
    
    private function companyIndex(Request $request)
    {
        $user = auth()->user();
        
        // Only show plan requests created by the current user
        $query = PlanRequest::with(['user', 'plan', 'approver', 'rejector'])
            ->where('user_id', $user->id);

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('plan', function ($planQuery) use ($search) {
                $planQuery->where('name', 'like', "%{$search}%");
            });
        }

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $planRequests = $query->latest()->paginate($perPage);

        $planRequests->getCollection()->transform(function ($planRequest) {
            if ($planRequest->relationLoaded('user') && $planRequest->user) {
                $planRequest->user->append('avatar_url');
            }

            return $planRequest;
        });

        return Inertia::render('plans/plan-request', [
            'planRequests' => $planRequests,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'isSuperAdmin' => false
        ]);
    }

    public function approve(PlanRequest $planRequest)
    {
        // Guard: only pending requests can be approved
        if ($planRequest->status !== 'pending') {
            return redirect()->route('plan-requests.index')
                ->with('error', __('This plan request has already been :status.', ['status' => $planRequest->status]));
        }
        // Guard: plan must still exist
        $plan = Plan::find($planRequest->plan_id);
        if (! $plan) {
            return redirect()->route('plan-requests.index')
                ->with('error', __('The requested plan no longer exists.'));
        }

        // Guard: user must still exist
        $user = $planRequest->user;
        if (! $user) {
            return redirect()->route('plan-requests.index')
                ->with('error', __('The requesting user no longer exists.'));
        }

        // Determine billing cycle (fallback to monthly if null)
        $billingCycle = $planRequest->billing_cycle ?? 'monthly';

        DB::transaction(function () use ($planRequest, $plan, $user, $billingCycle) {
            $planRequest->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            assignPlanToUser($user, $plan, $billingCycle);

            $planOrderData = [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'billing_cycle' => $billingCycle,
                'payment_method' => 'Plan Request',
                'coupon_code' => null,
                'payment_id' => null,
                'status' => 'approved',
                'processed_at' => now(),
            ];

            createPlanOrder($planOrderData);
        });

        return redirect()->route('plan-requests.index')->with('success', __('Plan request approved successfully!'));
    }

    public function reject(PlanRequest $planRequest)
    {
        $planRequest->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejected_by' => Auth::id(),
        ]);

        return redirect()->route('plan-requests.index')->with('success', __('Plan request rejected successfully!'));
    }
    
    public function destroy(PlanRequest $planRequest)
    {
        // Only allow deletion of pending requests by the owner or a superadmin
        $user = auth()->user();
        
        if ($planRequest->status !== 'pending' && !$user->isSuperAdmin()) {
            return redirect()->route('plan-requests.index')
                ->with('error', __('Only pending plan requests can be deleted'));
        }
        
        if ($planRequest->user_id !== $user->id && !$user->isSuperAdmin()) {
            return redirect()->route('plan-requests.index')
                ->with('error', __('You can only delete your own plan requests'));
        }
        
        $planRequest->delete();
        
        return redirect()->route('plan-requests.index')
            ->with('success', __('Plan request deleted successfully!'));
    }
}

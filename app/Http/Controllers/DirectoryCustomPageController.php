<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BusinessDirectoryCustomPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectoryCustomPageController extends Controller
{
    public function index(Request $request)
    {
        $query = BusinessDirectoryCustomPage::query();

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $sortField     = $request->get('sort_field', 'sort_order');
        $sortDirection = $request->get('sort_direction', 'asc');

        if (in_array($sortField, ['title', 'created_at', 'sort_order'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->ordered();
        }

        $pages = $query->paginate($request->get('per_page', 10))->withQueryString();

        return Inertia::render('business-directory/custom-pages/index', [
            'pages'   => $pages,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('business-directory/custom-pages/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255',
            'content'          => 'required|string',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active'        => 'boolean',
            'sort_order'       => 'nullable|integer'
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = BusinessDirectoryCustomPage::generateUniqueSlug($validated['title']);
        } else {
            $validated['slug'] = BusinessDirectoryCustomPage::generateUniqueSlug($validated['slug']);
        }

        BusinessDirectoryCustomPage::create($validated);
        return redirect()->route('directory.custom-pages.index')->with('success', __('Custom page created successfully!'));
    }

    public function update(Request $request, BusinessDirectoryCustomPage $customPage)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255',
            'content'          => 'required|string',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active'        => 'boolean',
            'sort_order'       => 'nullable|integer'
        ]);

        if (!empty($validated['slug']) && $validated['slug'] !== $customPage->slug) {
            $validated['slug'] = BusinessDirectoryCustomPage::generateUniqueSlug($validated['slug'], $customPage->id);
        } elseif (empty($validated['slug']) && $request->has('title') && $validated['title'] !== $customPage->title) {
            $validated['slug'] = BusinessDirectoryCustomPage::generateUniqueSlug($validated['title'], $customPage->id);
        }

        $customPage->update($validated);
        return redirect()->route('directory.custom-pages.index')->with('success', __('Custom page updated successfully!'));
    }

    public function edit(BusinessDirectoryCustomPage $customPage)
    {
        return Inertia::render('business-directory/custom-pages/edit', [
            'page' => $customPage
        ]);
    }

    public function destroy(BusinessDirectoryCustomPage $customPage)
    {
        $customPage->delete();
        return back()->with('success', __('Custom page deleted successfully!'));
    }

    public function show($slug)
    {
        $page = BusinessDirectoryCustomPage::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $pageData = [
            'title'            => $page->title,
            'content'          => $page->content,
            'slug'             => $page->slug,
            'meta_title'       => $page->meta_title ?: $page->title,
            'meta_description' => $page->meta_description
        ];

        $directorySettings = \App\Models\BusinessDirectorySetting::getSettings();
        $directorySettings->registrationEnabled = getSetting('registrationEnabled', true);
        \Shetabit\Visitor\Facade\Visitor::visit();

        return Inertia::render('business-directory/custom-pages/show', [
            'page'        => $pageData,
            'settings'    => $directorySettings,
            'customPages' => BusinessDirectoryCustomPage::active()->ordered()->get(['id', 'title', 'slug', 'is_active'])
        ]);
    }

    public function checkSlug(Request $request)
    {
        $request->validate([
            'slug'       => 'required|string|max:255',
            'exclude_id' => 'nullable|integer'
        ]);

        $exists = BusinessDirectoryCustomPage::slugExists($request->slug, $request->exclude_id);

        return response()->json([
            'available' => !$exists,
            'exists'    => $exists
        ]);
    }

    public function generateSlug(Request $request)
    {
        $request->validate([
            'title'      => 'required|string|max:255',
            'exclude_id' => 'nullable|integer'
        ]);

        $slug = BusinessDirectoryCustomPage::generateUniqueSlug($request->title, $request->exclude_id);

        return response()->json([
            'slug' => $slug
        ]);
    }
}


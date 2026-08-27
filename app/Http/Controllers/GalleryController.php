<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Admin CRUD for the marketing "Card Gallery" (image-only entries).
 * Images are handled the same way as NfcCardController: the MediaPicker hands
 * back a full URL, which we store as a relative `storageType:path` string and
 * convert back to a URL for display.
 */
class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $items = GalleryItem::orderBy('sort_order')->orderBy('id')->get()
            ->map(function (GalleryItem $item) {
                $item->image_url = $item->image ? getAssetUrl($item->image) : null;
                return $item;
            });

        return Inertia::render('gallery-manager/index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|string',
            'is_enabled' => 'boolean',
        ]);

        $validated['image'] = $this->convertToRelativePath($validated['image']);
        $validated['sort_order'] = (int) (GalleryItem::max('sort_order') ?? 0) + 1;
        $validated['is_enabled'] = $validated['is_enabled'] ?? true;

        GalleryItem::create($validated);

        return redirect()->back()->with('success', __('Gallery image added successfully'));
    }

    public function update(Request $request, GalleryItem $galleryItem)
    {
        $validated = $request->validate([
            'image' => 'nullable|string',
            'is_enabled' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (array_key_exists('image', $validated) && !empty($validated['image'])) {
            $validated['image'] = $this->convertToRelativePath($validated['image']);
        } else {
            unset($validated['image']);
        }

        $galleryItem->update($validated);

        return redirect()->back()->with('success', __('Gallery image updated successfully'));
    }

    /** Persist a new ordering: expects `order` = array of gallery item ids. */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:gallery_items,id',
        ]);

        foreach ($validated['order'] as $position => $id) {
            GalleryItem::where('id', $id)->update(['sort_order' => $position + 1]);
        }

        return redirect()->back()->with('success', __('Gallery order updated'));
    }

    public function destroy(GalleryItem $galleryItem)
    {
        $galleryItem->delete();

        return redirect()->back()->with('success', __('Gallery image deleted successfully'));
    }

    /** Convert a MediaPicker URL into a stored relative path (mirrors NfcCardController). */
    private function convertToRelativePath(string $url): string
    {
        if (!$url) return $url;

        if (!str_starts_with($url, 'http')) {
            return $url;
        }

        $storageIndex = strpos($url, '/storage/');
        if ($storageIndex !== false) {
            $path = substr($url, $storageIndex + 9);
            $currentStorageType = getSetting('storage_type', 'local');
            return $currentStorageType . ':' . $path;
        }

        return $url;
    }
}

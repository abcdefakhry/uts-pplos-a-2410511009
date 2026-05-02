<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['category', 'owner', 'rooms']);

        if ($request->has('search')) {
            $query->where('nama_kos', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = $request->query('per_page', 10);
        $properties = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $properties
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'owner_id'    => 'required|exists:owners,id',
            'nama_kos'    => 'required|string|max:255',
            'alamat'      => 'required|string',
        ]);

        $property = Property::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Properti berhasil ditambahkan',
            'data' => $property
        ], 201);
    }

    public function show($id)
    {
    try {
        $property = Property::with(['category', 'owner', 'rooms'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $property
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Properti tidak ditemukan'
        ], 404);
    }
}

public function update(Request $request, string $id)
{
    $validated = $request->validate([
        'category_id' => 'sometimes|required|exists:categories,id',
        'owner_id'    => 'sometimes|required|exists:owners,id',
        'nama_kos'    => 'sometimes|required|string|max:255',
        'alamat'      => 'sometimes|required|string',
        'deskripsi'   => 'sometimes|nullable|string',
    ]);

    $property = Property::findOrFail($id);

    $property->update($validated);

    return response()->json([
        'status'  => 'success',
        'message' => 'Properti berhasil diperbarui',
        'data'    => $property
    ], 200);
}

public function destroy(string $id)
{
    $property = Property::findOrFail($id);
    $property->delete();

    return response()->json([
        'status'  => 'success',
        'message' => 'Properti berhasil dihapus'
    ], 200);
}

}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        // menghindari N+1 query
        $query = Property::with(['category', 'owner', 'rooms']);

        // filtering berdasarkan nama
        if ($request->has('search')) {
            $query->where('nama_kos', 'like', '%' . $request->search . '%');
        }

        // filtering berdasarkan kategori
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // fitur paging dengan default 10 item per halaman
        $perPage = $request->query('per_page', 10);
        $properties = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $properties
        ], 200);
    }

    public function store(Request $request)
    {
        // validasi input
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
}

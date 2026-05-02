<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Owner;
use Illuminate\Http\Request;

class OwnerController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
            'nama_pemilik'   => 'required|string|max:255',
            'nomor_telepon'  => 'required|string|max:20',
            'alamat_pemilik' => 'required|string',
        ]);

        $owner = Owner::create($validated);
        return response()->json(['status' => 'success', 'data' => $owner], 201);
    }

    public function show(string $id) {
        $owner = Owner::with('properties')->find($id);
        if (!$owner) return response()->json(['message' => 'Data tidak ditemukan'], 404);
        return response()->json(['status' => 'success', 'data' => $owner], 200);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nama_pemilik'   => 'sometimes|required|string|max:255',
            'nomor_telepon'  => 'sometimes|required|string|max:20',
            'alamat_pemilik' => 'sometimes|required|string',
        ]);

        $owner = Owner::findOrFail($id);

        $owner->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Data pemilik berhasil diperbarui',
            'data'    => $owner
        ], 200);
    }

    public function destroy(string $id)
{
    $owner = Owner::findOrFail($id);
    $owner->delete();

    return response()->json([
            'status'  => 'success',
            'message' => 'Data pemilik berhasil dihapus'
        ], 200);
    }

}

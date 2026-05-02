<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index() {
        $rooms = Room::with('property')->paginate(10);
        return response()->json(['status' => 'success', 'data' => $rooms], 200);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'property_id'     => 'required|exists:properties,id',
            'nomor_kamar'     => 'required|string',
            'harga_per_bulan' => 'required|numeric',
            'is_available'    => 'boolean',
            'fasilitas'       => 'nullable|string'
        ]);

        $room = Room::create($validated);
        return response()->json(['status' => 'success', 'data' => $room], 201);
    }

    public function show($id) {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data kamar tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $room
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'property_id'     => 'sometimes|required|exists:properties,id',
            'nomor_kamar'     => 'sometimes|required|string',
            'harga_per_bulan' => 'sometimes|required|numeric',
            'is_available'    => 'sometimes|required|boolean',
            'fasilitas'       => 'nullable|string'
        ]);

        $room = Room::findOrFail($id);

        $room->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Data kamar berhasil diperbarui',
            'data'    => $room
        ], 200);
    }

    public function destroy(string $id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Kamar berhasil dihapus'
        ], 200);
}

}

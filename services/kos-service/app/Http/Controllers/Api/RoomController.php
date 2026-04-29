<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index() {
        // Menampilkan semua kamar dengan paging
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
}

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function createBooking(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'room_id'         => 'required|exists:rooms,id',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ]);

        // 2. Ambil data Kamar (Ganti axios.get kamu dengan query langsung)
        $room = Room::findOrFail($validated['room_id']);

        // 3. Perhitungan Durasi menggunakan Carbon
        $mulai = Carbon::parse($validated['tanggal_mulai']);
        $selesai = Carbon::parse($validated['tanggal_selesai']);

        $selisihHari = $mulai->diffInDays($selesai);

        if ($selisihHari <= 0) {
            return response()->json(['status' => 'error', 'message' => 'Durasi minimal 1 hari'], 400);
        }

        // 4. Hitung Durasi Bulan dan Total Harga (Logika persis seperti JS kamu)
        $durasiBulan = round($selisihHari / 30, 2);
        $totalHarga = round($durasiBulan * $room->harga_per_bulan);

        // 5. Simpan ke Database
        $booking = Booking::create([
            'user_id'         => auth()->id(), // Diambil dari Token JWT
            'room_id'         => $room->id,
            'tanggal_mulai'   => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'durasi_bulan'    => $durasiBulan,
            'total_harga'     => $totalHarga,
            'status'          => 'pending'
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Booking berhasil dibuat dengan perhitungan harga otomatis',
            'data'    => $booking
        ], 201);
    }
}

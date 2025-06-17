<?php

namespace App\Http\Controllers\api;

use App\Helpers\ReportHelper;
use App\Http\Controllers\Controller;
use App\Models\DB\DBDeliveries;
use App\Models\DB\DBReports;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    /**
     * Get summary of reports and stats.
     * 
     * @group Reports
     * 
     * @response {
     *   "dailyReport": 5,
     *   "returnRate": 12,
     *   "generatedBy": "Alice",
     *   "dailyLog": [
     *     {
     *       "date": "2025-06-09",
     *       "created_at": "2025-06-09T14:00:00Z",
     *       "name": "Alice",
     *       "notes": "Monthly summary",
     *       "total_returns": 10,
     *       "total_deliveries": 80,
     *       "total_reports": 1
     *     }
     *   ]
     * }
     */
    public function Reports()
    {
        return [
            'dailyReport' => $this->dailyReport(),
            'returnRate' => $this->returnRate(),
            'generatedBy' => $this->generatedBy(),
            'dailyLog' => $this->dailyLog(),
        ];
    }

    /**
     * Create a new report.
     * 
     * @group Reports
     * 
     * @bodyParam notes string required Notes for the report. Max length 1000 characters. Example: "Daily delivery summary"
     * 
     * @response 200 {
     *   "message": "Report created successfully"
     * }
     * @response 422 {
     *   "message": "The notes field is required."
     * }
     */
    public function createReport(Request $request)
    {
        $request->validate([
            'notes' => 'required|string|max:1000',
        ]);
        $reportHelper = new ReportHelper();
        return $reportHelper->createReport(Auth::user()->name, $request->input("notes"));
    }
    public function dailyReport(): int
    {
        return DBReports::whereYear('date', '=', now()->year)
            ->whereMonth('date', '=', now()->month)
            ->count();
    }

    public function returnRate()
    {
        $returned = DBDeliveries::whereYear('created_at', '=', now()->year)
            ->whereMonth('created_at', '=', now()->month)
            ->where(['status' => 'returned'])
            ->count();
        $total = DBDeliveries::whereYear('created_at', '=', now()->year)
            ->whereMonth('created_at', '=', now()->month)
            ->count();
        if ($total == 0 || $returned == 0) {
            return 0;
        }
        return (int) (($returned / $total) * 100);
    }

    public function generatedBy()
    {
        $lastUser = DBReports::orderBy('date', 'desc')->first(['generated_by as name']);
        if (!empty($lastUser)) {
            return $lastUser['name'];
        }
        return "";
    }

    /**
     * Get aggregated daily report logs.
     * 
     * @group Reports
     * 
     * @response [
     *   {
     *     "date": "2025-06-09",
     *     "created_at": "2025-06-09T14:00:00Z",
     *     "name": "Alice",
     *     "notes": "Monthly summary",
     *     "total_returns": 10,
     *     "total_deliveries": 80,
     *     "total_reports": 1
     *   }
     * ]
     */
    public function dailyLog()
    {
        return DBReports::select(
            'date',
            'created_at',
            'generated_by as name',
            'notes',
            DB::raw('SUM(total_returns) as total_returns'),
            DB::raw('SUM(total_deliveries) as total_deliveries'),
            DB::raw('COUNT(*) as total_reports')
        )
            ->groupBy('date', 'name', 'notes', 'created_at')
            ->orderBy('date', 'desc')
            ->paginate(15);

    }
}
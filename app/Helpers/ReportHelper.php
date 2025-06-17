<?php

namespace App\Helpers;

use App\Models\DB\DBDeliveries;
use App\Models\DB\DBPackages;
use App\Models\DB\DBReports;

class ReportHelper
{
    public function createReport($generated_by, $notes)
    {
        if ($this->isReportGenerated() == false) {
            DBReports::create([
                'date' => now()->format('Y-m-d'),
                'generated_by' => $generated_by,
                'total_deliveries' => $this->totalDeliveries($generated_by),
                'total_returns' => $this->totalReturns(),
                'notes' => $notes
            ]);
            return ['message' => 'Report created'];
        }
        DBReports::whereDate('date', '=', now()->format('Y-m-d'))
            ->update([
                'generated_by' => $generated_by,
                'total_deliveries' => $this->totalDeliveries($generated_by),
                'total_returns' => $this->totalReturns(),
                'notes' => $notes
            ]);
        return ['message' => 'Report updated'];
    }

    public function totalDeliveries($update = "user")
    {
        if ($update == "System") {
            DBDeliveries::whereDate('delivery_date', '=', now()->format('Y-m-d'))->update(['status' => 'returned']);
        }
        return DBPackages::join('tbl_deliveries', 'tbl_deliveries.id', '=', 'tbl_packages.delivery_id')
            ->whereDate('tbl_packages.delivered_at', '=', now()->format('Y-m-d'))
            ->count();
    }

    public function totalReturns()
    {
        return DBDeliveries::whereDate('delivery_date', '=', now()->format('Y-m-d'))
            ->where('status', 'returned')
            ->count();
    }
    public function isReportGenerated()
    {
        $reports = DBReports::whereDate('date', '=', now()->format('Y-m-d'))
            ->count();
        if ($reports > 0)
            return true;
        return false;
    }
}
?>
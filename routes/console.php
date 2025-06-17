<?php

use App\Helpers\ReportHelper;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::call(function () {
    $helper = new ReportHelper();
    $helper->createReport('System', 'Automated daily report');
})->dailyAt("00:00");
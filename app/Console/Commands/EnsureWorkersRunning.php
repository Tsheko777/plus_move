<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class EnsureWorkersRunning extends Command
{
    protected $signature = 'custom:ensure-workers';
    protected $description = 'Ensure queue:work and schedule:work are running';

    public function handle()
    {
        // Check if queue:work is running
        $queueRunning = $this->isProcessRunning('artisan queue:work');
        if ($queueRunning) {
            $this->info('queue:work is already running.');
        } else {
            $this->info('Starting queue:work...');
            Process::fromShellCommandline('php artisan queue:work --daemon')->start();
        }

        // Check if schedule:work is running
        $scheduleRunning = $this->isProcessRunning('artisan schedule:work');
        if ($scheduleRunning) {
            $this->info('schedule:work is already running.');
        } else {
            $this->info('Starting schedule:work...');
            Process::fromShellCommandline('php artisan schedule:work')->start();
        }

        return 0;
    }

    protected function isProcessRunning(string $needle): bool
    {
        $process = Process::fromShellCommandline("ps aux | grep '$needle' | grep -v grep");
        $process->run();
        return !empty(trim($process->getOutput()));
    }
}
?>
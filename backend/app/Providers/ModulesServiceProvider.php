<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModulesServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        foreach (File::directories(app_path('Modules')) as $modulePath) {
            $module = strtolower(basename($modulePath));
            $migrations = $modulePath.'/Database/Migrations';
            $apiRoutes = $modulePath.'/Routes/api.php';
            $webRoutes = $modulePath.'/Routes/web.php';

            if (is_dir($migrations)) {
                $this->loadMigrationsFrom($migrations);
            }

            if ($this->app->routesAreCached()) {
                continue;
            }

            if (is_file($apiRoutes)) {
                Route::middleware('api')
                    ->prefix('api/'.$module)
                    ->name($module.'.api.')
                    ->group($apiRoutes);
            }

            if (is_file($webRoutes)) {
                Route::middleware('web')
                    ->prefix($module)
                    ->name($module.'.web.')
                    ->group($webRoutes);
            }
        }
    }
}

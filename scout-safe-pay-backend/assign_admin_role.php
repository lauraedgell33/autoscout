<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('email', 'admin@autoscout24.com')->first();
if ($user) {
  echo 'Admin user: ' . $user->email . PHP_EOL;
  echo 'Has admin role: ' . ($user->hasRole('admin') ? 'Yes' : 'No') . PHP_EOL;
  if (!$user->hasRole('admin')) {
    $user->assignRole('admin');
    echo 'Assigned admin role' . PHP_EOL;
  }
} else {
  echo 'Admin user not found' . PHP_EOL;
}

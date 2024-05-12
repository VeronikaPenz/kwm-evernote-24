<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AngularController extends Controller {
  public static function index() {
    return view('angular');
  }
}
<?php

namespace App\Http\Controllers;

use App\Models\Share;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShareController extends Controller
{

  public function create(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $share = Share::create($req->all());
      DB::commit();
      return response()->json($share);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function delete($id): JsonResponse {
    DB::beginTransaction();
    try {
      $note = Share::all()->find($id);
      $note->delete();
      DB::commit();
      return response()->json(true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

}

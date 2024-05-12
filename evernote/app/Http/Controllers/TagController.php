<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagController extends Controller {

  public static function cleanupTags(){
    $tags = Tag::whereDoesntHave('todos')
      ->whereDoesntHave('notes')
      ->get();

    foreach($tags as $tag){
      $tag->delete();
    }
  }

  public function getByUserId($userId): JsonResponse {
    $tags = Tag::where('user_id', '=', $userId)->get();
    return response()->json($tags, 200);
  }

  public function create(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $tag = $req->all();
      $tag['user_id'] = auth()->user()->id;
      $tag = Tag::create($tag);
      DB::commit();
      return response()->json($tag);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function update(Request $req): JsonResponse {
    DB::beginTransaction();
    try {
      $id = $req->route('id');
      $tag = Tag::all()->find($id);
      $tag->update($req->all());
      DB::commit();
      return response()->json($tag);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }

  public function delete($id): JsonResponse {
    DB::beginTransaction();
    try {
      $tag = Tag::all()->find($id);
      $tag->delete();
      DB::commit();
      return response()->json(true);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json($e, 500);
    }
  }
}

<?php

namespace App\Http\Middleware;

use App\Models\Note;
use App\Models\NoteList;
use App\Models\Share;
use App\Models\Tag;
use App\Models\Todo;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use PHPOpenSourceSaver\JWTAuth\JWTAuth;

class Owner {
  /**
   * Handle an incoming request.
   *
   * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
   */
  public function handle(Request $req, Closure $next): Response {
    $namespace = $req->route()->action['namespace'];
    $id = $req->route('id');
    $userId = $req->route('userId');
    $user = auth()->user();

    if ($userId && $userId != $user->id) {
      return response()->json(['permission denied'], 401);
    }

    // Owner check for User modification
    if ($namespace == "User" && ($id && $id != $user->id)) {
      return response()->json(['permission denied'], 401);
    } elseif (!$userId && $namespace != "User") {

      // Owner check for other item modification
      $listId = null;
      $item = null;
      switch ($namespace) {
        case 'List':
          $listId = $id;
          break;
        case 'Note':
          $listId = $req->route('listId');
          $item = Note::all()->find($id);
          break;
        case 'Todo':
          $noteId = $req->route('noteId');
          if ($noteId) {
            $listId = Note::find($noteId)->list_id;
          }
          $item = Todo::with(['share'])->find($id);
          break;
        case 'Tag':
          $item = Tag::all()->find($id);
          break;
        case 'Share':
          $itemId = $id ? Share::all()->find($id)?->list_id : $req->list_id;
          $item = NoteList::all()->find($itemId);
          break;
      }

      if ($listId) {
        $share = Share::where('user_id', '=', $user->id)->where('list_id', '=', $listId)->first();
        if ($share) {
          $item = $share;
        } else {
          $item = NoteList::all()->find($listId);
        }
      }

      if (!$item) {
        return response()->json(['item not found'], 404);
      } else if ($item->user_id !== $user->id && $item['share']['user_id'] !== $user->id) {
        return response()->json(['permission denied: you do not own this item'], 401);
      }
    }

    if (!$user) {
      return response()->json(['permission denied'], 401);
    }

    return $next($req);
  }
}

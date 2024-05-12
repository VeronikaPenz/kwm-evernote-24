<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});

Route::namespace('Auth')->group(function () {
  Route::post('/auth/login', [\App\Http\Controllers\AuthController::class, 'login']);
  Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
});


Route::namespace('User')->group(function () {
  Route::post('/users/login', [\App\Http\Controllers\UserController::class, 'login']);
  Route::post('/users', [\App\Http\Controllers\UserController::class, 'create']);

  Route::group(['middleware' => ['auth.jwt']], function () {
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'getAll']);
    Route::group(['middleware' => ['auth.owner']], function () {

      Route::get('/users/{id}', [\App\Http\Controllers\UserController::class, 'getById']);
      Route::put('/users/{id}', [\App\Http\Controllers\UserController::class, 'update']);
      Route::delete('/users/{id}', [\App\Http\Controllers\UserController::class, 'delete']);
    });
  });
});


Route::namespace('List')->group(function () {
  Route::group(['middleware' => ['auth.jwt']], function () {
    Route::post('/lists', [\App\Http\Controllers\ListController::class, 'create']);
    Route::group(['middleware' => ['auth.owner']], function () {
      Route::get('/lists/{id}', [\App\Http\Controllers\ListController::class, 'getById']);
      Route::get('/lists/user/{userId}', [\App\Http\Controllers\ListController::class, 'getByUserId']);
      // ?sharedWith = 1 : Get all lists shared with {userId}

      Route::put('/lists/share/{id}', [\App\Http\Controllers\ListController::class, 'share']);
      Route::put('/lists/accept/{id}', [\App\Http\Controllers\ListController::class, 'accept']);
      Route::put('/lists/{id}', [\App\Http\Controllers\ListController::class, 'update']);
      Route::delete('/lists/{id}', [\App\Http\Controllers\ListController::class, 'delete']);
    });
  });
});


Route::namespace('Share')->group(function () {
  Route::group(['middleware' => ['auth.jwt', 'auth.owner']], function () {
    Route::post('/share', [\App\Http\Controllers\ShareController::class, 'create']);
    Route::delete('/share/{id}', [\App\Http\Controllers\ShareController::class, 'delete']);
  });
});


Route::namespace('Note')->group(function () {
  Route::group(['middleware' => ['auth.jwt']], function () {
    Route::post('/notes', [\App\Http\Controllers\NoteController::class, 'create']);
    Route::group(['middleware' => ['auth.owner']], function () {
      Route::get('/notes/{id}', [\App\Http\Controllers\NoteController::class, 'getById']);
      Route::get('/notes/user/{userId}', [\App\Http\Controllers\NoteController::class, 'getUnlistedByUserId']);
      Route::get('/notes/byList/{listId}', [\App\Http\Controllers\NoteController::class, 'getByListId']);
      Route::put('/notes/{id}', [\App\Http\Controllers\NoteController::class, 'update']);
      Route::delete('/notes/{id}', [\App\Http\Controllers\NoteController::class, 'delete']);
    });
  });
});


Route::namespace('Todo')->group(function () {
  Route::group(['middleware' => ['auth.jwt']], function () {
    Route::post('/todos', [\App\Http\Controllers\TodoController::class, 'create']);
    Route::group(['middleware' => ['auth.owner']], function () {
      Route::get('/todos/user/{userId}', [\App\Http\Controllers\TodoController::class, 'getByUserId']);
      Route::get('/todos/byNote/{noteId}', [\App\Http\Controllers\TodoController::class, 'getByNoteId']);
      Route::put('/todos/{id}', [\App\Http\Controllers\TodoController::class, 'update']);
      Route::delete('/todos/{id}', [\App\Http\Controllers\TodoController::class, 'delete']);
    });
  });
});


Route::namespace('Tag')->group(function () {
  Route::group(['middleware' => ['auth.jwt']], function () {
    Route::post('/tags', [\App\Http\Controllers\TagController::class, 'create']);
    Route::group(['middleware' => ['auth.owner']], function () {
      Route::get('/tags/{userId}', [\App\Http\Controllers\TagController::class, 'getByUserId']);
      Route::put('/tags/{id}', [\App\Http\Controllers\TagController::class, 'update']);
      Route::delete('/tags/{id}', [\App\Http\Controllers\TagController::class, 'delete']);
    });
  });
});
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NoteList extends Model {
  use HasFactory;

  protected $table = 'lists';
  protected $primaryKey = 'id';
  protected $fillable = [
    'title', 'description', 'user_id'
  ];

  public function user(): BelongsTo {
    return $this->belongsTo(User::class);
  }

  public function notes(): HasMany {
    return $this->hasMany(Note::class, 'list_id');
  }

  public function shares(): HasMany {
    return $this->hasMany(Share::class, 'list_id');
  }

  public function accepted($userId): bool {
    $share = Share::where('user_id', '=', $userId)->where('list_id', '=', $this->id)->get();
    return $share->accepted;
  }

}

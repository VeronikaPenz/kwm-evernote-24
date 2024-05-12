<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Todo extends Model {
  use HasFactory;

  protected $fillable = [
    'title', 'description', 'due_date', 'user_id', 'note_id', 'share_id'
  ];
  protected $casts = ['due_date' => 'datetime'];

  public function user(): BelongsTo {
    return $this->belongsTo(User::class);
  }

  public function note(): BelongsTo {
    return $this->belongsTo(Note::class);
  }

  public function share(): BelongsTo {
    return $this->belongsTo(Share::class);
  }

  public function tags(): BelongsToMany {
    return $this->belongsToMany(Tag::class, 'todo_tag');
  }
}

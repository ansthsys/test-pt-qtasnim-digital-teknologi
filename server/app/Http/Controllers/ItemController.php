<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
  }

  public function index()
  {
    $data = DB::table('items')
      ->join('item_types', 'items.item_type_id', '=', 'item_types.id')
      ->select([
        'items.id as item_id',
        'items.name as item_name',
        'items.stock as item_stock',
        'item_types.id as type_id',
        'item_types.name as type_name'
      ])
      ->get();

    return $this->successResponse('GET all Items successfully', $data);
  }

  public function show($id)
  {
    $data = DB::table('items')
      ->join('item_types', 'items.item_type_id', '=', 'item_types.id')
      ->where('items.id', $id)
      ->select([
        'items.id as item_id',
        'items.name as item_name',
        'items.stock as item_stock',
        'item_types.id as type_id',
        'item_types.name as type_name'
      ])
      ->first();

    if (!$data) {
      return $this->errorResponse("Item with id $id not found", 404);
    }

    return $this->successResponse("GET Item with id $id successfully", $data);
  }

  public function store(Request $request)
  {
    $this->validate($request, [
      'item_type_id' => 'required|integer|exists:item_types,id',
      'name' => 'required|string|max:255',
    ]);

    $data = DB::table('items')->insert([
      'item_type_id' => $request->item_type_id,
      'name' => $request->name,
      'stock' => 0,
    ]);

    return $this->successResponse('CREATE Item successfully', $request->all(), 201);
  }

  public function update(Request $request, $id)
  {
    $data = DB::table('items')->where('id', $id)->first();

    if (!$data) {
      return $this->errorResponse("Item with id $id not found", 404);
    }

    $this->validate($request, [
      'item_type_id' => 'required|integer|exists:item_types,id',
      'name' => 'required|string|max:255',
    ]);

    $data = DB::table('items')->where('id', $id)->update([
      'item_type_id' => $request->item_type_id,
      'name' => $request->name,
    ]);

    return $this->successResponse("UPDATE Item with id $id successfully", $request->all(), 200);
  }

  public function destroy($id)
  {
    $data = DB::table('items')->where('id', $id)->first();

    if (!$data) {
      return $this->errorResponse("Item with id $id not found", 404);
    }

    DB::table('items')->where('id', $id)->delete();

    return $this->successResponse("DELETE Item with id $id successfully", null, 200);
  }
}

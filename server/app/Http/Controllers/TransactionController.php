<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
  }

  public function index(Request $request)
  {
    $msg = "GET all Transactions successfully";
    $order = ['item_name', 'transaction_stock', 'transaction_quantity', 'transaction_date', 'type_name'];
    $sort = ['asc', 'desc'];
    $data = DB::table('transactions')
      ->join('items', 'transactions.item_id', '=', 'items.id')
      ->join('item_types', 'items.item_type_id', '=', 'item_types.id')
      ->select([
        'transactions.id as transaction_id',
        'transactions.quantity as transaction_quantity',
        'transactions.remaining_stock as transaction_stock',
        'transactions.date as transaction_date',
        'items.id as item_id',
        'items.name as item_name',
        // 'items.stock as item_stock',
        'item_types.id as type_id',
        'item_types.name as type_name'
      ]);

    if ($request->has('search') && $request->search != '') {
      $query = strtolower($request->search);
      $data->where(DB::raw('LOWER(items.name)'), 'like', "%$query%");
    }

    if ($request->has('order') && in_array($request->order, $order)) {
      $orderBy = $request->order;
      $sortBy = $request->has('sort') && in_array($request->sort, $sort) ? $request->sort : 'asc';
      $data->orderBy($orderBy, $sortBy);
    }

    $data = $data->get();

    return $this->successResponse($msg, $data);
  }

  public function show($id)
  {
    $data = DB::table('transactions')
      ->join('items', 'transactions.item_id', '=', 'items.id')
      ->join('item_types', 'items.item_type_id', '=', 'item_types.id')
      ->where('transactions.id', $id)
      ->select([
        'transactions.id as transaction_id',
        'transactions.quantity as transaction_quantity',
        'transactions.remaining_stock as transaction_stock',
        'transactions.date as transaction_date',
        'items.id as item_id',
        'items.name as item_name',
        // 'items.stock as item_stock',
        'item_types.id as type_id',
        'item_types.name as type_name'
      ])
      ->first();

    if (!$data) {
      return $this->errorResponse("Transaction with id $id not found", 404);
    }

    return $this->successResponse("GET Transaction with id $id successfully", $data);
  }

  public function store(Request $request)
  {
    $this->validate($request, [
      'item_id' => 'required|integer|exists:items,id',
      'quantity' => 'required|integer|min:1|max:50',
      'date' => 'required|date'
    ]);

    $item = DB::table('items')->where('id', $request->item_id)->first();
    $remaining_stock = $item->stock - $request->quantity;

    if ($remaining_stock < 0) {
      return $this->errorResponse('Stock is not enough', 400);
    }

    DB::table('transactions')->insert([
      'item_id' => $request->item_id,
      'quantity' => $request->quantity,
      'remaining_stock' => $item->stock,
      'date' => $request->date,
    ]);

    DB::table('items')->where('id', $request->item_id)->update([
      'stock' => $remaining_stock,
    ]);

    return $this->successResponse('CREATE Transactions successfully', $request->all(), 201);
  }

  public function compareTransactions(Request $request)
  {
    $startDate = $request->has('start_date') ? $request->start_date : '1970-01-01';
    $endDate = $request->has('end_date') ? $request->end_date : date('Y-m-d');
    $itemType = $request->has('item_type') ? $request->item_type : '';
    $msg = "GET compared Transactions successfully. $startDate - $endDate";

    if (Carbon::parse($startDate) > Carbon::parse($endDate)) {
      return $this->errorResponse('Start date must be less than end date', 400);
    }

    if (!$itemType) {
      return $this->errorResponse('Item type is required', 400);
    }

    $q = DB::table('transactions as t')
      ->join('items as i', 't.item_id', '=', 'i.id')
      ->join('item_types as it', 'i.item_type_id', '=', 'it.id')
      ->select(
        'it.name as type_name',
        'i.name as item_name',
        DB::raw('SUM(t.quantity) as total_penjualan'),
        DB::raw('MAX(i.id) as maximal')
      )
      ->where('it.id', $itemType)
      ->whereBetween('t.date', [$startDate, $endDate])
      ->groupBy('it.name', 'i.name')
      ->orderBy('total_penjualan', 'desc')
      ->get();

    $data = [];

    if ($q->isNotEmpty()) {
      $data = [
        "terbanyak" => $q->first(),
        "terendah" => $q->last()
      ];
    }

    return $this->successResponse($msg, $data);
  }
}

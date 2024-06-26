<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemTypeController extends Controller
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
        $data = DB::table('item_types');
        $msg = "GET all Item Types successfully";

        if ($request->has('search') && $request->search != '') {
            $data->where(DB::raw('LOWER(name)'), 'like', "%$request->search%");
            $msg = $msg . " with search $request->search";
        }

        $data = $data->get();

        return $this->successResponse($msg, $data);
    }

    public function show($id)
    {
        $data = DB::table('item_types')->where('id', $id)->first();

        if (!$data) {
            return $this->errorResponse("Item Type with id $id not found", 404);
        }

        return $this->successResponse("GET Item Type with id $id successfully", $data);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
        ]);

        $data = DB::table('item_types')->insert([
            'name' => $request->name,
        ]);

        return $this->successResponse('CREATE Item Type successfully', $request->all(), 201);
    }

    public function update(Request $request, $id)
    {
        $data = DB::table('item_types')->where('id', $id)->first();

        if (!$data) {
            return $this->errorResponse("Item Type with id $id not found", 404);
        }

        $this->validate($request, [
            'name' => 'required|string|max:255',
        ]);

        $data = DB::table('item_types')->where('id', $id)->update([
            'name' => $request->name,
        ]);

        return $this->successResponse("UPDATE Item Type with id $id successfully", $request->all(), 200);
    }

    public function destroy($id)
    {
        $data = DB::table('item_types')->where('id', $id)->first();

        if (!$data) {
            return $this->errorResponse("Item Type with id $id not found", 404);
        }

        DB::table('item_types')->where('id', $id)->delete();

        return $this->successResponse("DELETE Item Type with id $id successfully", null, 200);
    }
}

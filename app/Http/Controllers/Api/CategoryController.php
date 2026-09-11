<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::withCount('equipment')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'code' => ['required', 'string', 'max:20', 'unique:categories,code'],
            'description' => ['nullable', 'string'],
        ]);

        return response()->json(Category::create($data), 201);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100', 'unique:categories,name,' . $category->id],
            'code' => ['sometimes', 'required', 'string', 'max:20', 'unique:categories,code,' . $category->id],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($data);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        if ($category->equipment()->exists()) {
            return response()->json(['message' => 'Cannot delete a category that still has equipment assigned.'], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}

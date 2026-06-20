import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [editedPreview, setEditedPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();

        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
        else if (Array.isArray(data.categories)) setCategories(data.categories);
        else setCategories([]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Handle image change for new category
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewCategory({ ...newCategory, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.image)
      return alert("Please add name and image");

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("image", newCategory.image);

    try {
      const res = await fetch(`${API_URL}/categories/add`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setCategories([...categories, data]);
      setNewCategory({ name: "", image: null });
      setPreview(null);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // 🔹 Start edit
  const handleEdit = (cat) => {
    setEditingCategory(cat._id);
    setEditedName(cat.name);
    setEditedPreview(cat.image ? `${API_URL}/${cat.image}` : null);
  };

  // 🔹 Handle image change while editing
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditedImage(file);
    setEditedPreview(URL.createObjectURL(file));
  };

  // 🔹 Save edited category
  const handleSave = async (id) => {
    const formData = new FormData();
    formData.append("name", editedName);
    if (editedImage) formData.append("image", editedImage);

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        body: formData,
      });
      const updated = await res.json();
      setCategories(categories.map((cat) => (cat._id === id ? updated : cat)));
      setEditingCategory(null);
      setEditedImage(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="mt-12 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🗂️ Category Management
      </h2>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
        <input
          type="text"
          placeholder="Enter category name"
          className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border rounded-lg p-2"
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-12 h-12 object-cover rounded-lg border"
          />
        )}
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Category Table */}
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              {/* <th className="p-3 border-b">#</th> */}
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  {/* <td className="p-3 border-b">{index + 1}</td> */}
                  <td className="p-3 border-b">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  </td>
                  <td className="p-3 border-b">
                    {editingCategory === cat._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="border rounded-lg p-1"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                        />
                        {editedPreview && (
                          <img
                            src={editedPreview}
                            alt="edit preview"
                            className="w-10 h-10 rounded-md border"
                          />
                        )}
                      </div>
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="p-3 border-b flex gap-2">
                    {editingCategory === cat._id ? (
                      <button
                        onClick={() => handleSave(cat._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(cat)}
                        className="w-12 h-12 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryPage;

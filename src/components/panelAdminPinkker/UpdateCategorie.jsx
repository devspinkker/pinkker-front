import React, { useState, useEffect } from "react";
import { getCategoriesWithLimit } from "../../services/backGo/streams";
import { updateCategoria } from "../../services/backGo/solicitudApanelPinkker";
import CardCategorie from "../home/categories/CardCategorie";

export default function UpdateCategorie() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const getCategoriesWithLimitData = await getCategoriesWithLimit();
      if (getCategoriesWithLimitData?.message === "ok") {
        setCategories(getCategoriesWithLimitData.data);
      }
    };

    fetchData();
  }, []);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.nombre);
    setShowEditDropdown(true);
  };

  const handleCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleCategoryImageChange = (e) => {
    setNewCategoryImage(e.target.files[0]);
  };

  const handleDeleteChange = (e) => {
    setDeleteCategory(e.target.checked);
  };

  const handleCategorySubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", newCategoryName);
      formData.append("avatar", newCategoryImage);
      formData.append("Delete", deleteCategory);
      formData.append("CodeAdmin", code);

      if (selectedCategory) {
        const updatedCategories = categories.map((category) => {
          if (category.nombre === selectedCategory.nombre) {
            return { ...category, nombre: newCategoryName };
          }
          return category;
        });
        setCategories(updatedCategories);
      } else {
        const newCategory = {
          nombre: newCategoryName,
          img: "",
          spectators: 0,
          TopColor: "",
        };
        setCategories([...categories, newCategory]);
      }

      setSelectedCategory(null);
      setNewCategoryName("");
      setNewCategoryImage(null);
      setDeleteCategory(false);
      setShowEditDropdown(false);
      const token = localStorage.getItem("token");

      const response = await updateCategoria(formData, token);
      if (response.message !== "ok") {
        setError("Invalid code. Please try again.");
      } else {
        setError(null);
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-container">
      {error && <p className="error">{error}</p>}
      <div className="categories-container">
        {categories?.map((category, index) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(category);
            }}
            key={index}
          >
            <h5
              style={{
                color: "#fff",
              }}
            >
              {category.nombre}
            </h5>
            <CardCategorie
              width={"160px"}
              isLoading={false}
              name={category.nombre}
              image={category.img ?? "/images/pinkker-stream.png"}
              spectators={category.spectators}
              TopColor={category.TopColor}
            />
          </div>
        ))}
      </div>
      <div className="EditarCategoria">
        <button onClick={() => setShowEditDropdown(!showEditDropdown)}>
          Editar Categoría
        </button>
        {showEditDropdown && (
          <div className="edit-dropdown">
            <input
              type="text"
              value={newCategoryName}
              onChange={handleCategoryNameChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleCategoryImageChange}
            />
            <input
              type="checkbox"
              id="delete-category"
              checked={deleteCategory}
              onChange={handleDeleteChange}
            />
            <label htmlFor="delete-category">Delete category</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              required
            />
            <button onClick={handleCategorySubmit}>Submit Category</button>
          </div>
        )}
      </div>
    </div>
  );
}
